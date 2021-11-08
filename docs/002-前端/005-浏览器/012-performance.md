- https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn
- https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=zh-cn
- https://web.dev/fid/
- https://web.dev/vitals/
- https://developers.google.com/web/fundamentals/performance/get-started?hl=zh-cn
- https://developers.google.com/web/tools/chrome-user-experience-report/
- [在线分析工具](https://developers.google.com/speed/pagespeed/insights/)

### Performance API是什么？
Performance API用于精确度量、控制、增强浏览器的性能表现。这个API为测量网站性能，`提供以前没有办法做到的精度`。
- **测量网站性能**
- **精度更高**

比如，为了得到脚本运行的准确耗时，需要一个高精度时间戳。传统的做法是使用Date对象的getTime方法。

```js
var start = new Date().getTime();

// do something here

var now = new Date().getTime();
var latency = now - start;
console.log("任务运行时间：" + latency);
```
- getTime方法（以及Date对象的其他方法）都只能精确到毫秒级别（一秒的千分之一），想要得到更小的时间差别就无能为力了。
- 其次，这种写法只能获取代码运行过程中的时间进度，无法知道一些后台事件的时间进度，比如浏览器用了多少时间从服务器加载网页。


### performance.timing对象
`performance`对象的`timing`属性指向一个对象，它包含了各种与浏览器性能有关的时间数据，提供浏览器处理网页各个阶段的耗时。

`performance.timing`对象包含以下属性（全部为只读）：

- `navigationStart`：当前浏览器窗口的前一个网页关闭，发生unload事件时的Unix毫秒时间戳。如果没有前一个网页，则等于fetchStart属性。

- `unloadEventStart`：如果前一个网页与当前网页属于同一个域名，则返回前一个网页的unload事件发生时的Unix毫秒时间戳。如果没有前一个网页，或者之前的网页跳转不是在同一个域名内，则返回值为0。

- `unloadEventEnd`：如果前一个网页与当前网页属于同一个域名，则返回前一个网页unload事件的`回调函数结束时`的Unix毫秒时间戳。如果没有前一个网页，或者之前的网页跳转不是在同一个域名内，则返回值为0。

- `redirectStart`：返回第一个HTTP跳转开始时的Unix毫秒时间戳。如果没有跳转，或者不是同一个域名内部的跳转，则返回值为0。

- `redirectEnd`：返回最后一个HTTP跳转结束时（即跳转回应的最后一个字节接受完成时）的Unix毫秒时间戳。如果没有跳转，或者不是同一个域名内部的跳转，则返回值为0。

- `fetchStart`：返回浏览器准备使用HTTP请求读取文档时的Unix毫秒时间戳。该事件在网页查询本地缓存之前发生。

- `domainLookupStart`：返回域名查询开始时的Unix毫秒时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值。

- `domainLookupEnd`：返回域名查询结束时的Unix毫秒时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值。

- `connectStart`：返回HTTP请求开始向服务器发送时的Unix毫秒时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值。

- `connectEnd`：返回浏览器与服务器之间的连接建立时的Unix毫秒时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。

- `secureConnectionStart`：返回浏览器与服务器开始安全链接的握手时的Unix毫秒时间戳。如果当前网页不要求安全连接，则返回0。

- `requestStart`：返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的Unix毫秒时间戳。

- `responseStart`：返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳。

- `responseEnd`：返回浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳。

- `domLoading`：返回当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的readystatechange事件触发时）的Unix毫秒时间戳。

- `domInteractive`：返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的Unix毫秒时间戳。

- `domContentLoadedEventStart`：返回当前网页DOMContentLoaded事件发生时（即DOM结构解析完毕、所有脚本开始运行时）的Unix毫秒时间戳。

- `domContentLoadedEventEnd`：返回当前网页所有需要执行的脚本执行完成时的Unix毫秒时间戳。

- `domComplete`：返回当前网页DOM结构生成时（即Document.readyState属性变为“complete”，以及相应的readystatechange事件发生时）的Unix毫秒时间戳。

- `loadEventStart`：返回当前网页load事件的回调函数开始时的Unix毫秒时间戳。如果该事件还没有发生，返回0。

- `loadEventEnd`：返回当前网页load事件的回调函数运行结束时的Unix毫秒时间戳。如果该事件还没有发生，返回0。

### performance.now()
performance.now()方法返回当前网页自从`performance.timing.navigationStart`到当前时间之间的毫秒数。

```js
performance.now()
// 23493457.476999998

Date.now() - (performance.timing.navigationStart + performance.now())
// -0.64306640625
```

通过两次调用`performance.now()`方法，可以得到间隔的准确时间，用来衡量某种操作的耗时。

```js
var start = performance.now();
doTasks();
var end = performance.now();

console.log('耗时：' + (end - start) + '毫秒。');
```

### performance.mark()

mark方法用于为相应的视点做标记。
```js
window.performance.mark('mark_fully_loaded');

// clearMarks方法用于清除标记，如果不加参数，就表示清除所有标记。
window.peformance.clearMarks('mark_fully_loaded');

window.performance.clearMarks();
```