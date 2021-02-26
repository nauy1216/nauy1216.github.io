### `declare const RefSymbol: unique symbol`
`unique symbol`是`symbol`的子类型, 接口中的计算属性名称必须引用必须引用类型为文本类型或 "unique symbol" 的表达式。


### ref()、shallowRef()
`ref`和`shallowRef`内部都是调用`createRef`, 他们两者的区别是：`ref`会对传入的value值进行`reactive`处理, 而`shallowRef`不会。但是需要注意的是,
如果value的值是一个基本类型时`reactive`是不会处理的, 此时使用`ref`和`shallowRef`都是一样的。代码如下：

```typescript
function createRef(rawValue: unknown, shallow = false) {
  // 如果rawValue本身就是ref, 则直接返回
  // ref对象上会有__v_isRef属性作为标识
  if (isRef(rawValue)) {
    return rawValue
  }
  // 返回一个ref对象
  return new RefImpl(rawValue, shallow)
}
```

class `RefImpl`的实现并没有使用`Proxy`和`Object.defineProperty()`实现, 而是使用带`set`和`get`方法的对象包装实现。
除此之外和使用其他两种方式实现数据的订阅逻辑是一样的, 在执行`get`方法时通过`track`收集使用了value的`effect`, 
在执行`set`放方法时通过执行`trigger`通知所有订阅的`effect`。
```typescript
class RefImpl<T> {
  // 内部值
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T, private readonly _shallow = false) {
    this._value = _shallow ? _rawValue : convert(_rawValue)
  }

  get value() {
    // 订阅
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newVal) {
    // 判断新旧值是否变化
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      // 发布
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```

### `toRef()`

```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  return new ObjectRefImpl(object, key) as any
}
```

class `ObjectRefImpl`
```ts
class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}
```

### `toRefs()`
```ts
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  // 遍历对象或数组，将所有值转换成ref对象
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

### `customRef()`
自定义ref。

```ts
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}
```
`CustomRefImpl`

```ts
class CustomRefImpl<T> {
  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  public readonly __v_isRef = true

  constructor(factory: CustomRefFactory<T>) {
    const { get, set } = factory(
      () => track(this, TrackOpTypes.GET, 'value'),
      () => trigger(this, TriggerOpTypes.SET, 'value')
    )
    this._get = get
    this._set = set
  }

  get value() {
    return this._get()
  }

  set value(newVal) {
    this._set(newVal)
  }
}
```


### `unref()`
获取ref的value。

```ts
export function unref<T>(ref: T): T extends Ref<infer V> ? V : T {
  return isRef(ref) ? (ref.value as any) : ref
}

```