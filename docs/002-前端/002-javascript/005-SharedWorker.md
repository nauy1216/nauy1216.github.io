- https://www.cnblogs.com/imgss/p/14634577.html
- https://segmentfault.com/a/1190000019699502
- https://www.zhuwenlong.com/blog/article/590ea64fe55f0f385f9a12e5
- https://www.cnblogs.com/zhwc-5w4/p/13915815.html

# 什么是ShareWorker？
- 通过shareWorker我们可以创建共享线程，即不同的页面使用同一个ShareWorkder。
- shareWorkder会在页面存在的生命周期内创建一个唯一的线程，并且开启多个页面也只会使用同一个进程，当所有的页面都关闭之后该线程也会随之被结束。

# 创建shareWorker

```js
let worker = new SharedWorker('sharedworkers.js', 'workerName');
```

- 其中第一个参数是脚本的地址。
- 第二个参数是子线程的名称，相同名字的线程会被共享（但必须符合同源策略）。

# 消息传递
`ShareWorker`实现于`SharedWorkerGlobalScope`，这个和`Webworker`有一点的使用上的区别。

#### 主线程
```js
// 传递strat指令
worker.port.postMessage('start');

// 接收子线程的数据
worker.port.onmessage = function (val) {
    timeDom.innerHTML = val.data
}
```

或者。

```js
worker.port.start();
worker.port.addEventListener('message', function(e) {
    // ... 
});
```
- 如果你是通过addEventListener绑定message事件的话（而不是.onmessage）这时候需要手动的调用 port 的 .start()方法。


#### SharedWorker线程
```js
// sharedworkers.js
onconnect = function (e) {
    // 通过 e.ports 拿到 port
    var port = e.ports[0];

    // port.onmessage 监听父线程的消息
    port.onmessage = function () {
        // port.postMessage 向父线程传递消息
        port.postMessage(a++)
    }
}
```
- 通过对onconnect事件获取到新的shareWorker的连接。
- 然后在connect的参数中的ports字段我们可以拿到MessageEvent。
- 这时候我们就可以使用 .onmessage 和 .postMessage 来处理和传递我们的数据了。


# 调试
开发sharedworkders的时候，可能会发现这样的问题，普通workder可以很方便的通过控制台来调试，但是sharedworkders是后台线程，很难去调试，我在开发的时候就遇到下面的问题：
- sharedWorkder 的 console 信息不会在控制台中展示，怎么去打断点？
- sharedWorkder 的缓存比较严重，修改了代码之后浏览器还是会运行之前的脚本，缓存该如何清除？

> 解决办法，使用`chrome://inspect/`
1. 在浏览器输入`chrome://inspect/`。
2. 选择`ShareWorker`面板， 可以看到所有正在运行的worker。
3. 选择一个worker，点击`inspect`按钮就可以开始调试了。`terminate`结束worker。


# 注意的地方