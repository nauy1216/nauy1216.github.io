# 解决rollup-plugin-alias在window报错的问题

直接将rollup-plugin-alias.js全部内容替换为下面的代码：

```js
const path = require('path') ;
const fs = require('fs') ;

// Helper functions
const noop = () => null;
const startsWith = (needle, haystack) => ! haystack.indexOf(needle);
const endsWith = (needle, haystack) => haystack.slice(-needle.length) === needle;
const isFilePath = id => /(^\.?\/)|(^[a-zA-Z]\:(\\|\/))/.test(id);
const exists = uri => {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};

module.exports =  function alias(options = {}) {
  const hasResolve = Array.isArray(options.resolve);
  const resolve = hasResolve ? options.resolve : ['.js'];
  const aliasKeys = hasResolve ?
                      Object.keys(options).filter(k => k !== 'resolve') : Object.keys(options);

  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop,
    };
  }

  return {
    resolveId(importee, importer) {
      // First match is supposed to be the correct one
      const toReplace = aliasKeys.find(key => startsWith(key, importee));

      if (!toReplace) {
        return null;
      }

      const entry = options[toReplace];

      const updatedId = importee.replace(toReplace, entry);

      if (isFilePath(updatedId)) {
        const directory = path.dirname(importer);

        // Resolve file names
        const filePath = path.resolve(directory, updatedId);
        const match = resolve.map(ext => `${filePath}${ext}`)
                            .find(exists);

        if (match) {
          return match;
        }

        // To keep the previous behaviour we simply return the file path
        // with extension
        if (endsWith('.js', filePath)) {
          return filePath;
        }

        return filePath + '.js';
      }

      return updatedId;
    },
  };
}
```



# 从`npm run dev`开始

项目使用的打包工具是rollup, `scripts/config.js`是rollup的配置文件。

```
rollup -w -c scripts/config.js --environment TARGET:web-full-dev
```

很容易找到web-full-dev对应的配置。我们这里学习的是runtime + compiler版本的vue。

```js
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
```

由此可知， `Runtime+compiler development build (Browser)`版本的入口是   `web/entry-runtime-with-compiler.js`。



# `web/entry-runtime-with-compiler.js`

因为我们看的是runtime + compiler 的版本， 所以我们能够看到runtime的入口：

```js
import Vue from './runtime/index'
```

以及compiler的入口：

```js
import { compileToFunctions } from './compiler/index'
```



# /runtime/index.js

主要做了以下几件事情：

1、注册`v-model`和`v-show`指令

```js
extend(Vue.options.directives, platformDirectives)
```

2、注册`Transition`和`TransitionGroup`组件

```js
extend(Vue.options.components, platformComponents)
```

3、安装patch方法

```
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

4、定义`$mount`方法， 该方法会在`web/entry-runtime-with-compiler.js`被重写，具体原因后面再说。

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

> 你可能已经注意到了，在该文件里并没有定义Vue构造方法的地方。

Vue构造函数是从这里引入的。

```js
import Vue from 'core/index'
```



# core/index.js

定义Vue构造函数的地方：

1、在构造函数内部只调用了_init()方法， 该方法是在initMixin里面定义的。

2、通过mixin的方式给构造方法Vue的原型上添加不同的方法。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```

在core/index.js里面有这一行代码， 主要是给Vue构造函数增加一些静态方法， 比如Vue.use()、Vue.nextTick()等。

```js
initGlobalAPI(Vue)
```

> core/index.js主要做了三件事：
>
> 1、定义Vue构造函数。
>
> 2、构造函数Vue添加原型方法。
>
> 3、构造函数Vue添加静态方法。



# initMixin

