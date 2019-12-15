# 1、新增语义化标签

## header

用于页面的顶部或板块的的顶部

## nav

导航条

## hgroup

页面上的标题组合

## section

页面上的版块用来划分区域

## article

用来表示一套结构完整且独立的内容部分

## aside

和主体相关的东西

## figure

用于表示对元素进行组合，一般用于图片或视频

## footer

用于页面的底部或板块的的底部

## time

用来表示时间



# 2、新增功能标签

注意：不同的浏览器在实现相同功能下，可能uI界面不一样，要注意浏览器的默认样式。

## datalist

选项列表。一般配合input元素使用，来定义input可能的值。

```
<input type="text" list="valist">
<datalist id="valist">
    <option value="html5">html5</option>
    <option value="html">html</option>
    <option value="css">css</option>
    <option value="js">js</option>
</datalist>
```



## details

用于描述文档或文档某个部分的细节（块元素）

<details style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><summary>html</summary></details>

```
<details>
    <summary>html</summary>     //被描述的对象
    <p>超文本标记语言</p>      //对象的细节，可以是任何标签
</details>
```



## dialog

定义对话。（块元素，自动居中,脱离文档流）

老师1+1=？小明2老师你真聪明

```
<dialog open>//open 属性决定是否展开对话
    <dt>老师</dt>
    <dd>1+1=？</dd>
    <dt>小明</dt>
    <dd>2</dd>
    <dt>老师</dt>
    <dd>你真聪明</dd>
</dialog>
```



## adress

定义详细信息。
address 定义详细信息。

## mark

标记（内联元素，背景颜色变化）

## keygen



## progress

进度条（IE678不兼容）
两个属性：
max:总的值。
value:此时的值。

```
<progress max="100" value="25"></progress>
```



# 3、html5语义化标签的兼容

> 注意：只能用于语义化标签，功能化标签需要配合js实现。

下面以兼容header为例。
**第一种方法：**
1、在script标签里加

```
document.createElement('header');//创建自定义标签
```

2、在style中定义样式。为自定义标签添加样式。
3、功能标签可以通过js，来添加功能。
然后就可以在低版本浏览器中使用了。

下面的代码定义了header标签，并且给他增加了点击背景颜色变红的功能。

```
script
document.createElement('header');
window.onload=function(){
    var ah = document.getElementsByTagName('header');
    for(var i=0;i<ah.length;i++){
        ah[i].onclick=function(){
        	this.style.background='red';
        };
    }
};
</script>
<style>
	header{display:block;}
</style>    
```

**第二种方法：**

引入html5shiv.js。在实际工作中会引入这个文件，而不是使用第一种方法。



# 4、新增表单控件

## email

电子邮箱文本框，界面和普通文本输入框一样。
作用：在提交表单的时候验证邮箱的格式是否正确。

```
<input type="email">
```



## tel

电话号码。pc端没有什么变化，移动端会切换到数字，没有验证。

```
<form action="http://www.baidu.com" method="get">
    <input type="tel" name="tel">
    <input type="submit">
</form>
```



## url

网址。
作用：验证网址。网址必须带http://或https://。

```
<form>
    <input type="url">
    <input type="submit">
</form>
```



## search

搜索。
作用：输入文本时，输入框带有一个‘X’，点击清除内容。

```
<form>
    <input type="search">
    <input type="submit">
</form>
```



## range

数值选择器（滑动条选择值）。
作用：数值选择。
属性：
step: 步值
min：最小值
max：最大值
value：当前值

```
<form action="http://www.baidu.com" method="get">
    <input type="range" step="2" min="0" max="1000" value="500" name="range">
    <input type="submit">
</form>
```



## number

数字选择（上下箭头按钮点击改变值）。
作用：界面和文本输入框一样，只是多了两个按钮，可以调整数字的大小。
step:步值
min：最小值
max：最大值
value：当前值

```
<form action="http://www.baidu.com" method="get">
    <input type="number" step="2" value="2" max="10" min="0" name="range">
    <input type="submit">
</form>
```



