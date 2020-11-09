### 在项目根路径下定义myPlugin.js

```js
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const chalk = require('chalk')

function Test() {

}

Test.prototype.apply = function(compiler) {
  compiler.hooks.beforeCompile.tap('beforeCompile', (compilation) => {
    console.log(compilation)
  })
}

module.exports = api => {
    // 修改webpack配置
    api.configureWebpack(webpackConfig => {
        return {
            mode:'development'
        }
    })
    // 注册新的命令
    api.registerCommand('play:build', args => {
        console.log(chalk.green('build start.'))
        debugger
        let compiler = webpack({
            mode: 'development', 
            devtool: 'inline-source-map',
            context: process.cwd(),
            entry: {
                app: [path.resolve(__dirname,'src/main.js')]
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name].js',
                chunkFilename: '[id].js'
            },
            plugins: [
                new Test()
            ]
        })
        compiler.run(err => {
            if (!err) {
                console.log(chalk.green('build success.'))
            }
        })
    })
}

module.exports.defaultModes = {
    'my-build': 'production'
}


```



### 使用

```json
// 在package.json中加入下面代码
  "vuePlugins": {
    "service":["myPlugin"]
  }
```