initMixin方法的伪代码如下：

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
  	// 1、合并options得到最终的$options
  	// 2、initLifecycle(vm)
    // 3、initEvents(vm)
    // 4、initRender(vm)
    
    // 5、callHook(vm, 'beforeCreate')
    // 执行beforeCreate钩子， 因为在执行beforeCreate时并没有初始化组件的数据状态，
    // 因此在beforeCreate里面是不能访问到data、props、inject的数据的。
    
    
    // 6、initInjections(vm) // resolve injections before data/props
    // 获取从父组件或者更高级的父组件通过provide注入到子孙组件的数据
    
    // 7、initState(vm)
    // 初始化 props、data、computed
    
    // 8、initProvide(vm) // resolve provide after data/props
    // 初始化要注入到子孙组件的数据
    
    // 9、callHook(vm, 'created')
    // 执行created钩子， 此时能够访问到组件的数据
    
    // 10、 如果el存在的话， 将会编译模板并且将通关过patch的方式将生成的DOM元素挂载到页面上
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```



# stateMixin

```js
export function stateMixin (Vue: Class<Component>) {
  // 在原型上定义$data和$props属性， 并不是在实例上定义的。
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  
  Vue.prototype.$set = set
  Vue.prototype.$delete = del
  
  Vue.prototype.$watch
}
```



# eventsMixin

```js
function eventsMixin (Vue: Class<Component>) {
	Vue.prototype.$on
	Vue.prototype.$once
	Vue.prototype.$off
	Vue.prototype.$emit
}
```

这里的逻辑比较简单， 只是实现了一套事件模型。



# lifecycleMixin

```js
function lifecycleMixin (Vue: Class<Component>) {
	// vnode的patch逻辑是在这里执行的
	Vue.prototype._update
	
	// 内部调用了renderWatch的update方法
	Vue.prototype.$forceUpdate
	
	// 
	Vue.prototype.$destroy = function() {
		// 执行beforeDestroy钩子
		callHook(vm, 'beforeDestroy')
		
		// 将当前元素从parent.$children中删除
		 remove(parent.$children, vm)
		 
		// 销毁所有的watcher，包括renderWatch、computedWatch、useWatch
		watcher.teardown()
		
		// 通过patch(vnode, null)方式将当前组件的dom元素从页面上移除
		
		// 执行destroyed钩子
		callHook(vm, 'destroyed')
		
		// 注销所有的事件
		vm.$off()
		
		// 将当前组件对象对父组件对象的引用删除
		// 因为浏览器是通过引用计数的方式来判断是否要销毁对象的
		// 当一个对象的引用计数为0时将会被销毁
		vm.$vnode.parent = null
	}
}
```



# renderMixin

```js
function renderMixin (Vue: Class<Component>) {
	// 增加一些生成vnode的辅助函数， 在组件render方法内部使用
	installRenderHelpers(Vue.prototype)
	
	//
	Vue.prototype.$nextTick
	
	Vue.prototype._render = function (): VNode {
		// 获取组件的render方法
		const { render, _parentVnode } = vm.$options
		
		// 执行render方法生成vnode对象
		vnode = render.call(vm._renderProxy, vm.$createElement)
		
		// 
		return vnode
	}
}
```



# initGlobalAPI

```js
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick
  
  Vue.observable
  
  Vue.options
  Vue.use
  Vue.mixin
  Vue.extend
  
  Vue.component
  Vue.directive
  Vue.filter
