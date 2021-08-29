### float

- 1、float使元素尽可能在父容器内向左或向右浮动，直到碰到其他的浮动元素或父级。
- 2、float使元素脱离文档流，但他有一个特点提升层级半级，被块元素忽略，被内联元素知道。
- 3、清除浮动：clear：left/right/both;
- 4、特点：
  1. 使块元素在一行显示
  2. 使内联元素支持宽高
  3. 换行被解析了
  4. 不设置宽度时由内容撑开



```css
<div style="float: left; width: 200px;height: 200px;background-color: green;">fff</div>
<div style="float: left; width: 200px;height: 200px;background-color: red;">fff</div>
<div style="float: left; width: 200px;height: 200px;background-color: #000;">fff</div>
```



<div style="float: left; width: 200px;height: 200px;background-color: green;">fff</div>
<div style="float: left; width: 200px;height: 200px;background-color: red;">fff</div>
<div style="float: left; width: 200px;height: 200px;background-color: #000;">fff</div>





