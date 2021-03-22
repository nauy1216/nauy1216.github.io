# 多背景
css3新加的功能：多背景。

### 简写方式
```css
background: url(test1.jpg) no-repeat scroll 10px 20px/50px 60px content-box padding-box, 
url(test1.jpg) no-repeat scroll 10px 20px/70px 90px content-box padding-box, 
url(test1.jpg) no-repeat scroll 10px 20px/110px 130px content-box padding-box #aaa;
```
书写顺序`URL repeat attachment position/size origin clip color`, 拆分后;
```css
background-image:url(test1.jpg),url(test2.jpg),url(test3.jpg);
background-repeat:no-repeat,no-repeat,no-repeat;
background-attachment:scroll,scroll,scroll;
background-position:10px 20px,10px 20px,10px 20px;
background-size:50px 60px,70px 90px,110px 130px;
background-origin:content-box,content-box,content-box;
background-clip:padding-box,padding-box,padding-box;
background-color:#aaa;
```

注意：先写的在上面显示，后写的在下面。

### 背景尺寸
background-size:
- auto:默认值，不改变图片的尺寸
- 长度值：成对出现或一个值出现等比缩放，指定图片的width、height，只有一个值时指定width
- 百分比；用法与指定数值一样，
- cover：铺满
- contain：缩放到最大边刚好放下,

### 背景显示的起始位置（css2是默认从padding开始显示）
background-origin:
- border-box:从border开始显示
- padding-box：从padding开始显示
- content-box：从内容开始显示
> 作用：定义背景图片左上角的位置。

### 裁剪背景图片
background-clip:
- border-box:裁剪掉border以外的部分
- padding-box:裁剪掉padding以外的部分
- content-box:裁剪掉内容以外的部分
- no-clip:不裁剪