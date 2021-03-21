[TOC]

# 1、babel是什么？

> Babel 是一个 JavaScript 编译器

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 [@babel/polyfill](https://www.babeljs.cn/docs/babel-polyfill) 模块)
- 源码转换 (codemods)
- 更多...

# 2、创建项目

初始化项目

```
npm init -y
```



安装babel所需的包

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```



在项目的根目录下创建一个命名为 `babel.config.js` 的配置文件，其内容为：

```
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
```



创建src/index.js文件

```
const getTime = () => new Date().toLocaleString()
```



修改package.json

下面的命令表示把src下的文件编译后输出到lib文件夹。

```
"babel": "babel src  --out-dir lib"
```



运行 npm run babel, 发现多了一个lib文件。

编译后的index.js就在里面

```
"use strict";

const getTime = () => new Date().toLocaleString();
```

发现es6的箭头函数并没有编译成es5的语法， 这是因为babel还未配置的缘故。



> 解决上面没有编译成es5代码其实很简单。修改babel.config.js。
>
> ```
> targets: {
>     node: 4
>     //   edge: "17",
>     //   firefox: "60",
>     //   chrome: "67",
>     //   safari: "11.1",
> }
> ```



# 3、babel起步



你所需要的所有的 Babel 模块都是作为独立的 npm 包发布的，并且（从版本 7 开始）都是以 `@babel` 作为冠名的。这种模块化的设计能够让每种工具都针对特定使用情况进行设计。

## 3.1、@babel/core

Babel 的核心功能包含在 [@babel/core](https://www.babeljs.cn/docs/babel-core) 模块中。



## 3.2、@babel/cli

[@babel/cli](https://www.babeljs.cn/docs/babel-cli) 是一个能够从终端（命令行）使用的工具

```
npm install --save-dev @babel/core @babel/cli

./node_modules/.bin/babel src --out-dir lib
```



这将解析 `src` 目录下的所有 JavaScript 文件，并应用我们所指定的代码转换功能，然后把每个文件输出到 `lib` 目录下。由于我们还没有指定任何代码转换功能，所以输出的代码将与输入的代码相同（不保留原代码格式）。我们可以将我们所需要的代码转换功能作为参数传递进去。

上面的示例中我们使用了 `--out-dir` 参数。你可以通过 `--help` 参数来查看命令行工具所能接受的所有参数列表。但是现在对我们来说最重要的是 `--plugins` 和 `--presets` 这两个参数。



### 3.2.1、插件和预设（preset）

> 代码转换功能以插件的形式出现，插件是小型的 JavaScript 程序，用于指导 Babel 如何对代码进行转换。你甚至可以编写自己的插件将你所需要的任何代码转换功能应用到你的代码上。



#### 3.2.1.1 plugins

例如将 ES2015+ 语法转换为 ES5 语法，我们可以使用诸如 `@babel/plugin-transform-arrow-functions` 之类的官方插件：

```
npm install --save-dev @babel/plugin-transform-arrow-functions
```

修改package.json

```
"babel": "babel src  --out-dir lib --plugins=@babel/plugin-transform-arrow-functions"
```

重新执行 npm run babel ,  重新编译后的index.js为。

```
"use strict";

const getTime = function getTime() {
  return new Date().toLocaleString();
};
```



使用了`@babel/plugin-transform-arrow-functions`插件后箭头函数被编译成了es5的语法。



这是个好的开始！！！

但是编译后的代码依然会残余其他的 ES2015+ 的特性，我们希望对它们也进行转换。我们不需要一个接一个地添加所有需要的插件，我们可以使用一个 "preset" （即一组预先设定的插件）。



#### 3.2.1.2 preset

> preset(预设)
>
> 你可以理解为预先配置好的一系列插件的集合，而不需要你一个一个的去配置。



就像插件一样，你也可以根据自己所需要的插件组合创建一个自己的 preset 并将其分享出去。J对于当前的用例而言，我们可以使用一个名称为 `env` 的 preset。

```
npm install --save-dev @babel/preset-env
```

修改package.json

```
"babel": "babel src  --out-dir lib --presets=@babel/env"
```

修改src/index.js

```
const getTime = () => new Date().toLocaleString()

class Test {
    constructor() {
        this.printTime()
    }

    printTime() {
        const time = getTime()
        console.log(time)
    }
}
```

重新编译后， 你会发现class语法也被编译成了es5的语法。

## 3.3、@babel/preset-env

在上面已经了解到这是一系列插件的预设。

## 3.4、@babel/polyfill

[@babel/polyfill](https://www.babeljs.cn/docs/babel-polyfill) 模块包括 [core-js](https://github.com/zloirock/core-js) 和一个自定义的 [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) 模块用于模拟完整的 ES2015+ 环境。

这意味着你可以使用诸如 `Promise` 和 `WeakMap` 之类的新的内置组件、 `Array.from` 或 `Object.assign` 之类的静态方法、 `Array.prototype.includes` 之类的实例方法以及生成器函数（generator functions）（前提是你使用了 [regenerator](https://www.babeljs.cn/docs/babel-plugin-transform-regenerator) 插件）。**<u>为了添加这些功能，polyfill 将添加到全局范围（global scope）和类似 `String` 这样的内置原型（native prototypes）中。</u>**



对于软件库/工具的作者来说，这可能太多了。如果你不需要类似 `Array.prototype.includes` 的实例方法，可以使用 [transform runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime) 插件而不是对全局范围（global scope）造成污染的 `@babel/polyfill`。

> 注意，使用 `--save` 参数而不是 `--save-dev`，因为这是一个需要在你的源码之前运行的 polyfill。

```
npm install --save @babel/polyfill
```



幸运的是，我们所使用的 `env` preset 提供了一个 `"useBuiltIns"` 参数，当此参数设置为 `"usage"` 时，就会加载上面所提到的最后一个优化措施，也就是只包含你所需要的 polyfill。

```
useBuiltIns: "usage"
```



> 总结
>
> 我们使用 `@babel/cli` 从终端运行 Babel，利用 `@babel/polyfill` 来模拟所有新的 JavaScript 功能，而 `env`preset 只对我们所使用的并且目标浏览器中缺失的功能进行代码转换和加载 polyfill。



> 引用别人的一段理解：解释的很好
> babel 编译过程处理第一种情况 - 统一语法的形态，通常是高版本语法编译成低版本的，比如 ES6 语法编译成 ES5 或 ES3。而 babel-polyfill 处理第二种情况 - 让目标浏览器支持所有特性，不管它是全局的，还是原型的，或是其它。这样，通过 babel-polyfill，不同浏览器在特性支持上就站到同一起跑线。
>
> polyfill我们又称垫片，见名知意，所谓垫片也就是垫平不同浏览器或者不同环境下的差异，因为有的环境支持这个函数，有的环境不支持这种函数，解决的是有与没有的问题，这个是靠单纯的@babel/preset-env不能解决的，因为@babel/preset-env解决的是将高版本写法转化成低版本写法的问题，因为不同环境下低版本的写法有可能不同而已。



> 我的理解：
>
> 插件： 负责语法的转换。
>
> polyfill:   为不支持某种特性的构建目标提供功能支持。比如说在低版本的IE浏览器中不支持String.prototype.padStart,  所以不能使用'abc'.padStart(10, '*')。但是引入@babel/polfill就可以解决这个问题。
>
> 插件的作用是语法转换， 而polfill是功能的增强。



## 3.5、@babel/node

babel-node 工具提供了一个支持 ES6 的 REPL 交互式运行环境。在此环境中，我们可以做一些简单的代码调试。

babel-node 是 babel-cli 的附带工具，所以只要安装了 babel-cli ，就可以直接使用 babel-node 啦。



自己经常在本地写一些 js 脚本进行文件处理等工作，常常会使用 import 语法引入模块。但是 Node 在默认情况下是不支持 import 和 export 的。但是如果使用babel-node的话就可以成功运行。



> 由于性能问题，babel-node 仅限于在本地调试时使用，上线生产环境的代码还是需要使用 babel 进行转换，再使用 node 运行。



## 3.6、@babel/runtime

@babel/runtime的作用是提供统一的模块化的helper。

> 那什么是helper？ 

我们举个例子：我们编译之后的index.js代码里面有不少新增加的函数，如classCallCheck，defineProperties，createClass，这种函数就是helper。

> 那这种helper跟我们的@babel/runtime有什么关系？

我们接着看，比如像这个createClass就是我们将es6的class关键字转化成传统js时生成的一个函数，那么如果我有很多个js文件中都定义了class类，那么在编译转化时就会产生大量相同的createClass方法，那这些_createClass这样的helper方法是不是冗余太多，因为它们基本都是一样的，所以我们能不能采用一个统一的方式提供这种helper，也就是利用es或者node的模块化的方式提供helper，将这些helper做成一个模块来引入到代码中，岂不是可以减少这些helper函数的重复书写。



```
npm i @babel/runtime -S
```



## 3.7、@babel/plugin-transform-runtime

这个包的作用其实就是辅助@babel/runtime的，因为有了@babel/plugin-transform-runtime它会帮我自动动态require @babel/runtime中的内容，如果没有这个@babel/plugin-transform-runtime，那么我们要使用@babel/runtime中的内容，就只有像require('@babel/polyfill')那样人工去手动添加了，所以@babel/plugin-transform-runtime非常方便，由于@babel/plugin-transform-runtime是一个插件，所以它是需要配置到babel.config.js中的，这一点要记住。

```
npm i @babel/plugin-transform-runtime -S
```

```
"plugins": [
	"@babel/plugin-transform-runtime"
]
```



设置`plugin-transform-runtime`插件前编译成的代码：

```
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var getTime = function getTime() {
  return new Date().toLocaleString();
};

var Test =
/*#__PURE__*/
function () {
  function Test() {
    _classCallCheck(this, Test);

    this.printTime();
  }

  _createClass(Test, [{
    key: "printTime",
    value: function printTime() {
      var time = getTime();
      console.log(time);
    }
  }]);

  return Test;
}();
```



设置`plugin-transform-runtime`插件后编译成的代码：

```
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var getTime = function getTime() {
  return new Date().toLocaleString();
};

var Test =
/*#__PURE__*/
function () {
  function Test() {
    (0, _classCallCheck2.default)(this, Test);
    this.printTime();
  }

  (0, _createClass2.default)(Test, [{
    key: "printTime",
    value: function printTime() {
      var time = getTime();
      console.log(time);
    }
  }]);
  return Test;
}();
```



> 总结
>
> 不使用plugin-transform-runtime会在每个文件中注入大量的类似_classCallCheck的helper代码， 使用后会以模块的形式引入helper代码。



## 3.8、@babel/plugin-transform-***

类似于@babel/plugin-transform-arrow-functions的插件， 这里就不一一说了。



# 4、配置

如果不进行任何配置，上述 preset 所包含的插件将支持所有最新的 JavaScript （ES2015、ES2016 等）特性。但是 preset 也是支持参数的。我们来看看另一种传递参数的方法：配置文件，而不是通过终端控制台同时传递 cli 和 preset 的参数。



> 根据你的需要，可以通过几种不同的方式来使用配置文件。另外，请务必阅读我们关于如何 [配置 Babel](https://www.babeljs.cn/docs/configuration)的深入指南以了解更多信息。



```
console.log('babel.config.js')
module.exports = { 
    presets: [
        [
          "@babel/preset-env",
          {
            targets: {
                ie: "9",
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: "usage",
          },
        ],
    ],
    plugins: [
        // "@babel/plugin-syntax-dynamic-import",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        "@babel/plugin-transform-runtime"
    ]
};
```



# 5、plugins

Babel 是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。

现在，Babel 虽然开箱即用，但是什么动作都不做。它基本上类似于 `const babel = code => code;` ，将代码解析之后再输出同样的代码。如果想要 Babel 做一些实际的工作，就需要为其添加插件。

除了一个一个的添加插件，你还可以以 [preset](https://www.babeljs.cn/docs/presets) 的形式启用一组插件。



## 5.1、转换插件

这些插件用于转换你的代码。

> 转换插件将启用相应的语法插件，因此你不必同时指定这两种插件。



## 5.2、语法插件

这些插件只允许 Babel **解析（parse）** 特定类型的语法（而不是转换）。

> 注意：转换插件会自动启用语法插件。因此，如果你已经使用了相应的转换插件，则不需要指定语法插件。



## 5.3、插件/Preset 路径

如果插件再 npm 上，你可以输入插件的名称，babel 会自动检查它是否已经被安装到 `node_modules` 目录下

```json
{
  "plugins": ["babel-plugin-myPlugin"]
}

Copy
```

你还可以指定插件的相对/绝对路径。

```json
{
  "plugins": ["./node_modules/asdf/plugin"]
}
```



## 5.4、插件的短名称

如果插件名称的前缀为 `babel-plugin-`，你还可以使用它的短名称：

```js
{
  "plugins": [
    "myPlugin",
    "babel-plugin-myPlugin" // 两个插件实际是同一个
  ]
}

Copy
```

这也适用于带有冠名（scope）的插件：

```js
{
  "plugins": [
    "@org/babel-plugin-name",
    "@org/name" // 两个插件实际是同一个
  ]
}
```



## 5.5、插件顺序

> 插件的排列顺序很重要。

这意味着如果两个转换插件都将处理“程序（Program）”的某个代码片段，则将根据转换插件或 preset 的排列顺序依次执行。

- 插件在 Presets 前运行。
- 插件顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。

例如：

```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}

Copy
```

先执行 `transform-decorators-legacy` ，在执行 `transform-class-properties`。

重要的时，preset 的顺序是 *颠倒的*。如下设置：

```json
{
  "presets": ["es2015", "react", "stage-2"]
}

Copy
```

将按如下顺序执行：`stage-2`、`react` 然后是 `es2015`。

这主要的是为了确保向后兼容，因为大多数用户将 "es2015" 排在 "stage-0" 之前。有关详细信息，请参阅 [notes on potential traversal API changes](https://github.com/babel/notes/blob/master/2016/2016-08/august-01.md#potential-api-changes-for-traversal)。



## 5.6、插件参数

插件和 preset 都可以接受参数，参数由插件名和参数对象组成一个数组，可以在配置文件中设置。

如果不指定参数，下面这几种形式都是一样的：

```json
{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}

Copy
```

要指定参数，请传递一个以参数名作为键（key）的对象。

```json
{
  "plugins": [
    [
      "transform-async-to-module-method",
      {
        "module": "bluebird",
        "method": "coroutine"
      }
    ]
  ]
}

Copy
```

preset 的设置参数的工作原理完全相同：

```json
{
  "presets": [
    [
      "env",
      {
        "loose": true,
        "modules": false
      }
    ]
  ]
}
```



## 5.7、插件开发



# 6、preset

不想自己动手组合插件？没问题！preset 可以作为 Babel 插件的组合，甚至可以作为可以共享的 [`options`](https://www.babeljs.cn/docs/options) 配置。

## 6.1、官方 Preset

- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
- [@babel/preset-flow](https://www.babeljs.cn/docs/babel-preset-flow)
- [@babel/preset-react](https://www.babeljs.cn/docs/babel-preset-react)
- [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)



## 6.2、创建 Preset

如需创建一个自己的 preset，只需导出一份配置即可。

> 可以是返回一个插件数组...

```js
module.exports = function() {
  return {
    plugins: [
      "pluginA",
      "pluginB",
      "pluginC",
    ]
  };
}
```

> preset 可以包含其他的 preset，以及带有参数的插件。

```js
module.exports = () => ({
  presets: [
    require("@babel/preset-env"),
  ],
  plugins: [
    [require("@babel/plugin-proposal-class-properties"), { loose: true }],
    require("@babel/plugin-proposal-object-rest-spread"),
  ],
});
```



## 6.3、Preset 的路径

如果 preset 在 npm 上，你可以输入 preset 的名称，babel 将检查是否已经将其安装到 `node_modules` 目录下了

```json
{
  "presets": ["babel-preset-myPreset"]
}

Copy
```

你还可以指定指向 preset 的绝对或相对路径。

```json
{
  "presets": ["./myProject/myPreset"]
}
```



## 6.4、Preset 的短名称

如果 preset 名称的前缀为 `babel-preset-`，你还可以使用它的短名称：

```js
{
  "presets": [
    "myPreset",
    "babel-preset-myPreset" // equivalent
  ]
}

Copy
```

这也适用于带有冠名（scope）的 preset：

```js
{
  "presets": [
    "@org/babel-preset-name",
    "@org/name" // equivalent
  ]
}
```



## 6.5、Preset 的参数

插件和 preset 都可以接受参数，参数由插件名和参数对象组成一个数组，可以在配置文件中设置。

如果不指定参数，下面这几种形式都是一样的：

```json
{
  "presets": [
    "presetA",
    ["presetA"],
    ["presetA", {}],
  ]
}

Copy
```

要指定参数，请传递一个以参数名作为键（key）的对象。

```json
{
  "presets": [
    ["@babel/preset-env", {
      "loose": true,
      "modules": false
    }]
  ]
}
```