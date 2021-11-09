- https://www.ruanyifeng.com/blog/2018/07/web-worker.html
- 验证postMessage可传递的数据累型。

# 出现的背景

- JavaScript 语言采用的是单线程模型。
- 随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

# 作用

- 为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。
- 在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。



# 注意事项

- Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该**手动关闭**。
- **同源限制**。分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
- **DOM 限制**。Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。但是，Worker 线程可以`navigator`对象和`location`对象。

- **通信联系**。Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
- **脚本限制**。Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
- **文件限制**。Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。



# 使用

### 主线程

#### 新建一个 Worker 线程

```js
var worker = new Worker('work.js', { name : 'myWorker' });

// Worker 线程
self.name // myWorker
```

- 构造函数的第一个参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务。
- 由于 Worker 不能读取本地文件，所以这个脚本必须来自网络。如果下载没有成功（比如404错误），Worker 就会默默地失败。
- 第二个参数是配置对象，该对象可选。它的一个作用就是指定 Worker 的名称，用来区分多个 Worker 线程。



#### **worker实例的方法**

- worker.onerror：指定 error 事件的监听函数。
- worker.onmessage：指定 message 事件的监听函数，发送过来的数据在`Event.data`属性中。
- worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- worker.postMessage()：向 Worker 线程发送消息。
- worker.terminate()：立即终止 Worker 线程。



#### **主线程向Worker发送消息**

```js
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});
```

- `worker.postMessage()`方法的参数，就是主线程传给 Worker 的数据。
- 它可以是各种数据类型，包括二进制数据。~~主线程可以发送哪些数据？函数可以吗？DOM可以吗？~~



#### **主线程接受Worker的消息**

```js
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!');
}
```



#### **关闭Worker**

```js
worker.terminate();
```



### Worker

#### **接收主线程消息**

```js
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);
}, false);
```

- `self`代表子线程自身，即子线程的全局对象。也可以使用this代替self。
- 除了使用`self.addEventListener()`指定监听函数，也可以使用`self.onmessage`指定。



#### **发消息给主线程**

```js
 self.postMessage('WORKER STARTED: ' + data.msg);
```



#### **关闭Worker**

```js
  self.close(); // Terminates the worker.
```



根据主线程发来的数据，Worker 线程可以调用不同的方法，下面是一个例子。

```js
self.addEventListener('message', function (e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
```



#### **在worker内部的全局对象**

- self.name： Worker 的名字。该属性只读，由构造函数指定。
- self.onmessage：指定`message`事件的监听函数。
- self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- self.close()：关闭 Worker 线程。
- self.postMessage()：向产生这个 Worker 线程发送消息。
- self.importScripts()：加载 JS 脚本。



#### Worker内部加载脚本

Worker 内部如果要加载其他脚本，有一个专门的方法`importScripts()`。

```js
importScripts('script1.js');
```



该方法可以同时加载多个脚本。

```js
importScripts('script1.js', 'script2.js');
```



### 错误处理

如果发生错误，Worker 会触发主线程的`error`事件。

```js
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
```

- Worker 内部也可以监听`error`事件。



### 通信需要注意的地方

- 主线程与 Worker 之间的通信内容，可以是文本，也可以是对象，也可以是二进制数据，比如 File、Blob、ArrayBuffer 等类型。
- 需要注意的是，这种通信是**拷贝关系**，即是传值而不是传址，**Worker 对通信内容的修改，不会影响到主线程。**
- 事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。

- **注意不能传递Function**。

  

> 拷贝方式发送二进制数据，会造成性能问题。比如，主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝。

- **解决方法。**JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。
- 这种转移数据的方法，叫做[Transferable Objects](https://www.w3.org/html/wg/drafts/html/master/infrastructure.html#transferable-objects)。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```





### Worker加载同一个页面的代码

通常情况下，Worker 载入的是一个单独的 JavaScript 脚本文件，但是也可以载入与主线程在同一个网页的代码。

```js
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

- 指定`<script>`标签的`type`属性是一个浏览器不认识的值，上例是`app/worker`。



然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```js

var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```





# 应用场景

> 轮询。下面代码中，Worker 每秒钟轮询一次数据，然后跟缓存做比较。如果不一致，就说明服务端有了新的变化，因此就要通知主线程。

```js

function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```





# worker运行环境

1、navigator

2、location

3、self：指向全局的worker对象

4、所有的ECMA对象

5、XMLHttpRequest构造器

6、setInterval、serTimeout

7、close():立即停止本线程

8、importScripts():在后台线程引入一个js文件

9、没有DOM操作