## color

颜色选择器。
作用：点击弹出一个颜色选择框。

```
<form action="http://www.baidu.com" method="get">
    <input type="color" name="color">
    <input type="submit">
</form>
```



## 时间相关的控件

###   datetime

显示完整的时间。

```
<input type="datetime">
```



### datetime-local

显示完整年月日时间, 不含时区。
作用：点击弹出一个时间选择器。

```
<form action="http://www.baidu.com" method="get">
    <input type="datetime-local" name="color">
    <input type="submit">
</form>
```



###  time

显示完整时间 不含时区
作用：和上面一样



### date

只显示日期，不显示时间



###  week

显示‘2017年 第 20周’



###  month

显示‘2017年 09月’



# 5、新增表单属性

## placeholder

输入框提示信息。

```
<form action="http://www.baidu.com" method="get">
    <input type="text" placeholder="hello">
    <input type="submit">
</form>
```



## autocomplete

是否保存历史输入值，输入时有历史提示。默认为on。



## autofocus

指定表单自动获取焦点。该属性没有值。



## list

配合datalist为输入框构造一个选项列表。参考功能标签datalist的使用方法。



## required

此项位必填项。



## pattern

正则验证，有安全隐患。



## formaction

保存至草稿箱。（不明白）



# 6、h5表单验证

**作用**： 表单提交的时候验证表单数据。



**validity属性：**  控件的validity的valid属性。
**valid：**可以查看验证是否通过，如果八种验证都通过返回true，一种验证失败返回false。
某个表单控件是否验证通过，只要看以下的八种验证的结果。
1、**valueMissing** : 输入值为空时,值为true，验证失败。
2、**typeMismatch** : 控件值与预期类型不匹配,值为true
3、**patternMismatch** : 输入值不满足pattern正则,值为true
4、**tooLong** : 超过maxLength最大限制,值为true
5、**rangeUnderflow** : 验证的range最小值,值为true
6、**rangeOverflow**：验证的range最大值,值为true
7、**stepMismatch**: 验证range 的当前值 是否符合min、max及step的规则,值为true
8、**customError** 不符合自定义验证,值为true



**setCustomValidity：**自定义验证信息。
定义：每个控件自带的方法。
作用：用于自定义控件的验证消息，当验证失败时弹出消息。
用法：oInput.setCustomValidity(message);
例子：

```
var oText=document.getElementById("text");
oText.oninput=function(){
    if(this.value=="55"){//可以定义很复杂的验证
    	this.setCustomValidity("请不要输入敏感词");
    }
    else{
    	this.setCustomValidity("");
    }
};
        
```





**invalid事件**

作用：验证失败，触发事件。

```
oInput.addEventListener('invalid',fn,false)
```

阻止默认验证：ev.preventDefault()。



formnovalidate属性 : 关闭验证

例1、输入不能为空，使用系统的验证。

```
var oText=document.getElementById('t2');
oText.addEventListener('invalid',fn,false);
function fn(){
    if(this.validity.valueMissing){//输入值为空时，返回true。
    	alert("kong");//弹出框会阻止消息提示。
    }
    ev.preventDefault();
}
```



例2、自定义验证，自定义验证规则还有验证消息。

```
var oText=document.getElementById("t3");
oText.oninput=function(){//自定义验证
    if(this.value=="敏感词"){//定义验证规则
    	this.setCustomValidity("请不要输入敏感词");
    }else{
    	this.setCustomValidity("");
    }
};
```



例3、改变系统的提示消息，采用系统的验证，只是自定义消息。

```
var oText=document.getElementById('t4');
oText.addEventListener('invalid',fn,false);
function fn(){
    if(this.validity.valueMissing){
    	this.setCustomValidity("老刘说不能为空哦！");
    }else{
    	this.setCustomValidity("");
    }
    ev.preventDefault();
}
```



怎么使用表单验证呢？

原理：

表单提交时会自动验证表单自己提供的8中验证，其中一种是自定义验证。 使用方法：

