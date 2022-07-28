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

ps aux | less -A

 19060
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
vhost_http_port = 80
vhost_https_port = 443
token=123
```

# 客户端配置
```shell
[common]
server_addr = 119.91.143.146
server_port = 7000
token=123

[web]
type = tcp
local_ip = 127.0.0.1
local_port = 5000
remote_port = 5000

[web2]
type = tcp
local_ip = 127.0.0.1
local_port = 5001
remote_port = 5001

[web3]
type = tcp
local_ip = 127.0.0.1
local_port = 5123
remote_port = 5002

# 设置80端口，记得在腾讯云防火墙开启端口
[web4]
type = http
local_ip = 127.0.0.1
local_port = 5001
custom_domains = tt.codemao.cn # 设置访问的域名，
remote_port = 80

; 文档https://cloud.tencent.com/developer/article/1581948
[web5]
type = https
local_port = 5001
custom_domains = tt.codemao.cn
plugin = https2http
plugin_local_addr = 127.0.0.1:5001
plugin_host_header_rewrite = 127.0.0.1
plugin_header_X-From-Where = frp
plugin_crt_path = ./cert/crt.crt
plugin_key_path = ./cert/key.key
```
访问`119.91.143.146:5000`就能访问到本地服务了。


# 购买域名