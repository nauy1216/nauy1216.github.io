- https://segmentfault.com/a/1190000021876836

# 内网穿透的原理
- https://www.zhihu.com/question/276309837
- https://blog.csdn.net/lyb3290/article/details/80239890

# 搭建frp
- https://www.jianshu.com/p/6be158cc3685
- https://cloud.tencent.com/developer/article/1622549
- https://github.com/fatedier/frp/blob/master/README_zh.md
- https://gofrp.org/docs/
- https://cloud.tencent.com/developer/article/1720395
- https://www.cnblogs.com/sanduzxcvbnm/p/8509150.html

# 登录
```shell
ssh -p 22 ubuntu@119.91.143.146
```

# 下载
```shell
sudo wget https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz
```

# 解压安装node
- https://segmentfault.com/a/1190000039973959
```shell
# 解压 
tar -xvf node-v11.0.0.tar.gz
sudo ln -s /download/node12/bin/node /usr/bin/node
sudo ln -s /download/node12/bin/npm /usr/bin/npm
```

# 文件传输
- https://blog.csdn.net/u013381011/article/details/78310903
```shell
# 注意只有/tmp目录才有权限
# 可以先传到tmp目录再移动到其他的目录
scp -r localfile.txt ubuntu@119.91.143.146:/tmp/files
```

# 端口占用
1. 输入命令netstat -tanlp
```shell
netstat -tanlp
```
2. 找到端口所占进程的pid，在kill掉
```shell
kill -9 2846
```

# 写文件
```shell
echo '写入的内容’ >  ./文件名.txt
```

# 后台运行
```shell
nohup ./frps -c frps.ini &
```

# 服务端配置frps
```shell
[common]
#内网穿透服务器端监听的IP地址，可以省略，默认为127.0.0.1
#bind_addr = 0.0.0.0
#服务器端监听的端口，默认是7000，可自定义
bind_port = 7000
vhost_http_port = 8080
token=123
```

# 客户端配置
```shell
[common]
# 服务器地址
server_addr = 119.91.143.146
# 服务器设置的bind_port
server_port = 7000
# 与服务器设置的一致
token=123

[web]
type = tcp
local_ip = 127.0.0.1
# 本地服务端口
local_port = 5000
# 对应的远程服务端口
remote_port = 5000
```
访问`119.91.143.146:5000`就能访问到本地服务了。