```



到此为止， 我们已经很清楚的知道了Vue构造函数是怎样定义的， 明白了Vue的原型方法及原型属性，静态方法及静态属性。从简单的定义Vue构造方法到最终生成一个复杂的Vue‘类’有了一个大致的了解。



# 从一个简单的例子开始

代码：

```js
new Vue({
    el: '#app',
    data() {
        return {
            message: [
                'hello',
                {
                    a: 'a'
                }
            ]
        }
    },
    computed: {
        msg() {
            return this.message
        }
    },
    methods: {
        handleClick() {
            this.message = Math.random()
        }
    },
    render(h) {
        return h('h1', {
            attrs: {
                class: 'hello'
            },
            on: {
                click: this.handleClick
            }
        }, this.msg)
    }
})
```

在构造方法内打上断点进入到this._init方法。

## 合并options

通过不同的合并策略合并options得到最终的$options

```js
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
      	// 获取构造函数上的options
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
```

`resolveConstructorOptions`的作用是获取构造方法上的options对象。

此时的options对象是这样的。

```js
{
    components: {
        KeepAlive
        Transition
        TransitionGroup
    },
    directives: {
        model
        show
    },
    filters: {

    },
    _base: Vue
}
```

`mergeOptions`的伪代码如下：

```js
// parent: 从构造函数上获取的options
// child： 当前组件的options
// vm： 当前组件实例
function mergeOptions (parent, child, vm) {
  // 处理child的props, 转成统一的格式
  normalizeProps(child, vm)
  
  // 处理child的inject, 转成统一的格式
  normalizeInject(child, vm)
  
  // 当指令是一个function时需要转换成一个对象
  // 如果取值是一个function, 则默认bind和update的的值都是一样的
  normalizeDirectives(child)
  
  // 递归处理extends和mixins的情况
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
  
  // 用于保存最终合并得到的结果
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
    // 不同的字段有不同的合并策略
    // TODO: 专门写一篇合并策略
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

此时的$options是这样的。

```js
{
    components: {}
    directives: {}
    el: "#app"
    filters: {}
    render: ƒ render(h)
    _base: ƒ Vue(options)
}
```

> 注意： 此时，KeepAlive、 Transition、 TransitionGroup在components的原型上。
>
> model、show在directives的原型上。
>
> 思考： 是否可以重写或者扩展show、model???



## initLifecycle

```js
  let parent = options.parent
  // 找到第一个非抽象组件的父级
  // 并且将当前组件push到parent.$children
  // $children包含了所有的子组件， 包括slot
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}
  
  // renderWatcher
  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
```



## initEvents

TODO: ???

```js
function initEvents() {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```



## initRender

伪代码：

```js
function initRender (vm: Component) {
  // TODO:???
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  
  // TODO: parentVnode是什么???
  const parentVnode = vm.$vnode = options._parentVnode 
  
  // TODO: 渲染上下文？
  const renderContext = parentVnode && parentVnode.context
  
  // 获取当前组件的slot, slot是在父组件的作用域内编译的。
  // TODO: 单独写一篇slot编译的文章
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  
  // 作用域slot
  vm.$scopedSlots = emptyObject
  
  // 供template编译的render方法使用
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  
  // 供手写的render方法使用
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  
  const parentData = parentVnode && parentVnode.data
  
  // 获取vnode对象上的attrs和_parentListeners
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```



## 执行beforeCreate钩子

执行用户的定义的breforeCreate钩子。

## initInjections

伪代码：

TODO:  后面写个具体的例子

```js
function initInjections (vm: Component) {
	const result = resolveInject(vm.$options.inject, vm)
}
```



## initState



```js
function initState (vm: Component) {
  // 用于保存当前组件对象的所有watcher对象。
  vm._watchers = []
  const opts = vm.$options
  
  // 初始化props
  if (opts.props) initProps(vm, opts.props)
  
  // 初始化methods
  if (opts.methods) initMethods(vm, opts.methods)
  
  // 初始化data
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  
  // 初始化computed
  if (opts.computed) initComputed(vm, opts.computed)
  
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```



### initProps



```js
function initProps (vm: Component, propsOptions: Object) {
  // TODO: ????
  const propsData = vm.$options.propsData || {}
  
  // TODO: 
  const props = vm._props = {}
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  
  if (!isRoot) {
    // TODO: 在observe内部将不会执行 new Observer(value)
    toggleObserving(false)
  }
    
  for (const key in propsOptions) {
    keys.push(key)
    // 校验prop的值
    // TODO：写个示例
    const value = validateProp(key, propsOptions, propsData, vm)
    
    defineReactive(props, key, value)
     
    // TODO: ???
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
}
```



### initMethods



```js
function initMethods (vm: Component, methods: Object) {
    // 逻辑比较简单， 只是遍历$options.methods
    // 将所有方法bind(vm)后挂在组件实例vm上
    // 这里bind方法会返回一个新的方法， 所以vm.$options.methods.xxxMethod != vm.xxxMethod
	for (const key in methods) {
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    }
}
```





### initData



```js
function initData (vm: Component) {
	let data = vm.$options.data
	
	// 获取data对象
	// 当不是根组件是data是一个function，因为组件是可复用的， 所以必须在每次创建一个实例时使用不同的对象
	// 这里通过定义一个function来返回一个新的对象
	// TODO: 如果可服用的组件不使用function返回会有什么问题？ 是否有可以使用的场景恰好需要这样的效果？
	// TODO: 为什不直接执行data.call(vm, vm)， 而是通过getData来执行？
	data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    
    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i = keys.length
    
    while (i--) {
    	const key = keys[i]
        if (props && hasOwn(props, key)) {
		  // 生产环境的代码啥也不做^_^
        } else if (!isReserved(key)) {
          // isReserved(key)检查key是否以 $ 或 _ 开头
          // 将vm._data所有的属性代理到vm上
          // vm.xxx 即返回 vm._data.xxx
          proxy(vm, `_data`, key)
        }
    }
	
	// 将data对象变成所谓的响应式对象
	// 注意： data 和 vm._data 是同一个对象
	// 通过observe将data所有属性变成访问器属性
	observe(data, true /* asRootData */)
}
```



proxy的代码如下

```js
// 在上面的代码中 
// target: vm
// sourceKey: '_data'
// key： 遍历data时的每一个key
function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
  	// 在访问vm.xx时，其实访问的是 vm._data.xx
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
  // 在vm.xx = xxx时，其实赋值的是 vm._data.xx = xxx
    this[sourceKey][key] = val
  }
  // target 定义 key 属性
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```



**下面来讲下observe的逻辑， 这部分很重要**。

废话不多说直接上代码：

```js
// 接着上面的代码
// value: vm._data
// asRootData: true // 作为rootData
function observe (value: any, asRootData: ?boolean): Observer | void {
  // 如果不是一个对象， 或者是一个VNode对象将不做处理
  if (!isObject(value) || value instanceof VNode) {
    return
  }

  let ob: Observer | void
  // 如果当前对象的__ob__属性是一个 Observer 对象， 表示当前对象已经是一个响应式对象
  // 将会返回这个 Observer 对象
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // shouldObserve 是一个全局的开关
    // 不是服务端渲染
    // 是一个普通的对象或者是一个数组, 并且课扩展， 即可以在上面添加属性
    // 当前对象不是组件实例，每一个组件实例上都会有一个_isVue属性
    
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```



observe方法里面最重要的逻辑就是 `new Observer(value)`。

Observer的代码如下：

```js
class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
  	// 原始对象和Observer对象会有一个相互引用
    this.value = value
    
    // TODO:???
    this.dep = new Dep()
    
    // TODO:???
    this.vmCount = 0
    
    // 相互引用
    def(value, '__ob__', this)
    
    // 数组和对象分开始处理
    if (Array.isArray(value)) {
      // 如果是数组则通过在数组和数组原型之间加一层，增加原型链的长度。
      // 在增加的这一层原型上来监听用户对数组的操作。
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  // 对象
  // 将对象上的所有属性都转换为访问器属性， set/get
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  // 数组将会遍历所有的项，递归调用observe
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```



由上面的代码可以知道，数组和对象是分开处理的。

#### 普通对象的监听

普通对象的处理逻辑是在walk方法里完成的。walk的代码逻辑比较简单， 无非就是遍历obj执行`defineReactive(obj, keys[i])`。那么defineReactive又做了什么呢？

##### 访问器属性

```js
// 接着上面的代码
// obj: vm._data
// key： 遍历vm._data时的属性值
// 假设 obj 的值为
  {
  	message: ['hello']    
  }
// key的值为message
function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每一个属性都有一个 Dep 对象来收集使用过当前属性的watch
  const dep = new Dep()

  // 获取当前属性的描述对象
  /*
  普通属性
  {
      configurable: boolean
      enumerable:  boolean
      value: any
      writable: boolean
  }
  访问器属性
  {
      configurable: boolean
      enumerable:  boolean
      set: function
      get: function
  }
  */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果当前对象是不可配置的直接 return
  // 思考： 如果不想某个属性变成响应式，是否可以将该属性设置 configurable 为 false.
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  
  // 在这里val被缓存起来了
  // 此时 val 的值为 ['hello']
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  
  // 如果有需要也可以将当前的属性对应的也转换
  // 在这里因为没有传入shallow，所以在initData时也会将对象对应的子对象也作转换
  // val 的值为 ['hello']
  // 在 observe 一个数组时， 处理的方式与普通对象的方式不一致。
      
  // 【非常重要】 缓存子对象的 obserevr 对象， 这在val 是一个数组的时候有用到。
  let childOb = !shallow && observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      
      // Dep.target 上会挂一个watcher对象
      // 当前 Dep.target 的值不为空时， 如果
      // 在这里收集watcher
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          // 【非常重要】 childOb.dep 收集依赖， 将会在增加的数组原型层中重写数组的原型方法时会用到。
          childOb.dep.depend()
          if (Array.isArray(value)) {
            // 数组元素也添加依赖
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      // 通知watcher
      dep.notify()
    }
  })
}
```



##### Dep对象

Dep对象是怎样收集依赖的呢？

每一个属性会对应一个dep对象， 当访问某个属性时，就会触发这个属性的set方法，这个dep对象会将Dep.target上的值（这个值是一个Watcher对象）push到dep.subs数组中，通过这种方式收集依赖。而当data的属性值改变时就会触发set方法， 在set方法内部调用dep.notify去执行每一个watcher的update方法。

```js
class Dep {
  static target: ?Watcher;
  id: number;
  // 用于收及
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  
  // 
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // Dep.target是一个Watcher对象
  // 在addDep方法里会调用 addSub 方法
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    if (!config.async) {
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null

Dep.target = null
const targetStack = []

// 提供公开的方法用于将当前Watcher挂在Dep.target
// 作用是： 在执行Watcher的get方法时如果使用到响应式数据， 就会将当前
// 挂在Dep.target上的 Watcher 对象就会被响应式数据的dep对象收集起来。
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```



##### Watcher对象

那么 Wathcer 对象又是什么呢？

```js
class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    
    // renderWatcher
    if (isRenderWatcher) {
      vm._watcher = this
    }
    
    // 将watcher对象push到_watchers
    vm._watchers.push(this)
    // options
    if (options) {
      // userWatcher的时候会用到
      this.deep = !!options.deep
      this.user = !!options.user
      // 创建computedWatcher的时候会用到
      this.lazy = !!options.lazy
      // 同步执行， userWatcher的时候会用到
      this.sync = !!options.sync
      // before会在创建renderWatcher时候用到
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    
    // 在computed属性中会用到
    this.dirty = this.lazy // for lazy watchers
    
    // 上一次的依赖
    this.deps = []
    
    // 存放当前watcher使用过的响应式数据的dep对象
    this.newDeps = []
    // 上一次的dep id集合
    this.depIds = new Set()
    // 存放当前watcher使用过的响应式数据的dep对象的id
    this.newDepIds = new Set()
    
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
      
    // parse expression for getter
    // 可能是_render方法， 也可能是computed的get方法
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 如果是一串类似'a.b.c'的字符串则是用户定义的watch
      // parsePath返回一个方法
      this.getter = parsePath(expOrFn)
      // 如果通过’a.b.c'获取不到值则会发出警告
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    
    // Wathcer的value的值是执行getter方法的返回值
    // 因为computed是惰性求值，所以通过lazy=true来标识，不会立即求值
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  // 在useWatcher 和 renderWacth 会立即执行get方法
  get () {
    // 将当前 Watcher 对象挂在 Dep.target 上
    pushTarget(this)
    
    let value
    const vm = this.vm
    
    try {
      // 执行gettr 方法
      // 这里有三种情况： 
      // renderWtahcer: VNode
      // computedWathcer: 用户定义的返回值， 可以是任何类型
      // userWatcher： parsePath('a.b.c')()解析得到的值
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // 如果userWatcher是监听一个对象， 并且是深度监听
      // 则会通过遍历这个对象的方式让这个对象所有的属性的dep收集当前watcher作为依赖
      if (this.deep) {
        traverse(value)
      }
      
      // 将Watcher从Dep.target上移除
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  // 这个方法会在dep.depend内部调用
  // 执行完后，dep会将watcher push到dep.subs
  // 同时会将dep push 到watcher.newDeps
  // 相互收集的目的是：
  // dep 收集 watcher 是为了方便在 数据改变时通过dep去通知watcher
  // wathcer 收集 dep 为了方便在watcher销毁时将wather从dep.subs中移除
  // 思考: 为什么需要newDepIds和depIds两层判断？？？
  // 因为get 在组件的交互过程中可能会执行多次，所以需要用depIds保存上一次执行get时收集的依赖
  // newDepIds 保存这一次收集的依赖
  addDep (dep: Dep) {
    const id = dep.id
    // 这里会将所有的dep push 到newDeps
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      // 如果上一次已经有这个dep, 那么将不会重复执行addSub,
      // 原因请看cleanupDeps方法的代码
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
 	
  // 更新this.deps
  cleanupDeps () {
    let i = this.deps.length
    
  	// 将wathcer从上一次收集的依赖的subs中移除
  	// 这里只移除newDepIds中没有的dep
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    
    // 将newDeps赋值给deps, 清空newDeps
    // 将newDepIds赋值给depIds，清空newDepIds
    // 思考： 直接用newDeps替换deps, 那在上一次不被清除的dep对象会不会不在newDeps里面？
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  // dep通知wathcer时， 会执行updeate方法
  // 参考Dep的 notify 方法
  update () {
    /* istanbul ignore else */
    if (this.lazy) { // computed
      this.dirty = true
    } else if (this.sync) { // user
      this.run()
    } else { // render
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    // active 标识watcher是否已经销毁
    if (this.active) {
      // 重新计算值
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            // 执行回调函数
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  // computed
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  // 销毁wacther对象
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
```



> 总结：
>
> vm、_data、Observer、Dep、Watcher 之间的关系
>
> vm: 当前组件实例。vm.$data代理了_data。vm. _watchers 保存了所有的wathcer对象。
>
> _data : options.data的原始对象。new Observer(_data)将data的所有属性转化成访问器属性，data.__ob__指向该observer对象。同时每个属性都会在闭包中缓存一个dep对象。dep对象将会在get方法内部收集依赖， 在set方法内部通知依赖。
>
> Observer：将data的属性转换成访问器属性。
>
> Dep： Dep是在new Observer(data)的时候在闭包内创建的。dep对象是data和watcher相互联系的桥梁。
>
> Watcher：有三种watcher，renderWathcer、computedWatcher、userWatcher。
>
> watcher在创建的时候会将当前watcher挂在Dep.target上， 求值的过程中使用data中的数据时会触发get方法， 在get方法内部dep对象r收集 当前watcher。
>
> data  通过 Dep 收集依赖， data通过Dep通知对象。



#### 数组的监听

监听数组要考虑的情况有三种：

以监听下面的对象为示例说明。

```js
var arr = [
    'hello',
    {
        a:'a'
    }
]
var data = {
	message: arr
}
```

> 修改 data.message。

data是一个对象所以在observe(data)的时候会走walk的逻辑。所以能监听到data.message的赋值操作，这与普通的对象没什么区别。

> 操作数组本身，而不操作元素本身。

数组本身操作的监听是通过增夹中间层原型来实现的。在重写的方法内部会通过arr.____ob____.dep.notify()通知依赖。值得注意的是，在执行defineReactive(data, 'message')的时候。会在内部observe(arr)并且将返回的observer对象缓存在childOb变量上。childOb.dep.depend()会收集依赖。

> 操作数组元素， 数组本身没有操作。

通过遍历observe数组的每一个元素。实际上当数组元素是一个基础类型时重新赋值vue并不会感知到，

比如这里的 data.message[0] = 'new value', 必须使用$set去赋值。

> 不能被vue感知到的数组操作。

1. data[0] = 'newValue'
2. data.length = 0



```js
// 数组本来的原型
const arrayProto = Array.prototype
// 以数组本来的原型创建一个对象，这个对象的原型就是arrayProto
// 这样就在原型链上加了一个原型
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // 缓存原有的方法
  const original = arrayProto[method]
  
  // 重写方法， 在方法内部进行数组操作的拦截
  def(arrayMethods, method, function mutator (...args) {
    // 调用原始的方法
    const result = original.apply(this, args)
    
    // 获取当前数组的Observer对象
    // 【非常重要】 参考defineReactive方法的代码
    // this.__ob__是在执行 childOb.dep.depend() 的时候收集依赖的
    const ob = this.__ob__
    
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    
    // 通知watcher
    ob.dep.notify()
    return result
  })
})
```



### initComputed

以下面的代码为例。

```
computed: {
    msg() {
    	return this.message
    }
}
```



```js
// computed 是用户定义的 option.computed 对象
function initComputed (vm: Component, computed: Object) {
    // 在组件实例上的_computedWatchers属性上保存了所有computedWatcher
	const watchers = vm._computedWatchers = Object.create(null)
    
    for (const key in computed) {
        const userDef = computed[key]
        // 获取用户定义的get方法, 如果是function则把这个function作为get方法
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        
        if (!isSSR) {
          // 每一个computed属性 都会创建一个对应的 Wathcer 对象
          // computedWatcherOptions: { lazy: true }
          // 这里的lazy的值为true， 在创建Watcher对象的时候会惰性求值
          // 
          watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
          )
        }
        
        // 会判断vm是否已经存在，开发环境会抛出警告
        if (!(key in vm)) {
          defineComputed(vm, key, userDef)
        } 
    }
}
```



defineComputed的伪代码如下：

```js
// target: vm
// key: computedName
// userDef: 用户定义的对象或函数
function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 不是服务端渲染  
  const shouldCache = !isServerRendering()
  //
  // 这里有两种情况： 
  // 缓存watcher的值时使用createComputedGetter创建get
  // 不缓存watcher的值时使用createGetterInvoker创建get
  // 用户定义的是function
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    // 未定义set使用空方法赋值
    sharedPropertyDefinition.set = noop
  } else { // 用户定义的是object
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    // 如果使用了则直接赋值
    sharedPropertyDefinition.set = userDef.set || noop
  }
  
  // 讲 key 定义为访问器属性， 与普通的访问器不同的是， computed的get方法的返回值
  // 是watcher的value
  // 默认会通过watcher做缓存
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```



createComputedGetter

```js
function createComputedGetter (key) {
  return function computedGetter () {
    // 取得当前computed属性的computedWatcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    
    if (watcher) {
      // 重新求值
      // dirty 的初始值为true
      // 在evaluate内部会调用watcher.get() 方法
      // 在watcher.get()执行完后，dirty的值变为false
      // 在下一次获取computed属性的值时，将不会再重新求值。
      // 这样能做到缓存的目的
      // 思考： 如果computed属性的依赖改变后怎么去更新值？
      if (watcher.dirty) {
        watcher.evaluate()
      }
        
      // 此时 Dep.taregt 指向的是 renderWatcher 
      // 这里会把renderWatcher push到 computedWathcer 的所有依赖dep对象的subs数组中。
      // 思考： 当computed属性的依赖改变时， 将会发生那些事情？
      // 1、修改watcher.dirty的值为true。
      // 2、通知renderWatcher重新渲染。
      // 3、在执行render方法的过程中会重新执行当前这个getter方法，此时watcher.dirty = true
      //    所以会通过watcher.evaluate()来重新计算computed的值。
      // 所以，本质上是computedWatcher的依赖最终也会变成renderWatcher的依赖。
      // 可以把computed属性看成是一组依赖的集合， 当render方法使用这个computed属性时就会
      // 依赖这个集合里所有的数据， 当这个集合里的某个数据发生改变时，将会出发renderWatcher的update
      // 方法。 在update时又会异步调用render方法， render方法内部使用这个computed属性时执行当前方法，
      // 导致重新求值(PS: 实际上此时在任何地方访问这个computed属性都会重新求值)。
      if (Dep.target) {
        watcher.depend()
      }
        
      // 返回watcher的值
      return watcher.value
    }
  }
}
```



createGetterInvoker

不缓存结果， 每次执行都会执行。

```js
function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}
```



### initWatch

主要逻辑是 `createWatcher(vm, key, handler)`

```js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    // 数组
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```



createWatcher

```js
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // handler 是一个对象
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // handler 是一个字符串则直接从vm上找对应的方法
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  
  // 最终还是调用$watch方法
  // expOrFn： 要监听的变量
  // hanler: 回调
  // options: 配置
  return vm.$watch(expOrFn, handler, options)
}

```



$watch

```js
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this
  // 如果是用户直接使用$watch，那么cb可能是一个对象
  // 那么就使用createWatcher先处理下
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {}
  options.user = true
  
  // 创建 watcher 对象
  // 创建对象的过程中会通过expOrFn路径解析对象
  // 在执行get的过程中收集依赖， 也就是要监听的属性。
  // 当属性变化后则会执行回调
  const watcher = new Watcher(vm, expOrFn, cb, options)
  
  // 如果immediate的值为true, 则会立即执行回调函数
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value)
    } catch (error) {
      handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
    }
  }
  
  // 返回一个方法， 用于销毁watcher对象
  return function unwatchFn () {
    watcher.teardown()
  }
}
```



## initProvide





## 执行created钩子

执行用户定义的create钩子。



## $mount

现在我们回到入口文件 ``web/entry-runtime-with-compiler.js``。发现Vue.prototype.$mount被重写了（上面也有提到过这个问题），这是因为我们学习的是runtime + compiler版本的， 和runtme不同的是， runtime版本一般是在webpack等构建工具使用， 因为在使用webpack打包代码的时候，template已经被编译成render方法了， 所以在生产环境其实是不需要compiler的。 但是如果不预先将template编译成render方法， 这就需要在运行的时候去编译， 这种情况就需要runtime + compiler版本的vue。所以$mount在不同的版本中是有差异的。

runtime + compiler的$mount方法 比runtime 的$mount多了一个template编译成render 的逻辑。

### 编译template生成render方法

```js
// 缓存运行时版本的$mount方法
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
    // 获取DOM元素
    el = el && query(el)
    
    const options = this.$options
    // 如果不存在render方法，将会去获取template, 并将template转换成render方法。
    if (!options.render) {
       // TODO: 这里比较简单，后面有时间在补充说明
    }
    
    // 最后执行缓存的$mount方法
    return mount.call(this, el, hydrating)
}
```

由于tmplate的编译过程比较复杂， 所以打算单独写一篇文章详细说明，这里就不在深入，我们直接从tempalte编译成render之后的逻辑开始学习。

所以，我们还是回到了 `runtime/index.js`下的$mount方法。

代码如下：

```js
// 没有什么逻辑， 内部调用了mountComponent
// 直接看 mountComponent 的逻辑就好了
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

`mountComponent`方法是在 `core/instance/lifecycle` 定义的。

### 执行beforeMount钩子

```js
function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
      
  // 如果没有render方法， 则赋值一个返回emptyVNode的方法。
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
      
  // 执行beforeMount钩子
  callHook(vm, 'beforeMount')
      
  let updateComponent
  // 用于更新组件
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  
  // 创建renderWatcher
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false
      
  // 通过$vone做判断，避免多次执行 mounted 钩子
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
      
  return vm
}
```

主要的逻辑都在创建renderWatcher的过程中， 所以我们接下来看下创建renderWatcher的过程。

updateComponent方法将会作为watcher的getter,  在get方法内执行。



在执行updateComponent的时候， 内部调用了：

```
 vm._update(vm._render(), hydrating)
