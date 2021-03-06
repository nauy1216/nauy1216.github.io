# $mount
前面已经讲过`compiler`版与`runtime`版的区别, 无非是多了一个`template`编译的过程。
在`runtime`版的`$mount`代码如下：
```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
内部调用了`mountComponent`将当前组件实例渲染到dom元素`el`上。
`mountComponent`实在`instance`层定义的。
```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // 在准备好 inject、props、data、computed、provide、watch...后调用beforeMount钩子
  callHook(vm, 'beforeMount')

  let updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  // 创建renderWatch
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

  // 根组件执行mounted
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```