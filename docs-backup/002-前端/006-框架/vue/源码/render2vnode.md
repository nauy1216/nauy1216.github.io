

# 示例

```js
var ComA = {
  props: {
    name: {
      type: String
    }
  },
  data() {
    return {
      message: 'haha'
    }
  },
  watch: {
    message() {

    }
  },
  methods: {
    handleClick() {
      this.message = Math.random()
    }
  },
  render(h) {
    return h('h1', {
      ref: 'hello',
      attrs: {
        class: 'hello'
      },
      on: {
        click: this.handleClick
      }
    }, this.name + ': ' + this.message)
  }
}

var App = {
  render(h) {
    return h('div', {
      ref: 'app',
      attrs: {
        class: 'app',
      }
    }, this.$scopedSlots.default('liuchengyuan'))
  }
}

window.vm = new Vue({
  el: '#app',
  components: {
    App,
    ComA
  },
  methods: {
    handleClick() {
      console.log('click')
    }
  },
  template: `
    <App ref="root">
      <template slot-scope="scope">
        <ComA :name="scope"/>
      </template>
    </App>
  `
})
```



# _render

vnode对象是通过执行_render方法生成的。

在上面的实例中根组件编译生成的render方法是这样的：

```js
(function anonymous(
) {
with(this){
    return _c(
        'App',
        {
            ref:"root",
            // 作用域插槽是在父组件的render方法内部编译的，并且是一个方法
            // 这是因为在插槽内使用到了组件的数据， 所以必须返回一个方法由子组件去执行
            // 生成最终的vnode
            
            // TODO: _u是什么？？
            scopedSlots:_u([
                {
                    key:"default",
                    fn:function(scope){
                        return [
                            _c(
                                'ComA',
                                {
                                    attrs:{
                                        "name":scope
                                    }
                                }
                            )
                        ]
                    }
                }
            ])
        }
    )
}
})
```



```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  // render： 用户定义的render方法或者是由template编译生成的render方法
  // _parentVnode: 当前父组件的vnode
  // 思考： _parentVnode、_vnode、$vnode 的区别？？？
  // 当渲染根组件时， _parentVnode、$vnode均为null, _vnode的tag是App
  // 当渲染App组件时，_parentVnode、$vnode的tag均为App(也就是在根组件生成的_vnode), 
  // _vnode的tag是div
  // $Vonde与_parentVnode是相等的， 都是在父组件的render函数生成的。
  // _vnode是在执行子组件自己的render函数生成的。
  const { render, _parentVnode } = vm.$options
  
  // TODO
  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    )
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    // 当前正在渲染的组件实例
    currentRenderingInstance = vm
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
      try {
        vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
      } catch (e) {
        handleError(e, vm, `renderError`)
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  } finally {
    currentRenderingInstance = null
  }
  // if the returned array contains only a single node, allow it
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0]
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
        'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```



# _createElement

在render的内部是通过_createElement来创建vnode的。

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
    
  // vnode 的data属性不能是一个响应式对象。
  // TODO: 测试一下
  if (isDef(data) && isDef((data: any).__ob__)) {
    return createEmptyVNode()
  }
  
  // 动态组件
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  
  // 如果tag不存在直接返回空的vnode
  if (!tag) {
    return createEmptyVNode()
  }

  // key只能是简单类型的值
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }

  // support single function children as default scoped slot
  // TODO: 这里children为什么要清空？
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
	
  // TODO: ???
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }


  let vnode, ns
  // tag是字符串
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // 如果是已预留的标签，即浏览器本身就有的标签这直接创建vnode
    if (config.isReservedTag(tag)) {
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    
    // 如果是自定义的组件，则通过 createComponent 创建vnode
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      // TODO: 什么场景？
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    // 可以是一个options对象 或者是一个组件的构造函数
    vnode = createComponent(tag, data, context, children)
  }

  // TODO: 
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```



## createComponent

```js
function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }
  
  // 获取父组件的构造函数
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  // 如果是一个对象则使用extend创建一个构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // 如果Ctor不是一个function
  // 那说明既不是一个optons也不是一个异步组件
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  // 如果Ctor.cid 不存在说明这是一个异步组件，
  // 非异步组件都会有一个cid
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    
    // 获取异步组件的构造函数
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    
    // TODO:???
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  // 将v-model转换成props, events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```



### Vue.extend

调用extend会创建一个Vue的子类。

```js
  Vue.cid = 0
  let cid = 1

  // extend返回一个新的子类构造方法
  Vue.extend = function (extendOptions: Object): Function {
    // 与options的数据结构一致
    extendOptions = extendOptions || {}
      
    const Super = this
    const SuperId = Super.cid
    
    // _Ctor缓存得到的构造函数
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }
	
    // 获取组件的name
    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }
	
    // 构造函数
    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
      
    Sub.cid = cid++
    
    // 合并options
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}

```

