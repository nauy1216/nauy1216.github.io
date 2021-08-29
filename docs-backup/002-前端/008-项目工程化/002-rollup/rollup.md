https://www.rollupjs.com/guide/introduction/#%E6%A6%82%E8%BF%B0overview

### Tree-shaking 

除了使用 ES6 模块之外，Rollup 还静态分析代码中的 import，并将排除任何未实际使用的代码。这允许您架构于现有工具和模块之上，而不会增加额外的依赖或使项目的大小膨胀。



### 配置文件

```js
// rollup.config.js
export default {
  // 核心选项
  input,     // 必须
  external,
  plugins,

  // 额外选项
  onwarn,

  // danger zone
  acorn,
  context,
  moduleContext,
  legacy

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file,    // 必须
    format,  // 必须
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,

    // 高危选项
    exports,
    amd,
    indent
    strict
  },
};
```

如果你想使用Rollup的配置文件，记得在命令行里加上`--config`或者`-c`

```shell
# 默认使用rollup.config.js
rollup --config

# 或者, 使用自定义的配置文件，这里使用my.config.js作为配置文件
rollup --config my.config.js
```



监听源文件是否有改动，如果有改动，重新打包

```
-w/--watch
```

