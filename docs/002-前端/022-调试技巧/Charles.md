- https://zhuanlan.zhihu.com/p/140942687
- https://blog.csdn.net/luotuofeile/article/details/83988223
- https://www.jianshu.com/p/54cd3d722509
- https://cloud.tencent.com/developer/article/1473768

- https://zhuanlan.zhihu.com/p/26182135

# 注意事项

- 记得关闭系统使用的其他代理， 避免冲突， 导致charles失效。
- 打开Proxy -> macos Proxy

# 如何通过Charles用线上域名访问PC本地项目

- https://blog.csdn.net/ZD717822023/article/details/94602431

- 先开启本地服务，

- 打开Charles，点击 Tools > Map Remote，在弹出窗里点击add添加一条重定向规则

  > 如果远程是https协议本地也是https协议的话需要将本地的https端口设置为443。
  > 如果你的域名还未备案记得etc也必须设置，否则charles会报`UnknownHost: ***.***.cn`

> 思考：
> 这种方式与直接使用webpack-dev-server的证书有什么区别？
> webpack-dev-server的证书没在本机进行证书信任所以在企业微信内是用不了的
> 解决办法是，用charles进行代理，设置charles的证书为本机信任的证书，
> 然后设置Map Remote将域名映射到本地。当然你也可以自己生成ssl证书然后设置信任证书，
> 再将证书给webpack-dev-server使用，但这种方式比较麻烦。

