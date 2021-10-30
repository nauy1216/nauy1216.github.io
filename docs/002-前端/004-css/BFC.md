

- https://segmentfault.com/a/1190000014886753



# BFC

https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context

### 什么是BFC?
**块格式化上下文（Block Formatting Context，BFC）** 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

> 记忆： 布局过程发生的区域



### 特点
- 一个独立的布局容器，在布局上不会影响外面的元素，也不会影响外面的元素。
- 同一个BFC内相邻的两个元素的上下margin会重叠，而不同的BFC内的两个元素的margin是不会重叠的。
- 形成了BFC的元素不会与其他浮动元素重叠。
- 在BFC元素内部的浮动元素是会被计算在内的。



### 形成BFC的场景？
- 根元素（`<html>）`
- 浮动元素（元素的 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 不是 `none`）
- 绝对定位元素（元素的 [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 为 `absolute` 或 `fixed`）
- 行内块元素（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `inline-block`）
- 表格单元格（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table-cell`，HTML表格单元格默认为该值）
- 表格标题（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table-caption`，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `table、``table-row`、 `table-row-group、``table-header-group、``table-footer-group`（分别是HTML table、row、tbody、thead、tfoot 的默认属性）或 `inline-table`）
- [`overflow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow) 计算值(Computed)不为 `visible` 的块元素
- [`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 值为 `flow-root` 的元素
- [`contain`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 值为 `layout`、`content `或 paint 的元素
- 弹性元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `flex` 或 `inline-flex `元素的直接子元素）
- 网格元素（[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 为 `grid` 或 `inline-grid` 元素的直接子元素）
- 多列容器（元素的 [`column-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count) 或 [`column-width` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/column-width) 不为 `auto，包括 ``column-count` 为 `1`）
- `column-span` 为 `all` 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（[标准变更](https://github.com/w3c/csswg-drafts/commit/a8634b96900279916bd6c505fda88dda71d8ec51)，[Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=709362)）。



块格式化上下文对浮动定位（参见 [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)）与清除浮动（参见 [`clear`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（[Margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)）也只会发生在属于同一BFC的块级元素之间。



### 应用场景？

- margin重叠问题。`overflow: hidden;`使得div1形成了`BFC`。本来div2的margin会跑到div1的外面，现在形成`BFC`后就不会了。

```html
<style>
    .div1 {
        overflow: hidden;
        background: pink;
    }
    .div2 {
        width: 200px;
        height: 200px;
        background: #e0e0e0;
        margin: 20px;
    }
</style>
<div class="div1">
    <div class="div2"></div>
</div>
```

- 清浮动。形成了`BFC`的元素的高度是计算浮动元素的高度在内的。下面的例子中，如果没加`overflow: hidden;`div1的高度就会是0，加了就是200px。

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    .div1 {
        overflow: hidden;
        background: pink;
    }
    .div2 {
        width: 200px;
        height: 200px;
        background: #e0e0e0;
        float: left;
    }
</style>
<div class="div1">
    <div class="div2"></div>
</div>
```

- 阻止普通文档流元素被浮动元素覆盖。如果没加`overflow: hidden;`的话demo1会浮在在demo2上，并且形成文字环绕的效果。加了之后demo1和demo2
  互不干扰不会重叠在一起。下面的例子稍微改下就能成为两栏布局。

```html
<style>
    * {
        margin: 0;
        padding: 0;
    }
    .demo1 {
        width: 100px;
        height: 100px;
        float: left;
        background: pink
    }
    .demo2 {
        width: 200px;
        height: 200px;
        background: blue;
        overflow: hidden;
    }
</style>

<div class="demo">
    <div class="demo1">我是一个左侧浮动元素</div>
    <div class="demo2">我是一个没有设置浮动, 也没有触发BFC的元素</div>
</div>
 
```





# IFC

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Inline_formatting_context

行内格式化上下文是一个网页的渲染结果的一部分。其中，各行内框（inline boxes）一个接一个地排列，其排列顺序根据书写模式（writing-mode）的设置来决定：

- 对于水平书写模式，各个框从左边开始水平地排列
- 对于垂直书写模式，各个框从顶部开始水平地排列



# GFC





# FFC