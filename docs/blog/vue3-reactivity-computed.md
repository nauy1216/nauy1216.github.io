### `computed()`
computed实现原理其实也是和`ref`差不多的。

```ts
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  // 如果getterOrOptions的类型是function，那么getterOrOptions将会被当做是getter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    // 传入放入是一个有get、
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // 返回一个ref对象
  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set // 当set方法不存在时，设置为readonly
  ) as any
}

```

##### class ComputedRefImpl
```ts
class ComputedRefImpl<T> {
  private _value!: T
  private _dirty = true // 用于标识computed的值是否需要重新计算

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true;
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    this.effect = effect(getter, {
      lazy: true,
      // 定义的scheduler方法, 会在comupted的依赖发生改变时触发
      // 这里只改变_dirty的值，重新计算computed的值将在执行get方法时触发
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          // 通知订阅了value的effect, 
          // 如果有effect订阅了的话, effect将会触发computed的get方法，将会重新计算computed的值
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  // computed的值被访问时执行
  get value() {
    // 如果被标记为dirty, 表示值需要重新计算
    if (this._dirty) {
      // 通过执行effect计算的到computed的值
      this._value = this.effect()
      this._dirty = false
    }
    // 收集effects
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```