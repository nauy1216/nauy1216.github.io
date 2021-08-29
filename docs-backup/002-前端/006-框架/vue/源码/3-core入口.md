### 导入了`instance/index`
在`instance/index`的基础上扩展构造函数`Vue`。

### 安装全局API

```js
initGlobalAPI(Vue)

function initGlobalAPI(Vue) {
  // 
  Object.defineProperty(Vue, 'config', configDef)

  // 
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 
  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 
  // 2.6 explicit observable API
  Vue.observable

  //
  Vue.options = {
    components: Object.create(null),
    filters: Object.create(null),
    directives: Object.create(null)
  }
  Vue.options._base = Vue
  
  // 安装与平台无关的组件，比如：keep-alive
  extend(Vue.options.components, builtInComponents)

  //
  Vue.use

  // 
  Vue.mixin

  // 
  Vue.extend

  // 
  Vue.component
  Vue.directive
  Vue.filter

}
```