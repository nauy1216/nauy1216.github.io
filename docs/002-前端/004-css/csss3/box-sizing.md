### 盒模型

```
box-sizing：content-box|border-box;
content-box:标准盒模型
border-box:怪异盒模型（传统Ie盒模型）
```

在css中盒模型分为两种，第一种是w3c标准模型，另一种是Ie传统模型。
w3c标准盒模型
外盒尺寸计算
元素空间高度=内容高度+padding+border+margin
元素空间高宽度=内容宽度+padding+border+margin
内盒尺寸计算
元素空间高度=内容高度+padding+border
元素空间宽度=内容宽度+padding+border

传统IE盒模型
外盒尺寸计算
元素空间高度=内容高度+margin
元素空间高宽度=内容宽度+margin
内盒尺寸计算
元素空间高度=内容高度

两种模型的区别：
（1）标准盒模型设置的width是指的内容宽度，不包含padding、border IE盒模型设置的width包含padding、border
（2）标准盒模型设置padding、border时会改变盒子占的空间大小。 Ie和模型设置padding、border时不会该变盒子站的空间大小， 但会改变内容区域的大小。