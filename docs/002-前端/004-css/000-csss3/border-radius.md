# border-radius
如果/前后的值都存在,那么/前面的值为水平半径,后面的值为垂直半径;如果没有/,则水平和垂直的值相等. 顺序是按照top-left、top-right、bottom-right、bottom-left来的。
```css
border-radius: 20px; /*4个角的横向和纵向半径都是20px*/
border-radius: 10px / 20px; /*4个角的横向半径是10px，纵向半径都是20px*/
border-radius: 10px 20px / 20px;
border-radius: 10px 20px 30px / 20px;
border-radius: 10px 20px 30px 40px / 20px;
```
> 注意：
1. 取值可以是px或%，%是x轴对应相对于width的尺寸
2. 圆角不会影响原有的内容的显示排列。