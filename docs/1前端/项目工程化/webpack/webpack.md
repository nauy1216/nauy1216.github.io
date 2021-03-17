[TOC]



# 1、初始化项目

执行**`npm init`** 生成**`package.json`**文件

```
npm init -y
```

进入你创建好的目录下（注意创建的目录名字不要和npm包的名字一样）， 执行上面的命令， 你会发现多了一个用于描述项目的json文件。

# 2、安装webpack

这里我使用的是本地安装， 你也可以安装在全局。

```
npm install --save-dev webpack
```

我安装的webpack版本是4.41.0。

# 3、安装webpack-cli

```
npm install webpack-cli --save-dev
```

我安装的webpack-cli版本是3.3.9。

# 4、准备好你的代码

创建  index.html

```html
<!doctype html>
<html>
  <head>
    <title>webpack-demo</title>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

创建  src/index.js

```js
function component() {
    var element = document.createElement('div');
    element.innerHTML = 'hello webpack';
    return element;
}
  
document.body.appendChild(component());
```

此时你的项目结构应该是这样的。

```diff
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```



在浏览器中打开  index.html, 你可以看到 “hello webpack”。但是好像并没有什么用， 到目前为止还没有使用到webpack。别急，我们继续改造代码。

在src/index.js中， 我们将component单独抽出来作为一个模块。

创建 src/component.js

```js
export default function component() {
    var element = document.createElement('div');
    element.innerHTML = 'hello webpack';
    return element;
}
```

修改 src/index.js

```
import component from 'componet.js'
document.body.appendChild(component());
```

然后你再刷新页面， 发现此时页面报错了，因为报了语法错误。但是我们写的代码并没有问题， 所以只能把我们的代码构建成浏览器能够识别的代码，这个时候就该webpack上场了！！！

# 5、配置webpack

在项目目录下创建 webpack.config.js 文件。

```js
const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

修改package.json， 增加 `"build": "webpack --config webpack.config.js"`。

由于在执行npm 命令时会临时将当前项目下的bin加入全去变量， 所以可以直接使用webpack 命令。

--config 表示webpack在构建时的配置文件。

```
  "scripts": {
    "build": "webpack --config webpack.config.js"
  }
```

修改index.html

```html
<!doctype html>
<html>
  <head>
    <title>webpack-demo</title>
  </head>
  <body>
    <script src="./dist/bundle.js"></script>
  </body>
</html>
```

刷新浏览器，此时代码运行正常。

到目前为止， 我们已经能够简单的使用webpack了， 是不是很开心^-^



# 6、管理资源

webapck本身是只能加载js模块的， 但是如果我们要加载css文件、图片、字体怎么办？别急， webapck有个叫loader的东西， 可以安装对应的loader来加载你想要加载的模块。

**加载css**

