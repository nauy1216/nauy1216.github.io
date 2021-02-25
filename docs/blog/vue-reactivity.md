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

创建`get`的具体逻辑如下：
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
当执行`track`方法时, 将会将当前访问的数据添加
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


