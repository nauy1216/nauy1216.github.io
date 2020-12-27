# 1、创建项目

```
npm init 

npm  npm install eslint --save-dev
```



设置一个配置文件：

```
./node_modules/.bin/eslint --init
```

执行命令后会有一系列的提示， 选择自己需要的即可。

执行完后会生成 .eslintrc.js 文件。

# 2、配置ESLint

ESLint设计为完全可配置的，这意味着您可以关闭所有规则并仅使用基本语法验证来运行，或者将捆绑的规则和自定义规则混合并匹配，以使ESLint非常适合您的项目。有两种主要的方法来配置ESLint：

1. **配置注释** -使用JavaScript注释将配置信息直接嵌入文件中。

2. **配置文件** -使用JavaScript，JSON或YAML文件为整个目录（主目录除外）及其所有子目录指定配置信息。这可以采用[`.eslintrc.*`](https://eslint.org/docs/user-guide/configuring#configuration-file-formats)文件的形式，也可以采用文件中的`eslintConfig`字段的形式[`package.json`](https://docs.npmjs.com/files/package.json)，ESLint会自动查找并读取它们，或者您可以在[命令行](https://eslint.org/docs/user-guide/command-line-interface)上指定配置文件。

   如果您的主目录（通常是`~/`）中有一个配置文件，则ESLint **仅**在ESLint无法找到任何其他配置文件时才使用它。

可以配置一些信息：

- **环境** -您的脚本旨在在其中运行的环境。每个环境都带有一组特定的预定义全局变量。
- **全局**变量-脚本在执行过程中访问的其他全局变量。
- **规则** -启用了哪些规则以及处于什么错误级别。