只要给要验证的表单控件加上验证即可。

在控制台输入;

```
oText=document.getElementById("text").validity//#text为要验证的控件
```

结果：各种验证的结果，返回true表示验证不通过。

```
badInput:false

customError:true

patternMismatch:false

rangeOverflow:false

rangeUnderflow:false

stepMismatch：false

tooLong：false

tooShort:false

typeMismatch:false

valid:false

valueMissing:false

__proto__:ValidityState

```

如果每个控件都验证成功，表单才会提交。



**如何更改系统控件验证消息？**

通过invalid事件监测验证结果，然后直接用setCustomValidity(),改成自己想要的声音就行。

总结：

表单控件验证的步骤：

1、确定验证。

2、监听验证消息（改变系统的验证消息时才需要）。

```
oInput.addEventListener('invalid',fn,false)
```

3、根据验证消的值弹出验证信息

```
oInput.setCustomValidity(message);
```

自己写的一个验证输入内容是否为数字：

```
var oText=document.getElementById("t6");
var n=/[^\d]+/.test(this.value);//验证
if (n) {
    oText.setCustomValidity('not a number');
    //这里还可以增加一些改变样式的语句
}else{
    oText.setCustomValidity('');//    必须清空
}
```



# 7、新增选择器

##  querySelector() 

参数是css选择器,可以写复杂的选择器。
用法：

```
document.querySelector('.aa').style.background='red';//只能选择一组中的第一个
document.querySelector('.box #aa').style.background='red';
document.querySelector('.box').querySelector(' .aa').style.background='red';
```



## querySelectorAll()

获取一组元素。适用所用的选择器包括id选择器，返回的是一个数组。
用法：

```
var aDiv = document.querySelectorAll('#aa')[0].style.background='red';
```



## getElementsByClassName()

html5增加。



# 8、classList

**classList：** 返回某个元素的所有类的数组。
**classList.length** 数组的长度
**classList.add('类名')** 添加类
**classList.remove('类名')** 删除某个类
**classList.toggle('类名')** 没有就添加，有就删除

例子： 

```
class="aa bb cc"
var oDiv = document.querySelector('#aa');
//alert(oDiv.classList);//aa bb cc
//alert(oDiv.classList.length);//3

//oDiv.classList.add('dd');//添加aa类
//alert(oDiv.classList);//aa bb cc dd
//alert(oDiv.classList.length);//4

// oDiv.classList.remove('aa');
// alert(oDiv.classList);// bb cc
//alert(oDiv.classList.length);//2

oDiv.classList.toggle('aa');
alert(oDiv.classList);// bb cc
alert(oDiv.classList.length);//2

oDiv.classList.toggle('hh');
alert(oDiv.classList);// aa bb cc hh
alert(oDiv.classList.length);//4
```



# 9、json对象的方法

## 字符串转对象

**parse** : 只能解析JSON形式的字符串变成JS (安全性要高一些)。
json字符串要严格形式。key，value 都加双引号。

**eval** : 可以解析任何字符串变成JS,解析json字符串时要加括号。

例子：

```
var str='function show(){alert(0);}';
eval(str);
show();//0

JSON.parse(str);
show();//解析失败

var str = '{"name":"hello"}';
var json=eval("("+str+")");//这里要加括号。
alert(json.name)//hello

var json = JSON.parse(str);
alert(json.name);//hello
```



## 对象转字符串

JSON.stringify()

例子：

```
var json = {"name":"hello"};
alert(JSON.stringify(json));
```



## 解决兼容问题

如何其他浏览器做到兼容。
http://www.json.org/去下载json2.js。



# 10、自定义属性

给元素添加自己定义的属性。

`data-属性名=""`
标签添加属性。

`dataset.属性名`
js读取属性值，或写入属性值。

例子：

```
<div id="aa" data-hello-world="helloworld!">1</div>
<div id="bb" data-hello="world!">1</div>

var oaa = document.querySelector('#aa');
var obb = document.querySelector('#bb');

//alert(oaa.dataset.helloWorld)；

obb.dataset.world="haha";
alert(obb.dataset.world);
```

