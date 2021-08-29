### 触发历史管理

1.通过跳转页面
用户连续访问不同网址，浏览器自动记录历史记录。

2.hash
hash:
网址#后面的东西。
原理：
不同的hash值关联不同的内容， 根据某一个hash值通过这种关联找到相应的内容。 不同的hash值访问同一个页面不同的历史数据。 特点：
（1）网址没有改变。改变的是网址的数据。
（2）一个hash值对应一组页面数据。
（3）当在新的窗口访问再次访问同一个页面时，就算有hash 值也找不到对应的数据。由此可知，改变hash值时并没有刷新页面。 window.location.hash="";//给地址加上一个hash值



#### onhashchange事件：

当hash值发生变化时触发。

window.onhashchange=functiion(){

//window.location.hash

根据此时的hash值找到对应的历史内容。

}

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

3.pushState

html5自带的。

用法：

（1）存数据

将页面本次的数据存储。

pushState :

三个参数 ：数据 标题(都没实现) 地址(可选)

数据-----页面数据

地址-----更改网址的最后一级地址为指定的虚假地址

history.pushState(arr,'',arr);

（2）读数据

popstate事件 : 读取数据 event.state

window.onpopstate = function(ev){

//ev.state

};

注意：

（1）服务器下运行。

（2）如果有地址参数。

网址是虚假的，需在服务器指定对应页面，不然刷新找不到页面。

```js
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