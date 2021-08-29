### 1

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            var draw = SVG().addTo('body').size(300, 300)
            var rect = draw.rect(100, 100).attr({ fill: '#f06' })
        </script>
    </body>
</html>
```



### 2

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            var draw = SVG().addTo('body').size(300, 300)
            // 1、attr设置属性
            // 2、stroke的默认宽度是1px
            // 3、划线时与canvas一样都是从中间往两边画，所以当x=y=0时， 上边和左边的边框都是0.5px, 另外的0.5px被遮住了
            var rect = draw.rect(100, 100).attr({ 
                stroke: '#f06', 
                fill: '#fff', 
                x:0.5, 
                y:0.5, 
                'stroke-width': 0.5,
                width: 200,
                height: 200 
            })
        </script>
    </body>
</html>
```



### 3

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            // 创建svg对象
            var parent = SVG()
            parent.size(300, 300)
            parent.addTo('#drawing')

            // 创建rect对象
            var rect = parent.rect(100, 100).attr({ fill: '#f06' })
            
            // 获取svg对象
            console.log(SVG('#drawing'))
        </script>
    </body>
</html>
```



### 4

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            /*
                svg文档嵌套
            */
            // 创建svg文档对象
            var parent = SVG()
            parent.size(300, 300)
            parent.addTo('#drawing')

            // 创建rect对象
            var rect = parent.rect(100, 100).attr({ fill: '#f06' })
            
            // 创建嵌套的svg文档对象
            var nested = parent.nested()
            // 在嵌套的svg文档对象内创建rect对象
            var rect = nested.rect(20, 20).attr({ fill: 'green', x:150,y:150 })
        </script>
    </body>
</html>
```





### 5

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            /*
                分组
            */
            // 创建svg文档对象
            var parent = SVG()
            parent.size(300, 300)
            parent.addTo('#drawing')

            // 创建一个group对象
            // 在创建group或rect时既可以通过构造函数创建也可以直接调用 parent.group 或 parent.rect创建
            // 区别是通过构造函数创建需要手动添加进文档
            var group = new SVG.G()
            var rect1 = new SVG.Rect(100, 100).attr({
                width:50,
                height: 50,
                x: 0,
                y:0,
                fill: '#e0e0e0'
            })
            var rect2 = new SVG.Rect(100, 100).attr({
                width:50,
                height: 50,
                x: 100,
                y: 100,
                fill: '#e0e0e0'
            })
            group.add(rect1)
            group.add(rect2)

            parent.add(group)

            console.log(SVG, 'SVG')
        </script>
    </body>
</html>
```



### 6

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            /*
                Symbol
            */
            // 创建svg文档对象
            var draw = SVG()
            draw.size(300, 300)
            draw.addTo('#drawing')

            // 定义symbol
            var symbol = draw.symbol()
            symbol.rect(10, 10).attr({ 
                fill: '#f06'
            })
            symbol.rect(10, 10).attr({ 
                fill: '#f06'
            })

            // 复用定义的symbol
            var use  = draw.use(symbol).move(50, 50)

            // var x = 0
            // setInterval(() => {
            //     draw.use(symbol).move(x++, 50)
            // }, 50)

            console.log(SVG, 'SVG')
        </script>
    </body>
</html>
```



### 7

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            /*
                defs
            */
            // 创建svg文档对象
            var draw = SVG()
            draw.size(300, 300)
            draw.addTo('#drawing')

            // 定义图形
            var rect = draw.defs().rect(100, 100).fill('#f09')
            // 使用
            var use = draw.use(rect)
            use.move(100, 100)
            // 使用
            var use1 = draw.use(rect)
            // use1.move(0, 0)
            //当rect修改时，use也会跟着修改
            rect.animate(1000).fill('#f90');
        </script>
    </body>
</html>
```



### 8

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
    </head>
    <body>
        <div id="drawing"></div>
        <script>
            /*
                链接
            */
            // 创建svg文档对象
            var draw = SVG()
            draw.size(300, 300)
            draw.addTo('#drawing')

            var link = draw.link('http://svgdotjs.github.io/')
            var rect = link.rect(100, 100).fill('#f09')
        </script>
    </body>
</html>
```



### 9

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <!-- 不是必须 -->
        <!-- <script src="https://cdn.bootcss.com/svg.js/3.0.13/polyfills.js"></script> -->
        <!-- 注意svg.js2.0和3.0不兼容 -->
        <script src="https://cdn.bootcss.com/svg.js/3.0.13/svg.js"></script>
        <style>
            input {
                
            }
        </style>
    </head>
    <body>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <foreignObject x="20" y="20" width="160" height="160">
              <input type="text" style="width: 100px;" />
            </foreignObject>
          </svg>
        <div id="drawing"></div>
        <script>
            /*
                foreignObject 在svg内使用html
            */
            // 创建svg文档对象
            var draw = SVG()
            draw.size(300, 300)
            draw.addTo('#drawing')

            // var link = draw.link('http://svgdotjs.github.io/')
            // var rect = link.rect(100, 100).fill('#f09').attr({
            //     x: 200,
            //     y: 200
            // })

            var foreignObject = draw.foreignObject(100, 100)
            // var p = SVG('<p>hdsfhdjfh</p>')
            // // p.size(100, 100)
            // p.attr({
            //     width: 100,
            //     height: 100,
            //     // style: 'line-height: 100px'
            // })
            // console.log(p)
            // foreignObject.add(p)
            

            // input标签不可用， 可以使用input标签定位
            var input = SVG('<input type="text" xmlns="http://www.w3.org/1999/xhtml" />')
            input.attr({
                width: 100,
                height: 100,
                // style: 'line-height: 100px'
            })
            foreignObject.add(input)
        </script>
    </body>
</html>
```

