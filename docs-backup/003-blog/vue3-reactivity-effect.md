### effect()
`effect`是vue3才有的概念, vue2有一个类似的概念`watch`。
`effect`的逻辑如下。

```typescript
export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: true 
  id: number
  active: boolean
  raw: () => T
  deps: Array<Dep>
  options: ReactiveEffectOptions
}

export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  // 如果fn已经是effect
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  // 如果不是异步执行
  if (!options.lazy) {
    effect()
  }
  return effect
}

```

`createReactiveEffect`接受原本的函数`fn`和一个`options`对象, 返回一个`effect`函数。
在`effect`函数执行时，会将`effect`赋值给`activeEffect`。
```typescript
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    // 如果effect不是出于active状态, 则直接执行fn
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    // effect嵌套的时候将会有一个activeEffect栈, 如果当前栈内不存在effect时才会加入
    if (!effectStack.includes(effect)) {
      // 清楚上一次的数据订阅，解除数据和effect的双向引用
      cleanup(effect)
      try {
        // 开启依赖追踪
        enableTracking()
        effectStack.push(effect)
        // 重点在这里
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect
  effect.id = uid++
  effect._isEffect = true // 用于判别是否是一个effect函数
  effect.active = true // 一个状态标识
  effect.raw = fn  // 保存原本的fn
  effect.deps = [] // 订阅的所有数据
  effect.options = options
  return effect
}
```

### stop()
销毁`effect`。
1、首先清空所有数据订阅。
2、执行effect的`onStop`方法。
3、将`active`变成`false`。

```typescript
export function stop(effect: ReactiveEffect) {
  if (effect.active) {
    cleanup(effect)
    if (effect.options.onStop) {
      effect.options.onStop()
    }
    effect.active = false
  }
}
```