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