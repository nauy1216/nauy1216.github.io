### client.js

```js
//chatClient.js
var net = require('net');
process.stdin.resume();
process.stdin.setEncoding('utf8');
var client = net.connect({port: 9988},function(){
    console.log('【本机提示】登录到聊天室');
    process.stdin.on('data',function(data){
        client.write(data);
    })
    client.on("data", function(data) {
        console.log(data.toString());
    });
    client.on('end', function() {
        console.log('【本机提示】退出聊天室');
        process.exit();
    });
    client.on('error', function() {
        console.log('【本机提示】聊天室异常');
        process.exit();
    });

    client.write('hello，我是123')
});
```



### chatServer.js

```js
//chatServer.js
var net = require('net');
var i = 0;
//保存客户机
var clientList = [];
var server = net.createServer(function(socket) {
    socket.name = '用户' + (++i);
    socket.write('【聊天室提示】欢迎' + socket.name + '\n');
    //更新客户机数组
    clientList.push(socket); 
    function showClients(){
        console.log('【当前在线用户】：');
        for(var i=0;i<clientList.length;i++) { 
            console.log(clientList[i].name);
        }        
    }
    showClients();
    socket.on("data", function(data) {
        //把当前连接的客户机的信息转发到其他客户机  
        for(var i=0;i<clientList.length;i++) { 
            if(socket !== clientList[i]) {      
                clientList[i].write('【' + socket.name + '】：' + data);   
            }  
        }
    });
    socket.on("close", function() {
        //当前客户机下线时，将其从客户机数组中移除
        clientList.splice(clientList.indexOf(socket), 1);
        showClients();
    });
    socket.on('error', function(err) {
        console.log(socket.name + '退出');
    });
});
server.listen(9988) ;
```

