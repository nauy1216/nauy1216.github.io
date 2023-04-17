- [官网](https://wproxy.org/whistle/)
- [1](https://zhuanlan.zhihu.com/p/483975945?utm_id=0)
- [2](https://nohost.pro/)


# 常用的规则
```txt
# 调试面板
# t.cn inspect://eruda

# 注入代码
# t.cn jsPrepend://{test}

# 打印日志
# t.cn log://

# 设置响应内容
# t.cn resBody://{test}

# 解决跨域
# t.cn resCors://*

# 修改ua
# t.cn ua://{ua}

# 自定义请求样式
t.cn style://color=@fff&fontStyle=italic&bgColor=red

# 修改状态码
# t.cn statusCode://404

# 模拟超时
t.cn reqDelay://5000 enable://abort

# 自定义变量
# ``` varName
# /Users/你的用户名/Desktop/project
# ```


#### 
t.cn resBody://{test}

```

# 插件
## whistle.inspect

## whistle.vase