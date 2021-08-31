# XMLHttpRequest 1级



## 什么是ajax？

这种技术就是无需刷新页面即可从服务器取得数据。**Asynchronous JavaScript + XML**。

## 兼容

IE6及以下不支持原生的XMLHttpRequest对象。 

IE6: 使用 new ActiveObject()创建
IE7+及其他：**new XMLHttpRequest()**



## 创建XHR对象

考虑到兼容的问题，所以创建XHR对象时，要做出不同的判断。

```js
        function createXHR(){
            if( typeof XMLHttpRequest !== "undefined" ){
                return new XMLHttpRequest();
            }else if( typeof ActiveXObject !== "undefined" ){
                //....
            }else {
                throw new Error("没有创建XHR对象");
            }
        }
```

### open()方法

用法：接受三个参数。
第一个参数：发送请求的类型。
第二个参数：请求的URL地址，可以是相对当前页面的相对路径，也可以是绝对路径。
第三个参数：是否异步。

**调用open方法不会真的发送请求，而是启动一个请求以备发送。**
**不能跨域。**

```js
 XHR.open("post","1.php",true);
```

### send()方法

作用:将请求分配到服务器。
接受一个参数：作为请求主体发送的数据，如果不需要发送数据，则必须传入null。

```js
 XHR.open("post","1.php",true);
 XHR.send(null);
```



### XHR对象的属性

在收到相应时，响应的数据会自动填充XHR对象的属性。

#### 包含的四种属性

1. responseText ：响应主体返回的文本。

2. responseXML ：返回包含响应数据的XML DOM文档。

3. readyState（XHR请求、相应活动的当前阶段）
   0：未初始化。尚未调用open()
   1：启动。调用open()，但未调用send()。
   2：发送。调用send()，但未接收到响应。
   3：接收。已经接收到部分响应数据。
   4：完成。已经接收到全部响应数据，而且可以在客户端使用了。

4. status ： 服务器响应的HTTP状态。

5. statusText ：HTTP状态说明。

6. readystatechange事件：
   readyState的值每发生一次变化，都会触发一次事件。
   为了保证兼容性，必须在调用send()之前注册事件函数。

   

HTTP状态码：
200：成功
300：失败
304：表示请求的资源没有修改，可以直接使用浏览器缓存的版本。

```js
        xhr.readystatechange = function(){
            if(xhr.readyState == 4）{
                if((xhr.status >=200 && xhr < 300 || xhr.status == 304 )){
                    //
                }
            }
        }

        xhr.open("post","1.php",true);
        xhr.send(null);
    
```

### 设置请求头信息

```js
setRequestHeader("头部字段"， "要设置的值");
```

**注意：**必须在open()之后，send()之前调用。



### 获取请求头信息

```js
getResponseHeader("头部字段")
// 获取指定的信息。

getAllResponseHeader()
// 获取所有的头部信息。
```



### get请求

1. 将要发送给服务器的数据放到URL后面，格式为 url？name=aa&age=12
2. 查询字符串是以？开头，以&拼接每个键值对。
3. 每个键值对都应该使用`encodeURIComponent()`编码后再加到url后面去。

   

### post请求

1. 把数据作为请求的主体提交。是通过send()函数来提交数据的。
2. 与get不一样的是可以一次性传递非常多的数据，而且数据格式不限。
3. 默认情况下，服务器对post请求和表单的请求是不一样的。
   因此如果想让post请求和get请求一样发送同样格式的数据必须做到下面两点。
   1、设置Content-Type的头部信息为application/x-www-form-urlencoded
   2、将表单要提交的内容以和get请求一样的数据格式通过send()发送。



# XMLHttpRequest 2级

并非所有浏览器都完整的实现了XMLHttpRequest 2级的规范，但所有浏览器都实现了它规定的部分内容。

## FormData对象

作用：序列化表单数据。

用法：
1、var data = new FormData(document.form[0]);
2、data.append("key","value")
3、将data直接传递给send()函数。

注意：
1、这种形式的数据可以非常大，比如通过表单上传大文件。
2、只能通过post方式发送，但与XHR不一样的是，不需手动设置请求头信息，不需手动序列化表单数据。



## 超时限定

属性：timeout
设定响应不能超过的时间。
事件：ontimeout
请求响应超时执行的函数。

```js
        xhr.timeout = 1000;//将超时设置为1秒钟，IE67不兼容
        xhr.ontimeout = {}
```



## 进度事件

1. loadstart ：
   在接受到相应数据第一个字节时触发。
2. progress ：
   在接收响应期间不断的触发。
3. error ：
   请求发生错误是=时触发。=
4. abort ：
   因为掉用abort()方法而终止连接时触发。
5. load ：
   在接受到完整的响应数据时触发。
6. loadend ：
   在通信完成或者触发error、abort、或是load事件后触发。

用的较多的是onload 和 onprogress 。 onload只兼容IE8+。





# JSONP

**JSON with padding**。看起来与JSON差不多，只不过是被包含在函数中调用的JSON。

JSONP是有两个部分组成： 

1. 回调函数是在前端定义好的函数，当响应到来时就会在页面中调用该函数。 回调函数的名字一般都是在请求中的查询字符串中指定的。 
2. 数据就是传入回调函数中的JSON数据。

注意事项： 

1. 跨域请求的相应的内容很可能会夹带一些恶意的代码。 
2. 要确定JSONP请求是否失败并不容易。

```js
        //事先定义好的回调函数
        function handleResponse(res){
            alert("you're at IP address" + res.id + ", which is in" + res.city);
        }

        //创建script对象
        var script  = document.createElement("script");

        //请求返回一个handleResponse(json)的js文件，
        script.src = "http://freegeoip.net/json/?callback = handleResponse";

        //将script插入文档时，将会接收到一个js文件，内容是callback({})的格式。
        document.head.appendChild(script);
    
```

