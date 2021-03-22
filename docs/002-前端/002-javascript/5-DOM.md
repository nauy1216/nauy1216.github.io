# document.onclick 和 document.addEventLinstener('click')
- 两者不会相互冲突，按注册事件的先后顺序执行
- document.onclick只能添加一个事件处理函数，重复添加会覆盖
- document.addEventLinstener('click')可添加多个， 不会被覆盖

# 事件冒泡与事件捕获
- 事件处理的三个阶段？
- 事件冒泡和事件捕获是为了解决什么问题？执行顺序。
- 事件冒泡的使用场景？ 
  - dom事件委托（代理）
- 事件捕获的使用场景？
  - 屏蔽事件
- 对于iframe里的元素会冒泡到iframe的父级window吗？

### `ev.stopPropagation()`和`ev.stopImmediatePropagation`
- 相同： 他们的作用都是阻止捕获和冒泡阶段中当前事件的进一步传播。
- 不相同： `ev.stopPropagation()`不能阻止当前事件的其他处理函数的执行，`ev.stopImmediatePropagation()`能阻止当前事件的其他处理函数的执行。

### `ev.preventDefault()`


### `ev.composedPath()`
调用该侦听器时返回事件路径。 如果影子根节点被创建并且ShadowRoot.mode是关闭的，那么该路径不包括影子树中的节点。

### 事件委托
- 什么是事件委托？
- 优点
- 缺点

# shadow dom

# 创建自定义事件
下面的例子定义了一个自定义事件`eventName`, 由于设置了`bubbles: true`所以当`body`触发事件后`doucment`也会接收到事件。
```js
var event = new CustomEvent('eventName', {
  bubbles: true, // 是否冒泡
  detail: 'aaa'
})

var eventObj 
document.body.addEventListener('eventName', function(e) {
  eventObj = e
  console.log('body ev', e)
}, false)

document.addEventListener('eventName', function(e) {
  console.log('document ev', e, eventObj === e)
  eventObj === e // true
}, false)

document.body.dispatchEvent(event)
```

- `body`和`document`接收的事件对象是同一个对象
- 通过`dispatchEvent`触发内置事件？

# dom操作api
### 创建节点
- 创建dom节点
- 创建文本节点
- 创建注释节点
- 创建fragment
### 获取引用关系
- 获取父节点
- 获取子节点
- 获取第一个子节点
- 获取最后一个子节点
- 获取下一个兄弟节点
- 获取上一个兄弟节点

### 节点操作
- 将节点a添加到节点b的子节点末尾
- 节点a移除子节点b
- 在节点a的子节点b前面插入节点c
- 用节点a替换节点b的子节点


### 节点选择

### 属性操作
- 设置属性
- 删除属性
- 获取属性值
- 检测是否有某个属性

### 获取样式
- window.getComputedStyle(document.body) 和 document.body.style的区别？
 - getComputedStyle只能获取样式不能更改， style能获取
- ele.getBoundingClientRect()

### 尺寸
- getBoundingClientRect

- clientWidth、clientHeight、clientLeft、clientTop
- offsetWidth、offsetHeight、offsetLeft、offsetTop
- scrollWidth、scrollHeight、scrollLeft、scrollTop

- clientWidth和offsetWidth的区别？
  - 哪个是包含边框的?bian

- clientLeft和offsetLeft的区别？
  - 哪个是从内边距的边缘到边框的外边缘的距离(其实等同于边框的宽度)？


# DOMContentLoaded 与 load 的区别
> DOMContentLoaded的执行时机

DOM 解析完成后触发，不需要等待图片等其他资源加载完成。
> load的执行时机
页面上所有的 DOM, 样式表, 脚本, 图片等资源已经加载完毕才会触发。

> DOMContentLoaded比load先执行。