运用自定义属性的库

knockout.js

jQuery mobile.js

问题：这种自定义属性的方法与以前学的自定义属性的方法有什么区别？

**系统自带的的方法，js操作更简单。**



# 11、js加载

## JS的加载会影响后面的内容加载

在head标签内引入js，浏览器加载页面时先加载js文件再加载文档。 很多浏览器都采用了并行加载JS，但还是会影响其他内容。当浏览器遇到（内嵌）script标签时，当前浏览器无从获知javaScript是否会修改页面内容。因此，这时浏览器会停止处理页面，**先执行javaScript代码，然后再继续解析和渲染页面**。同样的情况也发生在使用 src 属性加在javaScript的过程中（即外链 javaScript），浏览器必须先花时间下载外链文件中的代码，然后解析并执行它。在这个过程中，页面渲染和用户交互完全被阻塞了。



> 也就是说：每当浏览器解析到script标签（无论内嵌还是外链）时，浏览器会（一根筋地）优先下载、解析并执行该标签中的javaScript代码，而阻塞了其后所有页面内容的下载和渲染。



## **惯例的做法**

**最传统的方式是在head标签内插入script标签。**

然而这种常规的做法却隐藏着严重的性能问题。根据上述对script标签特性的描述，我们知道，在该示例中，当浏览器解析到script标签时，浏览器会停止解析其后的内容，而优先下载脚本文件，并执行其中的代码，这意味着，其后的test.css样式文件和body标签都无法被加载，由于body标签无法被加载，那么页面自然就无法渲染了。因此在该javaScript代码完全执行完之前，页面都是一片空白。

<script type="text/javaScript" src="example.js"></script>



## **经典的做法**

既然script标签会阻塞其后内容的加载，那么将script标签放到所有页面内容之后不就可以避免这种糟糕的状况了吗？ **将所有的script标签尽可能地放到body标签底部，以尽量避免对页面其余部分下载的影响。**

在IE8+浏览器上已经实现了脚本并行下载，但在某些浏览器中（即使脚本文件放到了body标签底部），页面中脚本仍是一个接着一个加载的。所以我们需要下一个方法，即：动态加载脚本。



## 动态加载脚本

通过文档对象模型（DOM），我们可以几乎可以页面任意地方创建。

```
<script type='text/javascript'>
  var script = document.createElement('script');
  script.type = 'text/javaScript';
  script.src = 'file1.js';
  document.getElementsByTagName('head')[0].appendChild(script);
</script>
```



上述代码动态创建了一个外链file1的script标签，并将其添加到<head>标签内。这种技术的重点在于：

**无论在何时启动下载，文件的下载和执行过程不会阻塞页面其他进程（包括脚本加载）。**
**然而这种方法也是有缺陷的。这种方法加载的脚本会在下载完成后立即执行，那么意味着多个脚本之间的运行顺序是无法保证的（除了Firefox和Opera）。**当某个脚本对另一个脚本有依赖关系时，就很可能发生错误了。比如，写一个jQuery代码，需要引入jQuery库，然而你写的jQuery代码文件很可能会先完成下载并立即执行，这时浏览器会报错——‘jQuery未定义'之类的，因为此时jQuery库还未下载完成。于是做出以下改进：

```
<script type='text/javascript'>
  function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javaScript";
    // IE和opera支持onreadystatechange
    // safari、chrome、opera支持onload
    if (script.readyState) {//IE
      script.onreadystatechange = function() {
        if (script.readyState == "loaded"
            || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {//其他浏览器
      script.onload = function() {
        callback();
      };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
</script>
```



上述代码改进的地方就是增加了一个回调函数，该函数会在相应脚本文件加载完成后被调用。这样便可以实现顺序加载了，写法如下（假设file2依赖file1，file1和file3相互独立）：

