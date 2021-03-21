### 1

```js

// 导入模块
const fs = require('fs');
const zlib = require('zlib');
// 创建文件的可读流
const rs = fs.createReadStream('./data.txt');
 
// 创建文件的可写流
const ws = fs.createWriteStream('./data.txt.gzip');
// 创建gzip压缩 流对象，gzip可读可写
const gzip =zlib.createGzip();
// 管道操作

rs.pipe(gzip).pipe(ws);
```



### 2

```js
// 导入模块
const fs = require('fs');
const zlib = require('zlib');
let src;
let dst;
// 获取压缩的源文件和目录文件
if (process.argv[2]) {
    src = process.argv[2];
} else {
    throw new Error('请指定源文件');
}
if (process.argv[3]) {
    dst = process.argv[3];
} else {
    throw new Error('请指定目标文件');
}
// 创建文件的可读流
const rs = fs.createReadStream(src);
// 创建文件的可写流
const ws = fs.createWriteStream(dst);
 
const gzip =zlib.createGzip();
// 管道操作
rs.pipe(gzip).pipe(ws);
```



### 3

```js
const fs = require('fs');
const zlib = require('zlib');
// 判断存在参数
if (!process.argv[2] && !process.argv[3]) {
    throw new Error('请指定参数');
}
// 创建文件的可读流
const rs = fs.createReadStream(process.argv[2]);
// 创建文件的可写流
const ws = fs.createWriteStream(process.argv[3]);
const gzip =zlib.createGunzip();
// 管道操作
rs.pipe(gzip).pipe(ws);
console.log('解压成功'); 
```



### 4

```js
//导入模块
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
//创建http服务
http.createServer((req, res) => {
    const rs = fs.createReadStream('./index.html');
    //判断 浏览器是否需要 压缩版的
    if (req.headers['accept-encoding'].indexOf('gzip') != -1) {
        console.log('压缩')
        //设置响应头
        res.writeHead(200, {
           'content-encoding': 'gzip'
        });
        rs.pipe(zlib.createGzip()).pipe(res);
    } else {
        //不压缩
        rs.pipe(res);
    }
}).listen(8080, () => {
    console.log('http server is running on port 8080');
});
```

