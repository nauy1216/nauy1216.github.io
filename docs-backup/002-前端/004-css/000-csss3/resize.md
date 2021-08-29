### 缩放

```css
resize: both|horizontal|vertical;
```
- both:水平垂直都可以缩放
- horizontal：只有水平方向可以缩放
- vertical：只有垂直方向可以缩放

> 配合使用才有效果：overflow:auto;

> 兼容：ie不兼容。

<div class="box">box-shadow: 0 10px 10px -10px gray;</div>
<style>
.box {
  margin: 20px;
  display: inline-block;
  width: 400px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  background: #e0e0e0;
  resize: horizontal;
  overflow: auto;
} 
</style>