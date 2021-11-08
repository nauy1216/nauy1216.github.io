# 1、用法：
###  html
元素属性`draggable`设置为true就可以拖拽了

### js
**拖拽元素事件** : 事件对象为被拖拽元素（拖拽）

- **dragstart**： 拖拽前触发

- **drag** ： 拖拽前、拖拽结束之间，连续触发

- **dragend**： 拖拽结束触发



**目标元素事件** : 事件对象为目标元素（释放）

- **dragenter**： 进入目标元素触发，相当于mouseover

- **dragover**： 进入目标、离开目标之间，连续触发

- **dragleave**： 离开目标元素触发，相当于mouseout

- **drop**; 在目标元素上释放鼠标触发



>  **要想触发drop事件必须在触发dragover事件时阻止默认事件。**



**事件的执行顺序**: 

1. drop不触发的时候

   dragstart > drag > dragenter > dragover > **dragleave** > dragend

2. drop触发的时候(dragover的时候阻止默认事件)

   dragstart > drag > dragenter > dragover > **drop** > dragend

不能释放的光标和能释放的光标不一样。





# 2、兼容问题

### 解决ff下的兼容

ff必须设置dataTransfer对象才可以拖拽除图片外的其他标签。

### dataTransfer对象

这个对象是事件对象event下的对象。不仅可以解决ff的兼容问题， 也可以在拖放对象和目标对象之间传递数据。

**setData()** 

```js
// 设置数据 key和value(必须是字符串)
ev.dataTransfer.setData('name','hello');
```

想要传递多个数据，可以多次使用上面的语句，分多次设置不同的数据。 也可以传递json字符串。

>  注意：

1. 必须填写参数。且都是字符串。

2. 第一个参数必须是"text"、"url",才能兼容IE。

**getData()** 

获取数据，根据key值，获取对应的value。

```js
ev.dataTransfer.getData('name')
```

> 用法：

在拖动对象的`ondragstar`t事件对象触发时设置数据， 在目标对象的任何事件内均可获取数据。



**effectAllowed**

设置光标样式，可以是none, copy, copyLink,copyMove, link, linkMove, move, all 和 uninitialized等。

```js
ev.dataTransfer.effectAllowed = 'link';
```



**setDragImage**

三个参数：指定的元素，坐标X，坐标Y

作用：设置拖动对象时，用来替换拖动图像的样式。 只是更改外观。

用法：

```js
ev.dataTransfer.setDragImage(oDiv,0,0);
```



**files**

- 获取外部拖拽的文件，返回一个filesList列表。

- filesList下有个type属性，返回文件的类型。



# 3、例子



```html
            <ul>
                <li draggable="true">1</li>
                <li draggable="true">2</li>
                <li draggable="true">3</li>
            </ul>
            <div></div>

            <script>
                var oUl = document.querySelector('ul');
                var aLi = document.querySelectorAll('li');
                var oDiv = document.querySelector('div');
                var num=-1;//用于存储拖动对象的信息
                for(var i=0;i < aLi.length;i++){
                    aLi[i].index=i;//注意闭包
                    aLi[i].ondragstart=function(){
                        this.style.background='blue';
                        num=this.index;
                    };
                    aLi[i].ondrag=function(){
                    };
                    aLi[i].ondragend=function(){
                        this.style.cssText="background:red;";
                    };
                }

                oDiv.ondragenter=function(){
                    this.style.background='yellow';
                };
                oDiv.ondragover=function(ev){
                    ev.preventDefault();
                }
                oDiv.ondragleave=function(){
                    this.style.cssText='green';
                };
                oDiv.ondrop=function(){
                    oUl.removeChild(aLi[num]);
                };
            </script>
        
```

