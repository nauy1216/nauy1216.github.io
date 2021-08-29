### webworkers

作用：
可以让js程序具备后台处理的能力，对多线程的支持非常好。

用法：

#### （1）页面脚本

var w1 = new Worker('test.js');//创建线程

参数是：后台处理的js文件地址

此时tes.js有自己的运行环境，不能操作DOM，功能有限。

w1.postMessage('hi');//向线程传递信息

w1.onmessage = function(ev){//监听线程传过来的信息

alert( ev.data );

};

（2）线程js文件



self.onmessage = function(ev){

//console.log(ev.data);

self.postMessage(ev.data + '妙味课堂');

};

worker运行环境：

1、navigator

2、location

3、self：指向全局的worker对象

4、所有的ECMA对象

5、XMLHttpRequest构造器

6、setInterval、serTimeout

7、close():立即停止本线程

8、importScripts():在后台线程引入一个js文件

9、没有DOM操作