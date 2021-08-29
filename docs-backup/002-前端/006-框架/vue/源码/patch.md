> patch在什么时候执行的？

当前renderWatcher依赖的数据发生改变时，将会触发异步执行renderWatcher的run方法。

内部会调用renderWatcher的get方法,  而get方法就是创建watcher时传入的updateComponent方法。

```js
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
```



updateComponent内部调用了`_update`方法。`_render`方法执行后会返回vnode对象。所以`_update`的第一参数就是一个vnode对象。

```js
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
```

在_update内部调用了`__patch__`。

```js
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
```



而`__patch__`是在`web/runtime/index.js`中定义的。

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

那patch又是在哪定义的呢？

打开`web/runtime/patch.js`

```js
// 封装的用于操作dom元素的一些方法
import * as nodeOps from 'web/runtime/node-ops'
// createPatchFunction是一个与平台无关的用于创建patch的函数
// 因为每个平台的在patch的时候是有差异的，所以需要这样的一个工厂函数来创建
import { createPatchFunction } from 'core/vdom/patch'
// 每个平台都会有的比如directive， ref
import baseModules from 'core/vdom/modules/index'
// 平台差异
import platformModules from 'web/runtime/modules/index'

const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

所以patch的具体逻辑是在`vdom/patch.js`实现的。因为不同平台最大的差异是调用操作dom的api。vnode的比对过程其实都是一样的。<u>注意类似uniapp、mpvue的小程序框架不是这样的， 他们改版过后的vue并没有使用vnode(render方法也总是返回一个空的vnode),  而是同过比对组件的data对象，去调用微信的setData接口。</u>



patch的参数有四个

```js
// oldVnode 旧的vnode
// vnode 新的vnode
// hydrating 服务端渲染的时候使用
// removeOnly 在transition-group中会使用到
patch (oldVnode, vnode, hydrating, removeOnly)

```



> vnode

在分析patch的逻辑之前先了解以下vnode。

Vnode是vue自己定义的一个类, new Vnode()创建出的vnode对象用来描述一个真实dom, 因为vnode对象不是一个真实的dom， 只是一个普通javascript对象，所以也叫virtual Dom。在patch的过程中通过比对新旧两个vnode的差异去更新真实的dom, 而不是暴力的重新创建dom。Vnode的具体代码如下：

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```



每个vnode都有他的生命周期。

vue平台内部modules定义的hook有5个。

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
```



在创建patch方法的时候，根据不同平台传入的modules,  收集在每个dom元素更新时都会执行的hook。

比如更新dom元素的属性时， `attrs.js`就定义了create和update两个hook, 当一个vnode被创建或者更新时就会调用对应的hook, dom元素属性的操作逻辑就是在这里写的。

```js
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
```



当然还可以在创建vnode的时候通过data.hook传入其他的hook逻辑。hook仅支持vue定义的类型。

```
render(h) {
  debugger
  return h('div', {
    hook: {
      // 创建的时候调用的hook
      create(oldVnode, vnode) {
        //  这个时候已经根据vnode创建出dom节点了, 但是还未插入到父节点中去
        console.log('create', oldVnode, vnode)
        vnode.elm.style.cssText = 'color: red'
      },
      insert(oldVnode, vnode) {
        console.log('insert', oldVnode, vnode)
      },
      // 更新时调用的 hook
      prepatch(oldVnode, vnode) {
        console.log('prepatch', oldVnode, vnode)
      },
      update(oldVnode, vnode) {
        console.log('update', oldVnode, vnode)
      },
      postpatch(oldVnode, vnode) {
        console.log('postpatch', oldVnode, vnode)
      }
    }
  }, this.msg)
}
```



下面开始分析patch的逻辑。



> vnode为空的时候

当vnode为空的时候表示要销毁oldVnode。

```js
if (isUndef(vnode)) {
    // 则销毁oldVnode
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
}
```



invokeDestroyHook其实就是调用destroy hook。

```js
  function invokeDestroyHook (vnode) {
    let i, j
    const data = vnode.data
    if (isDef(data)) {
      // 先调用用户定义的destroy hook， 再调用vue定义的destroy hook
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    }
    // 如果存在children, 则递归调用
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j])
      }
    }
  }
```

所以最后还是调用的destroy hook。比如directives模块和ref模块，directives模块会调用指令的unbind方法，ref模块会将当前vnode对应的dom元素或者组件从父组件的$refs上移除。



> oldVnode不存在， vnode存在

则直接创建dom元素

```js
isInitialPatch = true
createElm(vnode, insertedVnodeQueue)
```



> oldVnode和vnode都存在， 并且oldVnode是一个dom元素

