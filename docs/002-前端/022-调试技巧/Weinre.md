# 安装Weinre
```shell
npm i weinre -g
```

# 启动Weinre
```shell
weinre --httpPort 9090 --boundHost -all-
```
所有参数：
- boundHost:  -all-
- httpPort:  8081
- reuseAddr:  true
- readTimeout:  1
- deathTimeout: 5

# 浏览器访问http://localhost:9090

# 项目中注入脚本
```html
<script src="http://localhost:9090/target/target-script-min.js#anonymous"></script>
```
或者先输入地址，然后通过书签注入
```js
javascript:(function(e){e.setAttribute("src","http://localhost:9090/
target/target-script-min.js#anonymous");document.getElementsByTagName("body")[
0].appendChild(e);})(document.createElement("script"));void(0);
```