在文件1_1.js定义全局变量

```
// 定义全局变量
global.a = 'ggggggggg'
global.a1 = 'ggggggggg'
global.a2 = 'ggggggggg'
global.a3 = 'ggggggggg'
global.a4 = 'ggggggggg'
global.a5 = 'ggggggggg'
```

使用全局变量

```js
require('./1_1.js')
console.log(global)
```



### __dirname、__filename、module

```js
// console.log(__dirname)
// console.log(__filename)
// console.log(module)
```





### queueMicrotask

```js
console.log('outer 1')
queueMicrotask(function() {
    console.log('q 1')
})
console.log('outer 2')
queueMicrotask(function() {
    console.log('q 2')
})
console.log('outer 3')

/*
outer 1
outer 2
outer 3
q 1
q 2
*/
```



### TextEncoder

```js
// TextEncoder 的所有实例仅支持 UTF-8 编码。
const encoder = new TextEncoder();
const uint8array = encoder.encode('刘a');
console.log(uint8array) //  [ 229, 136, 152, 97 ]

const decoder = new TextDecoder()
const str = decoder.decode(uint8array)
console.log(str) //刘a

var n1 = 229
var n2 = 136
var n3 = 152

// 刘 unicode 码是\u5218 十进制21016  二进制101 001000 011000
console.log(n1.toString(2)) // 11100101
console.log(n2.toString(2)) // 10001000
console.log(n3.toString(2)) // 10011000

/**
unicode、ascii均是字符集，utf-8是使用unicode的一种编码方式。 
/////////////////////

字符 -------> 刘
unicode -------> \u5218
十进制 -------> 21016
二进制 -------> 101001000011000
在内存中不是简单的保存上面的二进制，内存 -----> 11100101 10001000 10011000
1、所有的字节用1开头表示这是有多个字节存储的字符。
2、第一个字节以3个1开头表示这个字符占有3个字节的内存。
3、从第二个字节开始第二位固定是0。
4、将unicode码的二进制从低位开始每6位保存在最后的一个字节，不足的用0填充
例：
101 001000 011000 在内存中的二进制表示为
111 00101 ----> 229
10 001000 ----> 136
10 011000 ----> 152

所以字符 ‘刘’ 在经过utf-8编码之后对应的Uint8Array为 [229, 136, 152]

*/
```



### URL

```js
const myURL = new URL('/foo', 'https://example.org/')
console.log(myURL)
```

