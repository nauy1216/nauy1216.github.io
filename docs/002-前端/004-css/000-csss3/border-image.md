# 参考文档
https://blog.csdn.net/qq_41903941/article/details/90259306

# 盒边框背景
`border-image`通过指定一张图片来取替` border-style `定义的样式。
但` border-image `生效的前提是： `border-style` 和 `border-width` 同时为有效值(即 *border-style 不为 none，border-width 不为 0*)。
可以把边框背景理解成是`border`的一个附属属性，如果`border`不存在或者不显示那么给边框设置任何样式也没有意义了。 
### border-image:
复合属性，是border新加的一个属性

### border-image-source；url()；
引入图片

### border-image-slice:10 10 10 10;
- 作用将图片切割成九宫格
切割的图片尺寸(这里没有单位px) 该属性指定从上，右，下，左方位来分隔图像，将图像分成4个角，4条边和中间区域共9份，中间区域始终是透明的（即没图像填充），除非加上关键字 fill。

### border-image-width:
- 作用将使用`border-image`的dom元素切割成九宫格。然后将图片九宫格的内容填充到dom对应的每一个格子中去。
边框宽度。

### border-image-repeat:
边框是平铺，round平铺、repeat重复、stretch（默认）拉伸

例子：
```css
border:20px solid red;//必须写，如果下面的语句失效，此时边框填充颜色
border-image:url(Hydrangeas.jpg) 20 20 20 20 repeat;
```
因为border-image是border的一个属性，所以先有border再有border-image这就是border必须写的原因。