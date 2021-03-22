### 过渡

transition：
transition-property:要运动的属性样式
-all 所有的属性
-[attr] 指定的样式
-none 无
transition-duration:运动的时间
transition-delay:延迟时间
transition-timing-function:运动形式
-ease（默认） 逐渐变慢
-linear 匀速
-ease-in 加速
-ease-out 减速
-ease-int-out 先加速后减速
-cubic-bezier 贝塞尔曲线

作用：实现运动的过渡，注重过程,从一个状态到另一个状态。
用法：transition:1s 1s width ease,1s 1s height ease;
运动时间
延迟时间
属性
运动形式

注意：
（1）不同属性运动过渡用逗号隔开。
（2）只需要将这个命令放入css语句中即可
（3）transition的作用是让运动过渡，所以不管是通过什么样的方式 运动均能实现过渡的效果。

过渡完成事件：
transitionend:每个样式过渡完成一次就触发一次,所以可能会触发多次。
兼容问题：
webkit内核：
obj.addEventListen('webkitTransitionEnd',fn,false);
ff:
obj.addEventListen('transitionEnd',fn,false);
例子：

```
        var oDiv = document.getElementById('box');

        oDiv.addEventListener('webkitTransitionEnd',fn,false);

        function fn(){
            alert(1);
        }
       
```

怎么解决每次过渡完成一个样式就触发一次transitionend事件？？

```
        var oDiv = document.getElementById('box');

        oDiv.addEventListener('webkitTransitionEnd',fn,false);

        function fn(){

            var w= getComputedStyle(this).width

            if(w=='200px'){//只需判断 自己想要监听的属性是否达到最终结果即可

                alert(1);

            }

        }
        
```

