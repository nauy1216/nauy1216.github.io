### fs.constants

/返回包含文件系统操作常用常量的对象。 当前定义的特定常量在 FS 常量中描述。



### fs.access()、fs.accessSync()

检查当前目录中是否存在该文件。

```js
function test_access() {
    fs.access('./file/1.txt', fs.constants.F_OK, (err, data) => {
        console.log(err, data)
        if (!err) {
            console.log('文件存在。。。。')
        }
    })
}

function test_accessSync() {
    try {
        fs.accessSync('./file/1.txt', fs.constants.F_OK)
        console.log('文件存在')
    } catch(e) {
        console.log('error')
    }
}
```



### fs.createReadStream()

```js
function test_createReadStream() {
    let readStream =  fs.createReadStream('./file/1.txt', {
        highWaterMark:3, //文件一次读多少字节,默认 64*1024
        flags:'r', //默认 'r'
        autoClose:true, //默认读取完毕后自动关闭
        // start:0, //读取文件开始位置
        // end:3, //流是闭合区间 包含start也含end
        encoding:'utf8' //默认null
    })
    //读取文件发生错误事件
    readStream.on('error', (err) => {
        console.log('发生异常:', err);
    });
    //已打开要读取的文件事件
    readStream.on('open', (fd) => {
        console.log('文件已打开:', fd);
    });
    //文件已经就位，可用于读取事件
    readStream.on('ready', () => {
        console.log('文件已准备好..');
    });
    
    //文件读取中事件·····
    readStream.on('data', (chunk) => {
        console.log('读取文件数据:', chunk.toString());
    });
    
    //文件读取完成事件
    readStream.on('end', () => {
        console.log('读取已完成..');
    });
    
    //文件已关闭事件
    readStream.on('close', () => {
        console.log('文件已关闭！');

    })
}
```



### fs.createWriteStream()

```js
function test_createWriteStream() {
    let writeStream=fs.createWriteStream('./file/b.js',{encoding:'utf8'});
    //读取文件发生错误事件
    writeStream.on('error', (err) => {
        console.log('发生异常:', err);
    });
    //已打开要写入的文件事件
    writeStream.on('open', (fd) => {
        console.log('文件已打开:', fd);
    });
    //文件已经就写入完成事件
    writeStream.on('finish', () => {
        console.log('写入已完成..');
        console.log('读取文件内容:', fs.readFileSync('./file/b.js', 'utf8')); //打印写入的内容
        // console.log(writeStream);
    });
    
    //文件关闭事件
    writeStream.on('close', () => {
        console.log('文件已关闭！');
    });
    
    // 往文件内写入内容
    writeStream.write('console.log("hello")');
    // 结束
    writeStream.end();

}
```

