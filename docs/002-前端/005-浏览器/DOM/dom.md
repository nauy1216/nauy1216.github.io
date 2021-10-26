### 1、什么是DOM？

1、Document Object Model
2、作用：为了能让js操作页面的元素。
3、DOM会把文档看成是一棵节点树。
4、根元素是html。
document.documentElement
5、同时定义了很多方法来操作这棵树中的每一个元素（节点）。
getElementById()
getElementsByTagName()
document.body
..........

### 2、DOM节点类型

共有12种节点类型。
第1种：元素节点。
第2种：文本节点。（空格也是）
第3种：属性节点。

### 3、元素节点的常用属性

#### 1、childNodes

作用：获取元素的子节点列表集合

用法：ele.childNodes。返回的集合有length属性。

标准：**包括元素节点、文本节点。**

非标准IE（6、7、8）：元素节点。

***非法嵌套时标准会包含非法嵌套的元素，非标准IE不包含***

#### 2、nodeType

作用：返回节点类型。只读。

用法：ele.nodeType

没有兼容问题。

#### 3、attributes

作用：返回节点的属性，[{},{},{}]格式。只读。

用法：ele.attributes[0].name

ele.attributes[0].value

ele.attributes[0].nodeType

#### 4、children

作用：返回子节点列表集合。

用法：ele.children

标准： **元素节点**。

非标准IE：元素节点。

#### 5、firstChild

作用：第一个子节点

标准：包括元素节点、文本节点。

非标准IE：元素节点。

标准下的解决办法：firstElementChild

兼容写法：

var oFirst = oUl.firstElementChild || oUl.firstChild;

***这样写存在的隐患：当oUl下没有元素子节点时 可能会返回一个文本节点。****

解决：在使用oFirst之前判断oFirst的节点类型。

#### 6、lastChild

作用：最后一个子节点

标准：包括元素节点、文本节点。

非标准IE：元素节点。

标准下的解决办法：lastElementChild

兼容写法：

var oLast = oUl.lastElementChild || oUl.lastChild; ***这样写存在的隐患：当oUl下没有元素子节点时 可能会返回一个文本节点。****

解决：在使用 oLast之前判断 oLast的节点类型。

#### 7、nextSibling

作用：下一个子节点

标准：包括元素节点、文本节点。

非标准IE：元素节点。

标准下的解决办法：nextElementSibling

兼容写法：

var oL2= oL1.nextElementSibling || oL1.nextSibling;

***这样写存在的隐患：当oL1没有下一个元素子节点时 可能会返回一个文本节点。****

解决：在使用 oL2之前判断 oL2的节点类型。

#### 8、previousSibling

作用：上一个子节点

标准：包括元素节点、文本节点。

非标准IE：元素节点。

标准下的解决办法：previousElementSibling

兼容写法：

var oL2= oL1.previousElementSibling || oL1.previousSibling;

***这样写存在的隐患：当oL1没有上一个元素子节点时 可能会返回一个文本节点。****

解决：在使用 oL2之前判断 oL2的节点类型。

#### 9、parentNode

**当前节点的父节点**

没有兼容问题

#### 10、offsetParent

作用：**最近的有定位的父节点**

如果没有定位父级标准默认是body。

***IE6、7不一样：如果当前元素么没有定位则是body，有定位则是html。 如果当前元素的某个父级触发了layout，那么就会指向触 发了layout的这个节点。***

#### 11、nodeName

#### 12、nodeValue



### 4、元素节点常用方法



#### 1、getElementById()

这是document才有的方法哦！

例如：document.getElementById(‘div1’);

#### 2、getElementsByTagName()

这是所有元素都有的方法。

#### 3、createElement()

1、动态创建元素，这也是document才有的方法哦！

2、配合appendChild()或insertBefore()使用。

例如：var oLi = document.createElement(‘li’);

oLi.innerHTML=’’;

oUl.appendChild(oLi);

#### 4、appendChild() 、insertBefore()

父元素.appendChild(要添加的元素);

添加到最后面。

父元素.insertBefore(要添加的元素,被插入的元素)；

在指定的元素前面插入，在IE下如果指定的元素不存在会报错， 而其他浏览器会以appendChild()的形式添加。

#### 5、removeChild()

父元素.removeChild(要删除的元素);

删除指定的元素。

#### 6、replaceChild()

父元素.replaceChild(新的元素, 被替换的元素);

作用：替换指定的元素。 注意：

appendChild()、replaceChild()、insertBefore() 也可以操作现有的元素，注意这是剪切操作

#### 7、getElementsByClassName()

htm5新增。

思考：

1、封装function getElementByClass(parent,tag,classname){}

2、封装addClass()、removeClass()给元素添加或删除classa

#### 8、createTextNode()

创建文本节点。



### 5、DOM操作表格



#### 1、表格的属性

tHead 、tBodies、tFoot、rows、cells

注意一个表格可能有几个tbody。

#### 2、用法

var oBody = oTab.tBodies[0];

var oRow = oBody.rows[1];

oRow.cells[5].innerHTML=’ ’;

#### 3、注意

在写表格html标签结构时，应加上tbody，因为浏览器在你没有加tbody时会 自动为你添加。这样会导致在获取元素时出现预料之外的结果。



### 6、DOM操作表单



#### 0、document.forms

获取页面中的所有表单。

document.forms[1]

document.forms[name]

#### 1、name属性

作用：

1、表单在数据提交时，name属性很重要。

2、可以用name属性值来操作表单控件。

例如：< inpt type="text" name ="name1">

oForm.name1;

注意：

如果是radio或checkbox，那么返回的是一个数组。

#### 2、表单的onchange事件：

当值发生改变的时候触发。

1、checkbox/radio:

有一个checked属性。

标准：只要值改变了就触发。

非标准：焦点离开时值改变了就触发。

2、select：

下面的option有一个selected属性，

如果某个option的selected的值为true那么

select的value值就是这个option的值。

#### 3、表单的onsubmit事件：

表单提交的时候触发。

1、表单的三个重要属性：action、 method、enctype

2、阻止表单提交：return false；

3、也可以通过submit()方法来提交。



### 7、getBoundingClientRect()

Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。IE5+ 兼容。

```javascript
// rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
var rect = obj.getBoundingClientRect();
```



### 8、children和childNodes的区别

