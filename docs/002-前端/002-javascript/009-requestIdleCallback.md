# requestIdleCallback
window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。

> 强烈建议使用timeout选项进行必要的工作，否则可能会在触发回调之前经过几秒钟。

# 语法

```js
var handle = window.requestIdleCallback(callback[, options])
```

- `callback`一个在`事件循环空闲时`即将被调用的函数的引用。函数会接收到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。