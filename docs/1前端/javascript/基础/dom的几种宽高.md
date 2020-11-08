### clientWidth、clientHeight

可视区宽高 = 样式宽高+padding
（1）oBj.clientWidth(可以是任何元素)
（2）文档元素可区尺寸：
document.documentElement.clientWidth
document.documentElement.clientWidth
（3）如果有滚动条会减去滚动条的距离。
例如：div加了滚动条后可视区的宽度就减少了。

### offsetWidth、offsetHeight

样式宽高+padding+border
和内部内容是否超出元素大小无关 只和本来设定的尺寸有关。

### scrollWidth、scrollHeight

滚动条的长度(元素内容所占尺寸)。
（1）没有滚动条时
与clientWidth、clientHeight一样。

（2）有滚动条时
没有padding时：就是div内容的高度。
有padding时：
ff、IE：内容高+padding-top
chrome：内容高+padding-top+padding-bottom

### clientTop、clientLeft

元素的border宽度。
只能获取上边框和左边框，右边框和下边框可以自己计算。

### scrollTop、scrollLeft

滚动条滚动距离，可读写。
指的是当元素其中的内容超出其宽高时，
元素被卷起的高度和宽度, 也就是滚动条滚动的距离。

兼容问题
chrome：
document.body.scrollLeft
document.body.scrollTop
其他浏览器：
document.documentElement.scrollLeft
document.documentElement.scrollLeft
注意:
（1）屏幕缩放对于滚动距离有影响。屏幕放大滚动的距离不一样，但占滚动条的比例是不变的。
（2）window、document.body才有onscroll事件，除非某个元素自己的滚动条。

### clientX、clientY

相对于浏览器屏幕左上角的坐标。
当一个鼠标点击或鼠标移动并且一个事件发生时， 鼠标到浏览器可视区的距离。

e.clientX
e.clientY
不会因为浏览器窗口变化或者放大而变化。

### screenX、screenY

当一个鼠标点击或鼠标移动并且一个事件发生时， 鼠标 相对于设备屏幕的坐标。

e.screenX
e.screenY

### offsetX、offsetY

当一个鼠标点击或鼠标移动并且一个事件发生时， 鼠标 相对于事件目标的位置。

e.offsetX
e.offsetY
例如：点击一个div就是相对于div左上角的坐标。

### pageX、pageY

相对于文档html的距离。

e.pageX
e.pageY

### offsetLeft 、offsetTop

1、当前元素有定位父级
标准：到定位父级的距离
IE6、7：自己有定位，则是到定位父级的距离。 自己没有定位，则是到body的距离

2、当前元素没有定位父级
默认都是到html的距离。
注意此时offsetParent是body。

3、父级边框内侧到子级边框外侧距离。

### 浏览器窗口尺寸



#### window.innerWidth、window.innerHeight

浏览器窗口除去工具栏等的宽度与高度。

#### window.outerWidth、window.outerHeight

浏览器窗口的宽度与高度。