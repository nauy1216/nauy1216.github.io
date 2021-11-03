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