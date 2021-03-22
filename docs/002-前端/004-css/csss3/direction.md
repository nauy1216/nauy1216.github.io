# direction

1. 作用：定义文字排列方式。
2. 用法:
```css
direction:rtl;
```
- rtl:从右到左
- ltr：从左到右
单独使用只是将文字右对齐,需要配合
```css
unicode-bidi:bidi-override;
```
此时会将文字的书写顺序变成从右到左。

# 示例
```html
<div class="test1">123456789</div>
<style>
.test1 {
  direction:rtl;
  unicode-bidi:bidi-override;
}
</style>
```
<div class="test1">123456789</div>
<style>
.test1 {
  direction:rtl;
  unicode-bidi:bidi-override;
}
</style>