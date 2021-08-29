```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  // 衍生工作进程。
  console.log('fork start')
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  console.log('fork end')

  cluster.on('fork', worker =>{
      console.log('fork ', worker.process.pid)
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  http.createServer((req, res) => {
      if (req.url == '/a') {
          while(true) {}
      } else {
        res.writeHead(200);
        res.end(req.url);
      }
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

