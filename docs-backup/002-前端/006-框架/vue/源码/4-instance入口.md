### 定义构造函数
`instance/index`定义并导出了和构造函数, 并在原型上定义了一些方法。
`core/index`对构造函数增加了一些静态方法。
`runtime/index`增加了与平台有关的东西。
`entry-runtime-with-compiler`增加了编译template有关的东西。
```js
// 定义构造函数
function Vue (options) {
  // 如果不是通过 new Vue() 调用将会抛出异常
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

### `initMixin(Vue)`

定义`Vue.prototype._init`。伪代码如下：
```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // 1.mergeOptions
    // 2.initLifecycle(vm)
    // 3.initEvents(vm)
    // 4.initRender(vm)
    // 5.callHook(vm, 'beforeCreate')
    // 6.initInjections(vm)
    // 7.initState(vm)
    // 8.initProvide(vm)
    // 9.callHook(vm, 'created')
    // 10.vm.$mount(vm.$options.el)
  }
}
```

### `stateMixin(Vue)`

```js
function stateMixin() {
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch
}
```

### `eventsMixin(Vue)`

```js
Vue.prototype.$on
Vue.prototype.$once
Vue.prototype.$off
Vue.prototype.$emit

```

### `lifecycleMixin(Vue)`

```js
function lifecycleMixin(Vue) {
  Vue.prototype._update
  Vue.prototype.$forceUpdate
  Vue.prototype.$destroy
}
```

### `renderMixin(Vue)`

```js
function renderMixin(Vue) {
  Vue.prototype.$nextTick
  Vue.prototype._render
}
```