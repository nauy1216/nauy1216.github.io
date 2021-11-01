- https://github.com/stereobooster/package.json#types
# main
项目的主入口文件。
```js
{
  "main": "filename.js"
}
```
# module

# types
```json
{
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```
- 定义typescript的声明文件入口
- 使用typings具有一样的效果
- 如果入口是`index.js`，类型声明文件是`index.d.ts`的话可以不定义`types`字段。

# sideEffects
- https://juejin.cn/post/6844903640533041159
- https://libin1991.github.io/2019/05/01/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3sideEffects%E9%85%8D%E7%BD%AE/
- https://blog.csdn.net/u012961419/article/details/107094056


# bin
命令行的入口文件。
```json
{
  "bin": "bin.js",
  "bin": {
    "command-name": "bin/command-name.js",
    "other-command": "bin/other-command"
  }
}
```


# exports


# type
用于指定模块的类型。ESM或者commonjs。