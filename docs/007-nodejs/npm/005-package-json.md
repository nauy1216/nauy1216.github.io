- https://github.com/stereobooster/package.json#types
- https://www.baobangdong.cn/node.js-package.json-field-definitions/
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
"exports" 字段允许你通过引用自己的` package name（Self-referencing a package using its name）`来定义` package `的入口文件，举个例子：
```json
{
  "name": "pkg",
  "exports": {
    ".": "./main.mjs",
    "./foo": "./foo.js"
  }
}
```

以上可以被解读为：

```json
{
  "exports": {
    "pkg": "pkg/main.mjs",
    "pkg/foo": "pkg/foo.js"
  }
}

```



```js
import { something } from "pkg"; // from "pkg/main.mjs"
const { something } = require("pkg/foo"); // require("pkg/foo.js")
```

**它从 Node.js v12 开始被支持，并作为 `"main"` 字段的替代方案。**

他最大的一个特性就是 **条件导出（Conditional Exports）**，当该 package 被导入时，能够判断被导入时的模块环境，从而执行不同的文件，简而言之就是，我们如果使用 `import` 命令，入口会加载 ECMAScript Modules 文件，如果使用 `require` 命令，入口则加载 CommonJS Modules 文件。

```
├── mod
│   ├── mod.js
│   ├── mod.cjs
│   ├── package.json
│── app.js
└── app.mjs
```

mod 作为一个本地的 package，它的 package.json 定义如下：

```json
{
  "name": "mod",
  "main": "index.js",
  "type": "module",
  "exports": {
    "require": "./mod.cjs",
    "import": "./mod.js"
  }
}
```

使用时会根据环境引用不同的入口：

``` js
// 引入的是mod.cjs
const { name } = require("mod");

// 引入的是mod.js
import { name } from "mod";

```







# type

- 规定 package 下的 .js 文件被 Node.js 以 CommonJS Modules 或 ECMAScript Modules 加载
- ESM或者commonjs。