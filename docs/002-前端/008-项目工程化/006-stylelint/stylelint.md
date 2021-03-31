 

### 1、安装stylelint

stylelint是现在最强大的css代码审查工具，由PostCSS提供技术支持。虽然CSS是一种另类的编程语言，通常并不会影响网页的正常运行，但是作为有尊严的前端程序员还是应该注重CSS的书写规范，增强代码可读性。为了方便开发者使用，stylelint社区提供了命令行、打包工具和编辑器上的插件。

这里除了安装了 stylelint 自身外，还安装了一个 stylelint-order 插件。该插件的作用是强制你按照某个顺序编写 css。例如先写定位，再写盒模型，再写内容区样式，最后写 CSS3 相关属性。

```
yarn add stylelint stylelint-order -D
```



### 2、安装配置规则

官方提供了stylelint-config-recommended和stylelint-config-standard两种css标准：

-  [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended) 包含可能报错的rule，code format的css标准
-  [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard) 继承于recommend，一些常见的css书写标准

 

```
yarn add stylelint-config-standard stylelint-config-recess-order -D
```



### 3、添加.stylelintrc.js配置

```javascript
module.exports = {
  "extends": ["stylelint-config-standard", "stylelint-config-recess-order"],
  "rules": {
    // at-rule-no-unknown: 屏蔽一些scss等语法检查
    "at-rule-no-unknown": [true, {"ignoreAtRules" :[
      "mixin", "extend", "content"
    ]}]
  }
}

```



### 4、安装适配预处理语法的插件



### 5、在vue文件中使用stylelint

在运行时通过webpac检测。

```
yarn add stylelint-webpack-plugin -D
```

```javascript
config.plugins.push(new StylelintPlugin({
    // context: process.cwd(),
    files: ['src/**/*.{css,scss,vue}'],
    fix: true,
    cache: true,
    emitError: true,
    emitWarning: true
}))
```

安装stylelint， 使用vscode静态检测。但是最好不要设置下面的代码， 否则将不能识别scss文件。就算是设置为scss也会导致vue文件报错，所以不需要设置。

```
"stylelint.syntax": "html"
```