```



### 执行render方法生成VNode

`vm._render()` 生成VNode, `vm._update`内部将会对vNode进行patch, 在patch的过程中会生成真实的DOM元素。

_render方法是在 `render.js`文件内的renderMixin方法内定义的。

```js
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options
    
    // TODO: ???
    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }
    
    // TODO：？？？
    vm.$vnode = _parentVnode
    
    
    let vnode
    try {
      // 模块内的一个全局变量
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {}
    finally {
      currentRenderingInstance = null
    }
    
    
    // 如果生成的vnode是一个数组， 并且数组的长度为1
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    
    vnode.parent = _parentVnode
    return vnode
}
```



### 对新旧VNode进行patch

_update是在 `lifecycle.js`   的lifecycleMixin方法内定义的。

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  // 组件实例对应的DOM元素
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  
  // 将当前的vm对象赋值给 activeInstance
  // 并且在闭包内缓存上一个activeInstance
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
    
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    // 第一次执行patch
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    // 组件更新的时候
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  
  //将上一个activeInstance重新赋值给 activeInstance
  restoreActiveInstance()
    
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
    
  //在组件渲染的DOM上都会有一个__vue__属性执行当前组件实例   
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
    
  // if parent is an HOC, update its $el as well
  // TODO: 高阶组件？？？
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```



**patch的逻辑**



```js
function createPatchFunction () {
  // 此处省略一大段代码...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    
    // 如果vnode不存在
    if (isUndef(vnode)) {
      // 销毁oldVnode
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []
	
    
    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          
          // oldVnode是一个dom元素，通过它创建一个空的VNode对象
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode, // VNode对象
          insertedVnodeQueue, // TODO:???
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm, // oldElm的父DOM元素
          nodeOps.nextSibling(oldElm) // oldElm的下一个兄弟元素，可能是元素节点也可能是文本节点
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```



































































### 执行mounted钩子