loadScript(‘file1.js',function(){ loadScript(‘file2.js',function(){}); }); loadScript(‘file3.js',function(){});

file2会在file1加载完后才开始加载，保证了在file2执行前file1已经准备妥当。而file1和file3是并行下载的，互不影响。 虽然loadScript函数已经足够好，但还是有些不尽人意的地方——通过分析这段代码，我们知道，loadScript函数中的顺序加载是以脚本的阻塞加载来实现的(正如上述红字部分指出的那样)。而我们真正想实现的是——脚本同步下载并按相应顺序执行，即并行加载并顺序执行。



## Html5的defer和async

**defer** :

**延迟加载，按顺序执行。**

如果`script`标签设置了该属性，则浏览器会异步的下载该文件并且不会影响到后续`DOM`的渲染；如果有多个设置了`defer`的`script`标签存在，则会按照顺序执行所有的`script`；`defer`脚本会在文档渲染完毕后，`DOMContentLoaded`事件调用前执行。

```
<script src="b.js" defer="defer"> </script>
```



**async** :

**异步加载，非顺序执行(加载完就触发)。**

`async`的设置，会使得`script`脚本异步的加载并在允许的情况下执行
`async`的执行，并不会按着`script`在页面中的顺序来执行，而是谁先加载完谁执行。

```
<script src="a.js" async ="async"> </script>
```

[参考文档](https://www.cnblogs.com/jiasm/p/7683930.html)

## Labjs 和 **requireJS**



# 12、历史管理

**跳转页面**
用户连续访问不同网址，浏览器自动记录历史记录，触发历史管理。



**hash**
网址#后面的东西， 通过js修改hash值并不会刷新页面。

原理：
不同的hash值关联不同的内容， 根据某一个hash值通过这种关联找到相应的内容。 不同的hash值访问同一个页面不同的历史数据。 特点：
（1）网址没有改变。改变的是网址的数据。
（2）一个hash值对应一组页面数据。
（3）当在新的窗口访问再次访问同一个页面时，就算有hash 值也找不到对应的数据。由此可知，改变hash值时并没有刷新页面。 window.location.hash="";//给地址加上一个hash值



**onhashchange事件：**

当hash值发生变化时触发。

```
window.onhashchange=functiion(){
    //window.location.hash
    根据此时的hash值找到对应的历史内容。
}
```



```
         window.onload = function(){//35个数随机取7个数
            var oInput = document.getElementById('input1');
            var oDiv = document.getElementById('div1');

            var json = {};//用于存储数据，不同的hash值会有不同的窗口。

            oInput.onclick = function(){

                var num = Math.random();

                var arr = randomNum(35,7);

                json[num] = arr;

                oDiv.innerHTML = arr;

                window.location.hash = num;//给地址添加hash值

            };

            window.onhashchange = function(){

                oDiv.innerHTML = json[window.location.hash.substring(1)];

            };

            function randomNum(iAll,n){

                var arr = [];
                var newArr = [];
                for(var i=1;i<=iAll;i++){
                    arr.push(i);
                }

                for(var i=0;i < n; i++){
                    newArr.push( arr.splice( Math.floor(Math.random()*arr.length) ,1) );
                }

                return newArr;

            }

        };
        
```

**pushState**

html5自带的。



用法：

*（1）存数据*

将页面本次的数据存储。

pushState :

三个参数 ：数据 标题(都没实现) 地址(可选)

数据-----页面数据

地址-----更改网址的最后一级地址为指定的虚假地址

history.pushState(arr,'',arr);

*（2）读数据*

**popstate事件** : 读取数据 event.state

```
window.onpopstate = function(ev){

//ev.state

};
```

注意：

（1）服务器下运行。

（2）如果有地址参数。

网址是虚假的，需在服务器指定对应页面，不然刷新找不到页面。

```
            oInput.onclick = function(){

            	var arr = randomNum(35,7);

                //history.pushState(arr,'',arr)；
                history.pushState(arr,'');

                oDiv.innerHTML = arr;

            };

            window.onpopstate = function(ev){

                oDiv.innerHTML = ev.state;

                alert(ev.state);

            };
```