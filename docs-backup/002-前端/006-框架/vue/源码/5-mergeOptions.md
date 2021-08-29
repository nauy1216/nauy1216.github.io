### mergeOptions
在执行`new Vue(option)`时会对传入的`options`进行合并处理。合并后的options将会赋值给$options。
- 为什么要处理？
- 怎样处理的？
- 在内部创建组件和通过`new Vue`创建组件的区别？
都会调用mergeOptions，只是调用的时机不同。

```js
// 组件
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    // 初始化内部调用创建组件的参数
    initInternalComponent(vm, options)
} else {
    // 通过合并策略得到最终的options
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor), /**从构造函数上获得的options, 即构造函数的属性options */
        options || {}, /**用户传入的options */
        vm
    )
}
```

> 只有外部创建组件才会执行mergeOptions的逻辑？

### 首先获取构造函数上的options

```js
// 获取构造函数上的options
export function resolveConstructorOptions (Ctor: Class<Component>) {
  /**
   获取当前构造函数上的options
    {
      "components": {
        "KeepAlive": {},
        "Transition": {},
        "TransitionGroup": {}
      },
      "directives": {
        "model": {},
        "show": {}
      },
      "filters": {}
    }
   */
  let options = Ctor.options

  /* 如果当前构造函数有父级 */
  if (Ctor.super) {
    /* 先从父级获取options */
    // 递归获取父级的父级的options
    const superOptions = resolveConstructorOptions(Ctor.super)
    /* 获取缓存在Ctor上 super option */
    /*
      为什么在Vue.extend已经合并过一次，这里会再一次合并？
      因为Vue.extend的时候会缓存上一次的合并的结果, 所以这里会判断父类的options是否发生变化，
      如果变化了就重新合并
    */
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
```

### 将传入的options与从构造函数上的options合并
- 对`parent`和`child`上的options进行遍历合并，不同的字段有不同的合并策略。
- 如果遇到`extends`和`mixins`将进行递归调用`mergeOptions`

```js
// 在Vue.extend和this._init内部都会调用
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  /*
  如果传入的是一个function类型， 则可能是一个构造函数，在Vue.extend内部已经执行过一次mergeOptions了
   */
  if (typeof child === 'function') {
    child = child.options
  }

  // 规范处理props
  normalizeProps(child, vm)
  // 规范处理inject
  normalizeInject(child, vm)
  // 规范处理directive
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  // 处理extends和mixins
  // 先处理extends,再处理mixins, 最后处理自己定义的options
  // 所以如果是data、computed、method后者覆盖前者
  // 如果是生命周期钩子， 将会依次加入数组顺序执行
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  // 根据不同的合并策略合并options
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  // 返回最终的到的options
  return options
}

```

### 合并策略
在`Vue.config.optionMergeStrategies`上能访问到所有的合并策略。

### 默认合并策略
覆盖策略，只要`childVal`存在就用`childVal`, 否则就使用`parentVal`。
```js
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}

```

### 合并data
    - 如果data是一个function那么会先求值再合并。
    - 遍历从parent哪里获取的data, 当child不存在key时直接赋值给child, 或者child存在key但是parent[key]的值是一个对象，
        此时会递归调用mergeData。
    - 需要跳过__ob__属性, 这是对象进行reactive处理时创建的Observer对象。
```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    // 如果合并的function,则先求值再合并
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

// 将对象from合并到对象to
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to
  let key, toVal, fromVal

  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    // 如果原来的对象没有这个属性，则直接添加到原来的对象上
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
    } else if ( // 如果toVal和fromVal不相等并且都是json对象则合并这两个对象
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

```


### 合并生命周期
生命周期的合并不是简单的覆盖而是将extends和mixins还有组件本身定义的hook
合并为一个数组，执行的顺序一次是 extends、mixins、options定义。

> 注意： 当mixins或extends、options都定义了同一个生命周期钩子， 但是引用的都是同一个函数，
> 因为会对合并后的hook数组去重，所以实际上只会执行一次。
```js
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
  return res
    ? dedupeHooks(res)
    : res
}

// 去重
function dedupeHooks (hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}
```


#### components、filter、directives的合并策略
简单的对两个对象进行`extend`覆盖合并。
```js
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}
```


### watch合并
会将`watch`合并成一个数组。
```js
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
```

### props、methods、inject、computed的合并策略
extend合并。
```js
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```