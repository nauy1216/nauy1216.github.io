# 1、最新的 ECMAScript 标准定义了 9 种数据类型:

-   6 种原始类型
    -   String: typeof instance === "string"
    -   Number: typeof instance === "number"
    -   Boolean: typeof instance === "boolean"
    -   undefined: typeof instance === "undefined"
    -   Symbol: typeof instance === "symbol"
    -   BigInt: typeof instance === "bigint"
-   null: typeof instance === "object"
-   Function: typeof instance === "function"
-   Object: typeof instance === "object"

> typeof 只能用来检查基本类型数据，检查从 Object 派生出来的对象，使用 typeof 不起作用, 因为总是会得到 "object"。检查 Object 种类的合适方式是使用 instanceof 关键字。但即使这样也存在误差。

> 原始值

除 Object 以外的所有类型都是不可变的（值本身无法被改变）。
例如，与 C 语言不同，JavaScript 中字符串是不可变的。
如 JavaScript 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变。我们称这些类型的值为“原始值”。

> BigInt 类型
> BigInt 类型是 JavaScript 中的一个基础的数值类型，可以用任意精度表示整数。
> 使用 BigInt，您可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
> BigInt 是通过在整数末尾附加 n 或调用构造函数来创建的。


# 2、typeof

> typeof 可以用来判断基本类型、null、object、function。

> typeof(null) === 'object'
> 原理是这样的， 不同的对象在底层都表示为二进制， 在 JavaScript 中二进制前三位都为 0 的话会被判断为 object 类型，
> null 的二进制表示是全 0， 自然前三位也是 0， 所以执行 typeof 时会返回“object”。

```js
typeof null === 'object' // true
null instanceof Object // false
```

> 判断变量是否存在
> 比如直接判断 window 是否存在，可能会报错

```js
if (window) {
    // Uncaught ReferenceError: window is not defined
}
```

但是使用`typeof`却不会。

```js
if (typeof window === 'undefined') {
}
```



### typeof的原理

来谈谈关于 `typeof` 的原理吧，我们可以先想一个很有意思的问题，js 在底层是怎么存储数据的类型信息呢？或者说，一个 js 的变量，在它的底层实现中，它的类型信息是怎么实现的呢？

其实，js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息👉

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数

but, 对于 `undefined` 和 `null` 来说，这两个值的信息存储是有点特殊的。

`null`：所有机器码均为0

`undefined`：用 −2^30 整数来表示

所以，`typeof` 在判断 `null` 的时候就出现问题了，由于 `null` 的所有机器码均为0，因此直接被当做了对象来看待。



# 3、显示类型转换

> 转 string

-   undefined --> "undefined"
-   true --> "true", false --> "false"
-   null --> "null"
-   2 --> "2"
-   Symbol.for('k') -> "Symbol(k)"
-   [1, 2] --> "1,2"
-   {a: 1} --> "[object Object]"
-   function() {console.log()} --> "function() {console.log()}"

> 转 number,使用 Number()

-   undefined --> NaN
-   true --> 1, false --> 0
-   null --> 0
-   "0" --> 0, "" --> 0, "" --> 10, "1d" --> NaN
-   Symbol.for("") --> 报错 Cannot convert a Symbol value to a number
-   [1, 2] --> NaN, [] --> 0
-   {a: 1} --> NaN, {} --> NaN

> 转布尔值,使用 Boolean()

-   undefined --> false
-   null --> false
-   非 0 数字 --> true, 0 --> false, NaN --> false
-   "" --> false, "33" --> true
-   Symbol.for("") --> true
-   [1, 2] --> true
-   {a: 1} --> true

# 4、隐式类型转换

> 字符串和数字之间的隐式转换

```js
var a = '42'
var b = '0'
var c = 42
var d = 0
a + b // "420" 这个地方，注意一下
c + d // 42
a + d // "420"
[] + {} // [object object]
{} + [] // 0 这里的{}会被当作是一个代码块，所以本质上是+[]
console.log({} + []) // [object object]
+[] // 0
-[] // -0
[] == ![] // true
```

> 隐式强制类型转换为布尔值
1. if (..)语句中的条件判断表达式。
2. for ( .. ; .. ; .. )语句中的条件判断表达式(第二个)。
3. while (..) 和 do..while(..) 循环中的条件判断表达式。
4. ? :中的条件判断表达式。
5. 逻辑运算符 ||(逻辑或)和 &&(逻辑与)左边的操作数(作为条件判断表达式)。

> || 与 &&
```js
a || b // 大致相当于(roughly equivalent to): a ? a : b;
a && b // 大致相当于(roughly equivalent to): a ? b : a;
```

