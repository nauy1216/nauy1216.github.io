###  导入了`core/index`
`core`文件夹下的逻辑是与平台无关的。
`runtime/index`在`core`的基础上增加了很多跟`web`平台有关的逻辑。将所有与平台无关的逻辑都封装在`core`里。

- 安装与平台相关的一些工具方法。
```js
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement
```

- 安装平台运行时的指令, 比如`v-show`、`v-model`。
  安装内置组件, 比如`transition`、`transition-group`。
```js
// install platform runtime directives & components
// 添加指令 v-model v-show
extend(Vue.options.directives, platformDirectives)
// 添加组件 transition transtion-group
extend(Vue.options.components, platformComponents)
```

- 每个平台patch的逻辑不一样。

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

- 定义`$mount`方法

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```



