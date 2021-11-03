- https://segmentfault.com/a/1190000023820306
- https://juejin.cn/post/6844903450287800327
# 找到入口
```json
"main": "dist/rollup.js",
"module": "dist/es/rollup.js",
```

dist是打包后的文件，那么rollup是用什么打包的呢？
在项目的根目录下有一个`rollup.config.js`文件， 说明rollup是用rollup打包的。

查看`rollup.config.js`文件得知，入口是`src/node-entry.ts`。

# 调试方法
看github仓库有说明。
# rollup()
```ts
function rollup(rawInputOptions: GenericConfigObject): Promise<RollupBuild> 
```
- 接收一个rawInputOptions对象
- 返回一个promsie


# Graph.build()

# hook
1. resolveId
2. load