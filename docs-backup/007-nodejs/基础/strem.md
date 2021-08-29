### createReadStream、createWriteStream

```js
// https://www.jianshu.com/p/4eb9077a8956
// https://www.jianshu.com/p/8738832e7515
const stream = require('stream');
var EventEmitter = require('events')
const fs = require('fs')

let readStream = fs.createReadStream('./test/1.txt')
let writeStream = fs.createWriteStream('./test/a.txt')

writeStream.on('finish', (err, data) => {
    console.log('finish')
})


// class MyWritableStream extends EventEmitter{
//     write(a, b, c, d) {
//         console.log(a, b, c, d)
//     }
//     end(a, b, c, d) {
//         console.log(a, b, c, d)
//     }
// }

let write = writeStream.write
writeStream.write = function(data) {
    let str = data.toString()
    str = str.replace(/[0-9]/g, '*')
    console.log(str)
    data = Buffer.from(str)

    write.call(this, data)
}

readStream.pipe(writeStream)
// readStream.pipe(new MyWritableStream()) // .pipe(writeStream)
```



### 1

```js
var fs = require('fs');
var readStream = fs.createReadStream('./test/1.txt', {
    highWaterMark: 10
}); // 创建可读流
var writeStream = fs.createWriteStream('./test/2.txt', {
    highWaterMark: 1
}); // 创建可写流

readStream.on('data', async function(chunk) { // 当有数据流出时，写入数据
    // let flag = await new Promise((resolve) => {
    //     let f = writeStream.write(chunk);
    //     resolve(f)
    // }).catch(err => console.log(err))
    // console.log(flag)

    let flag = writeStream.write(chunk);
    console.log(flag)
    if(!flag){
        readStream.pause()
    }
    // console.log(chunk.toString(), '\n==============')
    // console.log(writeStream.writableBuffer)
    // console.log(readStream.readableBuffer)
});

readStream.on('end', function() { // 当没有数据时，关闭数据流
    writeStream.end();
});

writeStream.on('drain', function() {
    console.log('drain')
    readStream.resume()
})
```





### 2

```js
const { Readable } = require('stream');
   
let i = 0;
    
const rs = Readable({
    encoding: 'utf8',
    // 这里传入的read方法，会被写入_read()
    read: (size) => {
        // size 为highWaterMark大小
        // 在这个方法里面实现获取数据，读取到数据调用rs.push([data])，如果没有数据了，push(null)结束流
        if (i < 6) {
            rs.push(`当前读取数据: ${i++}`);
        } else {
            rs.push(null);
        }
    },
    // 源代码，可覆盖
    destroy(err, cb) {
        rs.push(null);
        cb(err);
    }
});
    
rs.on('data', (data) => {
    console.log(data);
    // 每次push数据则触发data事件
})
```





### 3

```js
var fs = require('fs');


var readStream = fs.createReadStream('./test/1.txt', {
    highWaterMark: 10
}); // 创建可读流
var writeStream = fs.createWriteStream('./test/2.txt', {
    highWaterMark: 1
}); // 创建可写流

readStream.on('data', async function(chunk) { // 当有数据流出时，写入数据
    let flag = writeStream.write(chunk);
    console.log(flag)
});

readStream.on('end', function() { // 当没有数据时，关闭数据流
    // writeStream.end();
    // writeStream.uncork()
});

// cork() 方法强制把所有写入的数据都缓冲到内存中。 当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据才会被输出。
// 主要目的是为了适应将几个数据快速连续地写入流的情况。 writable.cork() 不会立即将它们转发到底层的目标，而是缓冲所有数据块，直到调用 writable.uncork()，这会将它们全部传给 writable._writev()（如果存在）
writeStream.cork()
writeStream.on('drain', function() {
    console.log('drain')
    readStream.resume()
})
```



### 4

```js
var {PassThrough} = require('stream')
const pass = new PassThrough();
const writable = new PassThrough();

// pass.pipe(writable);
// pass.unpipe(writable);
// readableFlowing 现在为 false。

// pass.on('data', (chunk) => { console.log(chunk.toString()); });
// pass.write('ok'); // 不会触发 'data' 事件。
// pass.resume(); // 必须调用它才会触发 'data' 事件。

function * generate() {
    yield 'hello';
    yield 'streams';
}

let gen = generate()
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
```

