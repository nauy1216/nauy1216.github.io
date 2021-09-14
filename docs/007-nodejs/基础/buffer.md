## Buffer?

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。



### Buffer.alloc()

创建一个长度为10，且用0填充的Buffer, Buffer的每一个字节都是8位。

```js
var buffer1 = Buffer.alloc(10)
// console.log(buffer1) // <Buffer 00 00 00 00 00 00 00 00 00 00>
```

长度为10，用255填充的的Buffer。

```js
var buffer2 = Buffer.alloc(10, 255)
// console.log(buffer2) // <Buffer ff ff ff ff ff ff ff ff ff ff>
```



### Buffer.allocUnsafe()

```js
// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
var buffer3 = Buffer.allocUnsafe(10)
// console.log(buffer3)
```



### Buffer.from()

```
var buffer4 = Buffer.from([1, 2, 3])
// console.log(buffer4) // <Buffer 01 02 03>

var buffer5 = Buffer.from('abc')
// console.log(buffer5) // <Buffer 61 62 63> 这里的61是16进制
```



```js
// 当字符串数据被存储入 Buffer 实例或从 Buffer 实例中被提取时，可以指定一个字符编码。
var buf = Buffer.from('刘', 'ascii')
console.log(buf) // <Buffer 18>
console.log(buf.toString('ascii')) // 中文使用ascii编码会出现问题
console.log(buf.toString('hex')) // 18

var buf1 = Buffer.from('刘', 'utf-8')
console.log(buf1) // <Buffer e5 88 98>
console.log(buf1.toString('utf-8')) // 刘
console.log(buf1.toString('hex')) // e58898
```



### Buffer.allocUnsafeSlow()

```js
/**
 如果 size 小于或等于 Buffer.poolSize 的一半，
 则 Buffer.allocUnsafe() 返回的 Buffer 实例可能是从共享的内部内存池中分配。 
 Buffer.allocUnsafeSlow() 返回的实例则从不使用共享的内部内存池。
*/
var buffer6 = Buffer.allocUnsafeSlow(10)
console.log(buffer6)
```





### Uint32Array

```js
var arr = new Uint32Array(2)
arr[0] = 3000
arr[1] = 4000
// console.log(arr) // Uint32Array [ 3000, 4000 ]
// console.log(arr.buffer) // ArrayBuffer { [Uint8Contents]: <b8 0b 00 00 a0 0f 00 00>, byteLength: 8 }

// 拷贝 `arr` 的内容, 损失了一些数据
var buffer = Buffer.from(arr)
// console.log(buffer) // <Buffer b8 a0>

// 通过使用 TypedArray 对象的 .buffer 属性，可以创建一个与 TypedArray 实例共享相同内存的新 Buffer。
var buffer1 = Buffer.from(arr.buffer)
// console.log(buffer1) // <Buffer b8 0b 00 00 a0 0f 00 00>


// 当使用 TypedArray 的 .buffer 创建 Buffer 时，也可以通过传入 byteOffset 和 length 参数只使用 TypedArray 的一部分。
var arr1 = new Uint16Array(2)  // Uint16Array [ 0, 0 ] 默认值都是0
arr1[0] = 300
arr1[1] = 500
console.log(arr1) // Uint16Array [ 300, 500 ]
console.log(arr1.buffer)// ArrayBuffer { [Uint8Contents]: <2c 01 f4 01>, byteLength: 4 }
console.log(Buffer.from(arr1.buffer, 0, 2)) // <Buffer 2c 01>

```



### 遍历

```js
var arr = new Uint16Array([1,2,3])

// 遍历每一项
for (var b of arr) {
    console.log(b)
}
/*
1
2
3
*/

// 遍历每一个字节，因为每一项都是16位的整数， 所以会输出6次
for (var b of Buffer.from(arr.buffer)) {
    console.log(b)
}
/*
1
0
2
0
3
0
*/
```



### 长度

```js
const str = '\u00bd+\u00bc=\u00be';
console.log(`${str}: ${str.length} 个字符, ${Buffer.byteLength(str, 'utf8')} 个字节`);
// ½+¼=¾: 5 个字符, 8 个字节
```



### Buffer.compare()

```js
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('2123');
const arr = [buf1, buf2];

// 比较两个buffer
// console.log(arr.sort(Buffer.compare)); // [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
console.log(Buffer.compare(buf1, buf2)) // 1
```



### Buffer.concat()

```js
/**
Buffer.concat(list[, totalLength])
返回一个合并了 list 中所有 Buffer 实例的新 Buffer。
如果 list 中没有元素、或 totalLength 为 0，则返回一个长度为 0 的 Buffer。
如果没有提供 totalLength，则计算 list 中的 Buffer 实例的总长度。 但是这会导致执行额外的循环用于计算 totalLength，因此如果已知长度，则明确提供长度会更快。
如果提供了 totalLength，则会强制转换为无符号整数。 如果 list 中的 Buffer 合并后的总长度大于 totalLength，则结果会被截断到 totalLength 的长度。
 */

 
const buf1 = Buffer.from([1, 2, 3]);
const buf2 = Buffer.from([4, 5, 6]);
const buf3 = Buffer.from([201, 202, 203]);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength); // 9
const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);
console.log(bufA); // <Buffer 01 02 03 04 05 06 c9 ca cb>
console.log(bufA.length); // 9
```



### Buffer.isBuffer()

```js
console.log(Buffer.isBuffer(Buffer.alloc(1))) // true
console.log(Buffer.isBuffer(5)) // false
```





### Buffer.isEncoding()

```js
console.log(Buffer.isEncoding('utf8')) // true
console.log(Buffer.isEncoding('utf81')) // false
```





```js
const str = 'abc';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i)
}
// console.log('刘'.charCodeAt(0)) // 21016
console.log(buf) // <Buffer 61 62 63>
```

