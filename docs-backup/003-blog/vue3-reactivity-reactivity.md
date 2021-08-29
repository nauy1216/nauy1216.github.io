### 1、reactive、shallowReactive、readonly、shallowReadonly
这四个方法内部都是调用的`createReactiveObject`方法。在内部使用的Proxy对`target`进行的代理，
以此做到对对象访问的拦截。

```typescript
function createReactiveObject(
  target: Target, // 需要进行代理的对象
  isReadonly: boolean, // 是否只读
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // target必须是一个对象, 否则返回自身。
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  // 如果已经代理则返回自身
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  // readonlyMap和reactiveMap都是WeakMap对象，用于缓存已经进行代理的target
  // proxyMap.set(target, proxy), 使用WeakMap的好处是，当target被回收时，proxy也会被系统回收。
  const proxyMap = isReadonly ? readonlyMap : reactiveMap

  // 先从map中获取, 如果已存在表明之前已经使用Proxy处理过了， 直接返回即可
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  // 用于验证target是否能被proxy,
  // 当被标识为ReactiveFlags.SKIP或者Object.isExtensible(target)为false时，说明这个是一个INVALID的对象
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }

  // 使用Proxy对象进行代理拦截target
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

### reactive的handlers
在调用`createReactiveObject`传入的是`mutableHandlers`和`mutableCollectionHandlers`,
`mutableCollectionHandlers`是针对类型为`TargetType.COLLECTION`的对象使用的。
```typescript
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  // 如果target被标记为readonly则直接返回target
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  return createReactiveObject(
    target,
    false, // isReadonly
    mutableHandlers, // baseHandlers
    mutableCollectionHandlers // collectionHandlers
  )
}
```


`mutableHandlers`是从模块`baseHandlers.ts`导出的一个对象, 这个对象将作为`new Proxy()`的参数。
```typescript
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
```

##### 创建`get`的具体逻辑如下：
```typescript
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    // 如果访问__v_isReactive属性
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    // 访问__v_isReadonly属性
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    // 访问__v_raw属性, 返回target本身
    } else if (
      key === ReactiveFlags.RAW &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
      return target
    }

    // 处理target是数组的情况
    const targetIsArray = isArray(target)
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    // 获取target[key]的值
    // 使用Reflect.get时，如果target对象中指定了getter，receiver则为getter调用时的this值。
    const res = Reflect.get(target, key, receiver)

    // 如果key是symbol类型的值，或者是__proto__和__V_isRef则直接返回， 不进行track
    const keyIsSymbol = isSymbol(key)
    if (
      keyIsSymbol
        ? builtInSymbols.has(key as symbol)
        : key === `__proto__` || key === `__v_isRef`
    ) {
      return res
    }

    // 如果对象是readonly, 那么表示这个对象的属性将不会改变，也就没有必要进行依赖追踪了。
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    // 如果是shallow, 那么只对target的key属性值改变进行追踪, 至于target[key]内部是否改变将不追踪。
    if (shallow) {
      return res
    }

    // 如果是一个ref对象，则返回ref.value
    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    // 如果是一个简单的对象， 将进行递归调用reactive或者readonly
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```
`reactivity`对数据收集依赖是在get方法里完成的。`track(target, TrackOpTypes.GET, key)`这一行代码完成了对数据依赖，
使得`reactive`对象和`effect`进行了关联。他们是多对多的关系，即当一个`reactive`对象发生改变可能通知多个`effect`, 同样的一个`effect`
可能订阅了多个`reactive`对象，只要其中一个`reactive`对象发生了改变就会重新执行`effect`。

全局变量`activeEffect`保存了当前正在执行的`effect`。
当执行`track`方法时, 将会将当前访问的数据添加到`activeEffect`的`deps`上。
```typescript
export function track(target: object, type: TrackOpTypes, key: unknown) {
  // shouldTrack 控制是否追踪的开关
  // activeEffect 保存当前正在执行的effect
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  // 订阅target对象的effect集合，这是一个map对象，target的每一个属性值都对应一个Set对象
  // Map<string, Set>
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 获取访问key的用于保存effect的set对象。
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 如果activeEffect还未订阅target[key]
  if (!dep.has(activeEffect)) {
    // 数据保存对effect的引用, 当数据发生变化时, 就遍历通知dep中的所有effect
    dep.add(activeEffect)
    // effect保存对数据的dep对象的引用, 当effect需要取消对每个数据的订阅时, 就可通过dep移除effect即可
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}
```


##### 创建`set`的具体逻辑如下：

```typescript
function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    // 旧值
    const oldValue = (target as any)[key]

    if (!shallow) {
      // 如果value是一个Proxy对象则将返回对应的target, 如果不是则直接返回value
      value = toRaw(value)
      // 如果target不是数组, 并且oldValue是一个ref对象, value不是一个ref对象。
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }

    // 判断key是否是target的属性
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    // 赋值
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original

    // 判断如果是修改原型上的属性将不会触发?????
    if (target === toRaw(receiver)) {
      // 针对hadKey做出了两种处理
      // 如果之前不存在key
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
```
##### `trigger`的逻辑

```typescript
export function trigger(
  target: object, // 操作的目标对象
  type: TriggerOpTypes, // 操作的类型
  key?: unknown, // 操作的key
  newValue?: unknown, // 新值
  oldValue?: unknown, // 旧值
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    // 没有被订阅过
    return
  }

  const effects = new Set<ReactiveEffect>()
  // 添加除activeEffect外的effect
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      // 遍历Set
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect) {
          effects.add(effect)
        }
      })
    }
  }

  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    // 遍历Map
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {
    // 如果target是数组, keys是length, 更新数组的长度
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        add(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    // key不是undefined时
    if (key !== void 0) {
      add(depsMap.get(key))
    }
    // also run for iteration key on ADD | DELETE | Map.SET
    const shouldTriggerIteration =
      (type === TriggerOpTypes.ADD &&
        (!isArray(target) || isIntegerKey(key))) ||
      (type === TriggerOpTypes.DELETE && !isArray(target))
    if (
      shouldTriggerIteration ||
      (type === TriggerOpTypes.SET && target instanceof Map)
    ) {
      add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
    }
    if (shouldTriggerIteration && target instanceof Map) {
      add(depsMap.get(MAP_KEY_ITERATE_KEY))
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    // 执行effect
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  // 通知所有effect
  effects.forEach(run)
}

```

### Proxy的用法
##### `const proxyObj = new Proxy(target, handlers)`
1、`target`: 需要进行代理的对象。
2、`handlers`: 一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。
3、想要拦截起作用, 需要通过proxyObj对象访问。
4、如果handlers是一个空对象，那么访问proxyObj就像直接访问target一样。

#####  常用的handlers
1、`get`
```javascript
const handler = {
  get(target, propKey) {
    return 'abc';
  }
};
```
2、`set`
```javascript
const handler = {
  // receiver: proxyObj本身
  set: function(target, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
```

```javascript
function Parent() {
}
Parent.prototype.a = 1
Parent.prototype.b = 2

const target = new Parent()
target.c = 3

const prox = new Proxy(target, {
  get(target, key) {
    console.log(target, key)
    return target[key]
  },
  set(target, key, val, receiver) {
    console.log(target, key, val, receiver)
    target[key] = val
    return true
  }
})

```