为了从 JavaScript 模块中 `import` 一个 CSS 文件，你需要在 [`module` 配置中](https://www.webpackjs.com/configuration/module) 安装并添加 [style-loader](https://www.webpackjs.com/loaders/style-loader) 和 [css-loader](https://www.webpackjs.com/loaders/css-loader)。

```
npm install --save-dev style-loader css-loader
```

安装好后， 还得在webpack.config.js里配置好呢， 要不webapck可不干了^-^

```js
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}
```

我们尝试下创建css/index.css

```css
.hello {
    background: red;
}
```

将css/index.css引入到component.js

```
require('./css/index.css')
module.exports =  function component() {
    var element = document.createElement('div');
    element.innerHTML = 'hello webpack';
    element.classList.add('hello')
    return element;
}
```

编译刷新后， 你就可以看到添加的样式了。



**加载图片**

```
npm install --save-dev file-loader
```

webapck.config.js 增加代码

```
{
    test: /\.(png|svg|jpg|gif)$/,
    use: [
        'file-loader'
    ]
}
```



**加载字体**

file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。

webapck.config.js 增加代码

```
{
    test: /\.(woff|woff2|eot|ttf|otf)$/, // 加载字体
    use: [
    	'file-loader'
    ]
}
```



**加载数据**

此外，可以加载的有用资源还有数据，如 JSON 文件，CSV、TSV 和 XML。类似于 NodeJS，JSON 支持实际上是内置的，也就是说 `import Data from './data.json'` 默认将正常运行。要导入 CSV、TSV 和 XML，你可以使用 [csv-loader](https://github.com/theplatapi/csv-loader) 和 [xml-loader](https://github.com/gisikw/xml-loader)。

```
{
    test: /\.(csv|tsv)$/,
    use: [
    'csv-loader'
    ]
},
{
    test: /\.xml$/,
    use: [
    'xml-loader'
    ]
}
```



# 7、管理输出

之前的内容都是只有一个打包输出bundle.js， 那如果要同时输出多个问件呢？

可以定义多个入口， 这样就会打包成几个文件了。

```
entry: { // 定义多个入口
    app: './src/index.js',
    component: './src/component.js'
},
output: {
    filename: '[name].bundle.js', // 此时输出的文件名应该也是动态的
    path: path.resolve(__dirname, 'dist')
},
```

修改之后， 删除dist文件夹再打包就会发现打包出了两个文件： app.bundle.js  和 component.bundle.js 。

但有个问题是， app.bundle.js  会包含 component.bundle.js 的代码。出现这样的结果是可以预料的，这里打包的两个入口时互不干扰的， 但是怎么解决这个问题呢？（这个问题， 我们后面再解决）



此时你一定会发现刷新浏览器之后，又报错了！！！

原来是没找到bundle.js文件， 原来是我们刚刚将输出文件改了个名字。改下index.html文件就好了。

但是， 如果每次输出的文件名都不一样， 那么每打包一次就要改一次代码。

那有解决的办法吗？

有，使用HtmlWebpackPlugin。



**使用 html-webpack-plugin插件**

安装html-webpack-plugin

```
npm install --save-dev html-webpack-plugin
```

使用插件

webpack.config.js

```
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
    new HtmlWebpackPlugin({
        template: './index.html' 
    })
]
```

使用webpack插件要在plugins下增加一个插件实例。

 HtmlWebpackPlugin接受的参数：

template： html模板的路径,。

构建完成后将在dist下生成一个新的index.html文件， 并且生成的js文件也被引入到body里面了。



**使用clean-webpack-plugin 插件**

在经过多次打包后， 是时候清理 `/dist` 文件夹下的旧文件啦！

webpack 会生成文件，然后将这些文件放置在 `/dist` 文件夹中，但是 webpack 无法追踪到哪些文件是实际在项目中用到的。通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法，因此只会生成用到的文件。让我们完成这个需求。

```
npm install clean-webpack-plugin --save-dev
```

webpack.config.js

```
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin 

plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
    	template: './index.html'
    })
]
```



> 你可能会感兴趣，webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。如果你对通过其他方式来管理 webpack 的[输出](https://www.webpackjs.com/configuration/output)更感兴趣，那么首先了解 manifest 是个好的开始。
>
> 通过使用 [`WebpackManifestPlugin`](https://github.com/danethurber/webpack-manifest-plugin)，可以直接将数据提取到一个 json 文件，以供使用。

到此为止我们已经学会了怎么使用webpack了， 是不是觉得很简单^-^。



# 8、开发

每次修改代码后都得执行npm run build， 然后再刷新浏览器， 这显然很麻烦。

webpack 中有几个不同的选择，可以帮助你在代码发生变化后自动编译代码：

1. webpack's Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware

多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨学习下上面的不同方案。

## 8.1、webpack's Watch Mod

你可以指示 webpack "watch" 依赖图中的所有文件以进行更改。如果其中一个文件被更新，代码将被重新编译，所以你不必手动运行整个构建。

我们添加一个用于启动 webpack 的观察模式的 npm script 脚本：

```json
"scripts": {
    "watch": "webpack --watch",
    "build": "webpack"
},
```

其实很简单， 就是在脚本命令上加 --watch 选项。这样每次你修改代码保存是就会重新编译， 但浏览器还是得刷新（应该有热重载的插件吧^-^）



## 8.2、webpack-dev-server

`webpack-dev-server` 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。

```bash
npm install --save-dev webpack-dev-server
```

修改webpack.config.js

```
devServer: {
	port: 8888,
    contentBase: '/dist'// 告诉服务器从哪里查找文件
}
```

以上配置告知 `webpack-dev-server`，在 `localhost:8888` 下建立服务，将 `dist` 目录下的文件，作为可访问文件。

让我们添加一个 script 脚本，可以直接运行开发服务器：

```
"start": "webpack-dev-server --open --config webpack.config.js"
```

启动服务后，访问localhost:8888， 修改代码可以看到页面内容已经自动刷新了。



> 这种方式的刷新是全量刷新的。



## 8.3、webpack-dev-middleware

`webpack-dev-middleware` 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 `webpack-dev-server` 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求。接下来是一个 webpack-dev-middleware 配合 express server 的示例。



> Vue ssr(服务器端渲染就是使用的这个插件)



首先，安装 `express` 和 `webpack-dev-middleware`：

```
npm install --save-dev express webpack-dev-middleware
```



创建server.js

```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.listen(3000, function () {
  console.log('服务已启动，访问地址： localhost:3000!\n');
});
```



修改webpack.config.js

设置publicPath: '/'， 启动的服务才能正确访问文件资源。设置publicPath的值会影响index.html内引入js的路径。

```json
output: {
    filename: '[name].bundle.js', // 此时输出的文件名应该也是动态的
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
}
```



执行 `node server` 启动服务。

当然你也可以创建一个npm script。

```
"server": "node server"
```

> 注意： 使用这种方式虽然会实时编译代码， 但是不会实时刷新页面。
>
> 因为没有使用热替换。可以使用  [`webpack-hot-middleware`](https://github.com/webpack-contrib/webpack-hot-middleware) 。





# 9、模块热替换

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。

修改webpack.config.js

```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin 
const webpack = require('webpack');

module.exports = {
    mode: 'development', // 设置为'development' 后代码不会压缩
    devtool: 'inline-source-map',
    entry: { // 定义多个入口
        app: './src/index.js',
        // component: './src/component.js' // 避免影响效果， 只输出一个文件
    },
    output: {
        filename: '[name].bundle.js', // 此时输出的文件名应该也是动态的
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' // 设置的值会影响index.html内引入js的路径
    },
    devServer: {
        port: 8888,
        contentBase: '/dist',// 告诉服务器从哪里查找文件
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 加载样式文件
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/, // 加载图片
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // 加载字体
                use: [
                'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                'xml-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.NamedModulesPlugin(), // 新增
        new webpack.HotModuleReplacementPlugin()// 新增
    ]
}
```



修改index.js

如果是全量刷新则会触发onload事件， 以此来判断是否是热替换。

```
const component = require('./component.js')
document.body.appendChild(component());
window.onload = function() {
    console.log('=====页面全量刷新啦======')
}
if (module.hot) {
  module.hot.accept('./component.js', function() {
    console.log('更新了 componnet 模块');
  })
}
```



重启服务。 发现修改componet文件及其依赖均不会导致全量刷新， 而修改index.js则会导致全量刷新。



# 10、tree shaking

*tree shaking* 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的[静态结构特性](http://exploringjs.com/es6/ch_modules.html#static-module-structure)，例如 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)。这个术语和概念实际上是兴起于 ES2015 模块打包工具 [rollup](https://github.com/rollup/rollup)。



# 11、生产环境构建

> *开发环境(development)*和*生产环境(production)*的构建目标差异很大。在*开发环境*中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在*生产环境*中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写**彼此独立的 webpack 配置**。

因此考虑将`webpack.config.js`拆分为不同的文件：

`webpack.common.js`:   生产环境和开发环境的公共配置。

`webpack.dev.js`: 开发环境配置

`webpack.prod.js`： 生产环境配置

`webpack.watch.js`:  用于测试watch的配置



安装webpack-merge插件, 用于合并配置对象。

```shell
npm install --save-dev webpack-merge
```



安装uglifyjs-webpack-plugin插件， 用于生产环境压缩代码。

```
npm i -D uglifyjs-webpack-plugin
```



`webpack.common.js`

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: { // 定义多个入口
        app: './src/index.js',
        // component: './src/component.js'
    },
    output: {
        filename: '[name].bundle.js', // 此时输出的文件名应该也是动态的
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/' // 设置的值会影响index.html内引入js的路径
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 加载样式文件
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/, // 加载图片
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // 加载字体
                use: [
                'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                'xml-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
}
```



`webpack.dev.js`

```js
const webpack = require('webpack');
const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common')

console.log('webpack.dev.js')
const config = webpackMerge(webpackCommonConfig, 
{
    mode: 'development', // 设置为'development' 后代码不会压缩
    devtool: 'inline-source-map',
    devServer: {
        port: 8888,
        contentBase: '/dist',// 告诉服务器从哪里查找文件
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
})
module.exports = config
```



`webpack.prod.js`

```
const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin 

console.log('webpack.prod.js')
module.exports = webpackMerge(webpackCommonConfig, {
    mode: 'production', // 设置为'development' 后代码不会压缩
    plugins: [
        new CleanWebpackPlugin()
    ]
})
```





> 现在打包后的css和js混合在了一起， 如何让css单独打包成一个文件呢？

`extract-text-webpack-plugin`

它会将所有的入口 chunk(entry chunks)中引用的 `*.css`，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 `styles.css`）当中。 如果你的样式文件大小较大，这会做更快提前加载，*<u>因为 CSS bundle 会跟 JS bundle 并行加载</u>*。

```
npm install --save-dev extract-text-webpack-plugin
```

npm run build 后发现报错， `UnhandledPromiseRejectionWarning: Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead`

**原因：**
extract-text-webpack-plugin还不能支持webpack4.0.0以上的版本。

解决办法： 

```
npm install extract-text-webpack-plugin@next -D
```



重新打包之后， 发现多了一个styles.css文件。





# 12、增加静态资源服务器

在生产环境构建打包后时， 由于设置了publicPath， 将不能直接在本地运行应用， 所以决定通过启动服务来访问。

安装 cross-env

```
npm install --save-dev cross-env
```

创建server/static-server.js

```
const express = require('express')
const path = require('path')
const app = express()
console.log('process.env.publicPath',process.env.publicPath)
app.use(express.static(path.resolve(__dirname, '../dist')))

app.listen(8001, () => {
    console.log('服务已启动，访问地址： localhost:8001!\n');
})

```

修改package.json

```
"test:prod": "cross-env publicPath=aaa  npm run build && node ./server/static-server"
```

执行 npm   run  test:prod  将会先打包然后启动一个静态资源服务。



# 13、代码分离

代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

有三种常用的代码分离方法：

- 入口起点：使用 [`entry`](https://www.webpackjs.com/configuration/entry-context) 配置手动地分离代码。
- 防止重复：使用 [`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。



## 13.1、入口起点

通过设置多个入口打包成多个文件来达到代码分离的效果。

```
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
```

这种方法存在一些问题:

- 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

## 13.2、防止重复

起初，chunks(代码块)和导入他们中的模块通过webpack内部的父子关系图连接.在webpack3中，通过CommonsChunkPlugin来避免他们之间的依赖重复。而在webpack4中CommonsChunkPlugin被移除，取而代之的是 optimization.splitChunks 和 optimization.runtimeChunk 配置项，下面展示它们将如何工作。



webpack将根据以下条件自动拆分代码块：

- 会被共享的代码块或者 node_mudules 文件夹中的代码块
- 体积大于30KB的代码块（在gz压缩前）
- 按需加载代码块时的并行请求数量不超过5个
- 加载初始页面时的并行请求数量不超过3个



> SplitChunksPlugin的默认配置

```
   splitChunks: {
        chunks: "async",
        minSize: 30000, // 模块的最小体积
        minChunks: 1, // 模块的最小被引用次数
        maxAsyncRequests: 5, // 按需加载的最大并行请求数
        maxInitialRequests: 3, // 一个入口最大并行请求数
        automaticNameDelimiter: '~', // 文件名的连接符
        name: true,
        cacheGroups: { // 缓存组
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
```

缓存组因该是SplitChunksPlugin中最有趣的功能了。在默认设置中，会将 node_mudules 文件夹中的模块打包进一个叫 vendors的bundle中，所有引用超过两次的模块分配到 default bundle 中。更可以通过 priority 来设置优先级。



## 13.3、动态导入

当涉及到动态代码拆分时，webpack 提供了两个类似的技术。对于动态导入，第一种，也是优先选择的方式是，使用符合 [ECMAScript 提案](https://github.com/tc39/proposal-dynamic-import) 的 [`import()` 语法](https://www.webpackjs.com/api/module-methods#import-)。第二种，则是使用 webpack 特定的 [`require.ensure`](https://www.webpackjs.com/api/module-methods#require-ensure)。

> 注意/* webpackChunkName: "lodashName" */是必不可少的。lodashName是打包输出后的文件名。

```
import(/* webpackChunkName: "lodashName" */ 'lodash')
```



> 动态导入实现懒加载



# 14、缓存

浏览器使用一种名为 [缓存](https://searchstorage.techtarget.com/definition/cache) 的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然而，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手。

## 14.1、输出文件的文件名

通过使用 `output.filename` 进行[文件名替换](https://www.webpackjs.com/configuration/output#output-filename)，可以确保浏览器获取到修改后的文件。`[hash]` 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 `[chunkhash]` 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。

```
output: {
    filename: '[name].[chunkhash].js', // 此时输出的文件名应该也是动态的
    chunkFilename: '[name].[chunkhash].js', // 在代码切割时，它决定非入口 chunk 的名称
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/' // 设置的值会影响index.html内引入js的径
}
```

输出时使用hash 或 chunkhash,使用hash时每个文件的hash值都一样， 使用chunkhash时，每个文件都有自己的hash值。



## 14.2、提取样板代码

样板(boilerplate)，指 webpack 运行时的引导代码，特别是 runtime 和 manifest。

webpack已废弃[`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 。

```
optimization: {
    runtimeChunk: {
    	name: "manifest"
    }
}
```



## 14.3、模块标识符

在每次npm run build后所有文件的hash都会变化。这是因为每个 [`module.id`](https://www.webpackjs.com/api/module-variables#module-id-commonjs-) 会基于默认的解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。因此，简要概括：

- `main` bundle 会随着自身的新增内容的修改，而发生变化（也就是我们这里的app.js）。
- `vendor` bundle 会随着自身的 `module.id` 的修改，而发生变化。
- `manifest` bundle 会因为当前包含一个新模块的引用，而发生变化。

第一个和最后一个都是符合预期的行为 -- 而 `vendor` 的 hash 发生变化是我们要修复的。幸运的是，可以使用两个插件来解决这个问题。第一个插件是 [`NamedModulesPlugin`](https://www.webpackjs.com/plugins/named-modules-plugin)，将使用模块的路径，而不是数字标识符。虽然此插件有助于在开发过程中输出结果的可读性，然而执行时间会长一些。第二个选择是使用 [`HashedModuleIdsPlugin`](https://www.webpackjs.com/plugins/hashed-module-ids-plugin)，推荐用于生产环境构建：

```
new webpack.HashedModuleIdsPlugin()
```

使用插件后你会发现每次打包后hash不会再变化。



# 15、创建 library



除了打包应用程序代码，webpack 还可以用于打包 JavaScript library（生成自己的可用于浏览器使用的模块，比如umd）。



# 16、shimming

`webpack` 编译器(compiler)能够识别遵循 ES2015 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(library)可能会引用一些全局依赖（例如 `jQuery` 中的 `$`）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 *shimming* 发挥作用的地方。

## 16.1、shimming 全局变量

修改webpack配置：

```
new webpack.ProvidePlugin({
    _: 'lodash'
})
```

安装 lodash

```
npm i lodash -D
```

> 配置 _  为全局变量后， 就可以在任何地方使用 _  了。

出于演示的目的，让我们把这个模块作为我们应用程序中的一个全局变量。要实现这些，我们需要使用 `ProvidePlugin` 插件。使用 [`ProvidePlugin`](https://www.webpackjs.com/plugins/provide-plugin) 后，能够在通过 webpack 编译的每个模块中，通过访问一个变量来获取到 package 包。如果 webpack 知道这个变量在某个模块中被使用了，那么 webpack 将在最终 bundle 中引入我们给定的 package。



本质上，我们所做的，就是告诉 webpack……

> 如果你遇到了至少一处用到 `lodash` 变量的模块实例，那请你将 `lodash` package 包引入进来，并将其提供给需要用到它的模块。



但是在使用lodash时可能只是使用了某一部分导出，因此可以做按需打包的处理。这样就能很好的与 [tree shaking](https://www.webpackjs.com/guides/tree-shaking) 配合，将 `lodash` 库中的其他没用到的部分去除。



## 16.2、细粒度 shimming



## 16.3、全局 exports



## 16.4、加载 polyfills



# 17、渐进式网络应用程序

渐进式网络应用程序(Progressive Web Application - PWA)，是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在**离线(offline)**时应用程序能够继续运行功能。这是通过使用名为 [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/) 的网络技术来实现的。



添加 workbox-webpack-plugin 插件，并调整 `webpack`配置 文件：

```
npm install workbox-webpack-plugin --save-dev
```



```
new WorkboxPlugin.GenerateSW({
    // 这些选项帮助 ServiceWorkers 快速启用
    // 不允许遗留任何“旧的” ServiceWorkers
    clientsClaim: true,
    skipWaiting: true
})
```



index.js

```
/**
 * 注册我们的 Service Worker
 * 运行 npm run test:prod， 访问8001， 关闭服务器刷新页面，即可看到效果。
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
```

