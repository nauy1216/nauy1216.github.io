- https://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html

### js两种格式的模块
- 一种是 ES6 模块，简称 ESM；
- 另一种是 Node.js 专用的 CommonJS 模块，简称 CJS。

> 这两种模块不兼容。

### 两种模块的差异
- 语法上面，CommonJS 模块使用require()加载和module.exports输出，ES6 模块使用import和export。
- 用法上面，`require()是同步加载`，后面的代码必须等待这个命令执行完，才会执行。`import命令则是异步加载`，或者更准确地说，ES6 模块`有一个独立的静态解析阶段`，依赖关系的分析是在那个阶段完成的，最底层的模块第一个执行(有疑问？)。

### .mjs
- Node.js 要求 ES6 模块采用.mjs后缀文件名。也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。- Node.js 遇到.mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"。

如果不希望将后缀名改成.mjs，可以在项目的`package.json`文件中，指定type字段为module。
```js
{
   "type": "module"
}
```

一旦设置了以后，该目录里面的 JS 脚本，就被解释用 ES6 模块。
```shell
# 解释成 ES6 模块
$ node my-app.js
```

如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成.cjs。如果没有type字段，或者type字段为commonjs，则.js脚本会被解释成 CommonJS 模块。

> 总结为一句话：.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置。

> 注意，ES6 模块与 CommonJS 模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。


### CommonJS 模块加载 ES6 模块
CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。
```js
(async () => {
  await import('./my-app.mjs');
})();
```
上面代码可以在 CommonJS 模块中运行。

require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载。

### ES6 模块加载 CommonJS 模块
`ES6 `模块的`import`命令可以加载` CommonJS `模块，但是只能整体加载，不能只加载单一的输出项。

```js
// 正确
import packageMain from 'commonjs-package';

// 报错
import { method } from 'commonjs-package';
```

这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载。

加载单一的输出项，可以写成下面这样。

```js
import packageMain from 'commonjs-package';
const { method } = packageMain;
```

### 同时支持两种格式的模块
#### ESM支持CJS
如果原始模块是` ES6 `格式，那么需要给出一个整体输出接口，比如`export default obj`，使得` CommonJS `可以用`import()`进行加载。

#### CJS支持ESM
如果原始模块是 CommonJS 格式，那么可以加一个包装层。先整体输入 CommonJS 模块，然后再根据需要输出具名接口。
```js
import cjsModule from '../index.js';
export const foo = cjsModule.foo; 
```

你可以把这个文件的后缀名改为`.mjs`，或者将它放在一个子目录，再在这个子目录里面放一个单独的`package.json`文件，指明`{ type: "module" }`。

另一种做法是在package.json文件的exports字段，指明两种格式模块各自的加载入口。

```js
"exports"：{ 
    "require": "./index.js"，
    "import": "./esm/wrapper.js" 
}
```
上面代码指定require()和import，加载该模块会自动切换到不一样的入口文件。


### nodejs如何兼容ESM?

#### ESM和CJS不混合使用

#### ESM和CJS混合使用
- 使用后缀`.mjs`或者配置`"type": "module"`

