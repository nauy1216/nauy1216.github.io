# 1、下载与安装

[安装VMware和CentOS7](https://blog.csdn.net/nuoyanli/article/details/86503686)

[CentOS7下载地址](http://mirrors.aliyun.com/centos/7.7.1908/isos/x86_64/)



vmware15
官网下载后用这个秘钥

YG5H2-ANZ0H-M8ERY-TXZZZ-YKRV8

UG5J2-0ME12-M89WY-NPWXX-WQH88

UA5DR-2ZD4H-089FY-6YQ5T-YPRX6

GA590-86Y05-4806Y-X4PEE-ZV8E0

ZF582-0NW5N-H8D2P-0XZEE-Z22VA

YA18K-0WY8P-H85DY-L4NZG-X7RAD



# 2、网络配置

[设置网络桥接](https://blog.csdn.net/seagal890/article/details/83042561)





# 3、安装软件

## 1、nodejs

```
// 下载
wget https://npm.taobao.org/mirrors/node/v12.16.1/node-v12.16.1-linux-x64.tar.xz

// 解压安装包
tar -xvf node-v11.0.0.tar.xz

// 将解压后的文件移动到/usr/local/bin/
mv /usr/nodejs/ /usr/local/bin/

// 建立软连接
ln -s  /usr/local/bin/nodejs/bin/node    /usr/local/bin/
ln -s  /usr/local/bin/nodejs/bin/npm    /usr/local/bin/
```



## 2、yum

[更新源](https://blog.csdn.net/wade3015/article/details/94494929)

[更新源](https://blog.csdn.net/michel4liu/article/details/81782085)

# 4、linux命令

## 1、mv 

linux下重命名文件或文件夹的命令mv既可以重命名，又可以移动文件或文件夹.

例子：将目录A重命名为B

mv A B

例子：将/a目录移动到/b下，并重命名为c

mv /a /b/c

## 2、mkdir 

创建文件夹



## 3、touch 

创建文件



## 4、tar

解压 tar -xvf node-v11.0.0.tar.gz





## 1、获取管理员权限



```
su - root
```



## 2、修改用户密码

passwd 用户名



## 3、用户切换

1、普通用户切换到root用户：方法有多重:

　　1）su->回车->输入root密码

　　2）su -root->回车->输入root密码

2、root用户切换到普通用户:su "普通用户名"



# 5、其他

## 1、ftp

[ftp](https://blog.csdn.net/weixin_37554536/article/details/83892709)