> == 与 ===
1. 常见的误区是“== 检查值是否相等，=== 检查值和类型是否相等”
2. “== 允许在相等比较中进行强制类型转换，而 === 不允许。”

### 隐式转换的例子
补充下面的代码，执行后打印1。
```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	conso.log(1);
}
```
引用类型在比较运算符时候,隐式转换会调用本类型toString或valueOf方法。
因为`==`判断之前会做类型转换。每次`==`都会做类型转换吗？
不是, 与{}、[]、null、undefined比较时不会。
```js
var a = {
  i: 1,
  toString() {
    return a.i++;
  }
}

if( a == 1 && a == 2 && a == 3 ) {
  console.log(1);
}
```
或者
```js
let a = [1,2,3];
a.toString = a.shift;
if( a == 1 && a == 2 && a == 3 ) {
  console.log(1);
}
```





# 5、instanceof的实现原理

- https://juejin.cn/post/6844903613584654344

  ```js
  function new_instance_of(leftVaule, rightVaule) { 
      let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
      leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
      while (true) {
      	if (leftVaule === null) {
              return false;	
          }
          if (leftVaule === rightProto) {
              return true;	
          } 
          leftVaule = leftVaule.__proto__ 
      }
  }
  ```


# 6、字符串怎么存储

https://www.jianshu.com/p/4db4b2633dbe

# 7、http2的多路复用是什么？
1. http1.0每次请求都要建立一次http连接， 进行3次握手和4次挥手。
2. http1.1为了解决重复建立连接，引入了keep-alive。允许我们建立一次连接，来返回多次请求的数据。
    - http1.1是基于串行文件传输数据，因此这些请求必须是有序的。由于队首阻塞的原因，实际上我们只是减少了连接的时间，但是并没有减少请求时间。
    - http1.1在chrome浏览器里面限制每个域名最多开启6个http连接。
3. http2.0引入二进制数据帧和流的概念，帧对数据进行顺序标识，浏览器接收到数据后可以按照序列对数据进行合并，而不会出现数据错乱的情况，这样服务器就可以并行的数据传输。 
    - http2.0同域名下所有通信都是在单个连接上完成。
    - 单个连接可以进行交错的请求和响应，之间互不干扰。

> HTTP2采用二进制格式传输,取代了HTTP1.x的文本格式，二进制格式解析更高效。多路复用代替了HTTP1.x的序列和阻塞机制，所有的相同域名请求都通过同一个TCP连接并发完成。在HTTP1.x中，并发多个请求需要多个TCP连接，浏览器为了控制资源会有6-8个TCP连接都限制。

> 多路复用并行交错的发送多个请求和响应，互不干扰。多路复用代替原来的序列和阻塞机制。所有就是请求的都是通过一个TCP连接并发完成。
因为在多路复用之前所有的传输是基于基础文本的，在多路复用中是基于二进制数据帧的传输、消息、流,所以可以做到乱序的传输。多路复用对同一域名下所有请求都是基于流，所以不存在同域并行的阻塞。

# 8、如何解决es6兼容问题？
- 实现Symbol?
  - https://zhuanlan.zhihu.com/p/27297604
- 实现Promise?
- 实现async/await?

# 9、不想让别人对obj添加或删除元素
```js
// 1.
obj = Object.frezze(obj)
// 2. Proxy实现
// 3. Object.seal()
```

# Object.seal()和Object.frezze()的区别？

# == 和 === 的区别？

# 判断数据类型的方法有哪些？
```js
typeof 
instanceof
Object.prototype.toString()
```

# 隐式类型转换

# 虚拟列表的原理？

# WebWorker的缺点是什么？WebWorker是怎样和主线程通信的？除此之外还有其他的方式解决主线程占用的问题吗？

# react的时间切片的实现为什么不用generator实现？

# dom绑定的回调函数是宏任务还是微任务？

# 浏览器为什么要阻止跨域？跨域的条件？哪些资源涉及到跨域？如何解决跨域？跨域请求会到服务器吗？

# js怎么实现多线程并发？ Concurrent.Thread.js

# 组件库设计有什么原则？

# commonjs的原理？

# 对象深拷贝需要注意的问题？JSON.stringify有什么缺陷？

# encodeURIComponent和encodeURI的区别？

# 商城秒杀倒计时怎么和服务器时间同步？

# 浏览器和nodejs中事件循环的区别？


# OAuth2.0的登录流程


# reduce的实现？

# typescript中有哪些js没有的类型？

# tree sharking的原理？
- https://segmentfault.com/a/1190000038962700

# fiddler抓包的原理？
- https://juejin.cn/post/6902235732304527374

# 微任务为什么会阻塞UI渲染？

# 闭包
- 什么是闭包?
- 闭包的特点？

# 浏览器地址栏输入地址唤醒桌面应用的原理。













