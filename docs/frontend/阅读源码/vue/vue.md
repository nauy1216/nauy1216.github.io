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

很容易找到web-full-dev对应的配置。

```
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

```
import Vue from './runtime/index'
```

以及compiler的入口：

```
import { compileToFunctions } from './compiler/index'
```



# /runtime/index.js

主要做了以下几件事情：

1、注册`v-model`和`v-show`指令

```
extend(Vue.options.directives, platformDirectives)
```

2、注册`Transition`和`TransitionGroup`组件

```
extend(Vue.options.components, platformComponents)
```

3、定义`$mount`方法， 该方法会在`web/entry-runtime-with-compiler.js`被重写，具体原因后面再说。

```
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

```
import Vue from 'core/index'
```



# core/index.js

定义Vue构造函数的地方：

1、在构造函数内部只调用了_init()方法， 该方法是在initMixin里面定义的。

2、通过mixin的方式给构造方法Vue的原型上添加不同的方法。

```
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

```
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

```
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

```
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

```
function eventsMixin (Vue: Class<Component>) {
	Vue.prototype.$on
	Vue.prototype.$once
	Vue.prototype.$off
	Vue.prototype.$emit
}
```

这里的逻辑比较简单， 只是实现了一套事件模型。



# lifecycleMixin

```
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

```
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

```
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

```
new Vue({
    el: '#app',
    render(h) {
        return h('h1', {
            attrs: {
            	class: 'hello'
            }
        }, 'hello')
    }
})
```

在构造方法内打上断点进入到this._init方法。

## 合并options

通过不同的合并策略合并options得到最终的$options

```
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

```
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

```
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

```
  let parent = options.parent
  // 找到第一个非抽象组件的父级
  // 并且将当前组件push到parent.$children
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

```
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

```
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



## initInjections

伪代码：

TODO:  后面写个具体的例子

```
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
	for (const key in methods) {
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
    }
}
```





### initData



```
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

```
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

```
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

```js
// 接着上面的代码
// obj: vm._data
// key： 遍历vm._data时的属性值

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
  
  // TODO: ???
  // 在这里val被缓存起来了
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  
  // 如果有需要也可以将当前的属性对应的也转换
  // 在这里因为没有传入shallow，所以在initData时也会将对象对应的子对象也作转换
  let childOb = !shallow && observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      
      // Dep.target 上会挂一个watcher对象
      // 当前 Dep.target 的值不为空时， 如果
      // TODO: ....
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
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
      dep.notify()
    }
  })
}
```





#### 数组的监听





### initComputed



### initWatch



## initProvide





## 执行created钩子