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