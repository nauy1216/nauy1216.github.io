# 参考文档
1. https://segmentfault.com/a/1190000014722978
2. https://www.cnblogs.com/xiaohuochai/p/8537959.html
3. https://blog.csdn.net/xiangzhihong8/article/details/53195926

# css模块化有什么好处？

# CSS 模块化的解决方案
1. 一类是彻底抛弃 CSS，使用 JS 或 JSON 来写样式。Radium，jsxstyle，react-style 属于这一类。
  - 优点是能给 CSS 提供 JS 同样强大的模块化能力。
  - 缺点是不能利用成熟的 CSS 预处理器（或后处理器） Sass/Less/PostCSS，:hover 和 :active 伪类处理起来复杂。

2. 另一类是依旧使用 CSS，但使用 JS 来管理样式依赖，代表是 CSS Modules。
  发布时依旧编译出单独的 JS 和 CSS。只要你使用 Webpack，可以在 Vue/React/Angular/jQuery 中使用。

# CSS 模块化遇到了哪些问题？
1. 全局污染
2. 命名混乱
3. 依赖管理不彻底
4. 无法共享变量
5. 代码压缩不彻底
    - 对非常长的 class 名却无能为力


# CSS Modules 模块化方案
CSS Modules 内部通过 ICSS 来解决样式导入和导出这两个问题。分别对应 :import 和 :export 两个新增的伪类。



