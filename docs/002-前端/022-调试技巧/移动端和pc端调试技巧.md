### 移动端
- https://github.com/wqlyy/inspect-webapp
### 1. 使用 Chrome inspect 调试手机Webview页面
手机webview和电脑上同步，像调试浏览器页面一样使用 devtools 调试手机页面
1. 用USB线连接手机和电脑
2. 手机开启开发者模式（不同品牌不同操作，用户可自行搜索）
3. 手机开启USB调试
4. PC上打开Chrome浏览器。进入chrome://inspect/#devices。正常情况下会看到对应的手机和页面信息。

> 附：Chrome 官方指导文档 https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc 

### 2. 抓包
- [Whistle](https://zhuanlan.zhihu.com/p/79037633)
- Wireshark - 网络数据包分析软件，网络协议栈的各个层的数据都可以很方便地查看。
- Termshark - 「终端版」的 Wireshark
- Charles - 一款老牌 HTTP/HTTPS 抓包调试工具
- Fiddler - 又一款免费的 Web 调试工具
- mitmproxy - 一款开源免费的交互式的 HTTPS 代理
### 3. 模拟器

### 4.vconsole/eruda

### 5.微信打开X5调试

### 6.weinre

### 7.UC 浏览器开发者版本

### 8.内网穿透
- frp（可自己搭建）
- ngrok


### 9. etc + 代理
- 使用代理，将网络代理到本机
- 本机通过配置etc将域名指向本地服务，如果是https的话需要webpack开启https，端口设置为443，http为80。

### 10. spy-debugger

### 11. https://blog.csdn.net/CamilleZJ/article/details/100080064

