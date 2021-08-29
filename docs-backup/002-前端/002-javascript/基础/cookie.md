### cookie

定义 用于存储数据，当用户访问了某个网页的时候，我们就可以通过 cookie来访问这电脑上存储的数据。

1. 不同的浏览器存放的cookie位置不一样，不能通用。 cookie的存储是以域名的形式区分的。
2. cookie的数据可以设置名字 例如： document.cookie="名字=值",//写 document.cookie;//读取的是所有数据
3. 可以重复写多个”名字=值”，此时获取网站下的cookie时， 得到字符串形式的值，包含了当前网站下所有的cookie。 所有的cookie都是以“分号+空格”("; ")连接起来的。
4. 一个域名下存放的cookie数量是有限的，不同的浏览器存放 的个数不一样。
5. 每个cookie存放的内容大小也是有限制，不同的浏览器存放 的大小不一样
6. 如果我们想长时间存放一个cookie，需要在设置这个cookie 的时候同时设置一个过期的时间。
   cookie默认是临时存储的，当浏览器关闭时直接销毁。
   例如：
   var oDate = new Date();
   var d = 5;
   oDate.setDate(oDate.getDate()+d);
   document.cookie='age=32;expires='+oDate.toGMTString;
7. 内容最好编码存放
   编码：encodeURL()
   解码：decodeURL()
8. 获取cookie
   原理：拆分两次 split(‘; ’) split(‘=’)
   封装：
   setcookie()
   getcookie()
   removecookie()

### 例子

```
        //如果浏览器关闭后才会销毁数据
        //第一次打开时是空，第二次打开a=12; b=13
        alert(document.cookie)

        document.cookie = "a=12";
        document.cookie = "b=13";
        alert(document.cookie)
    
        //设置cookie，参数是key、val、存活时间
        function setcookie(key, val, da){
            var date = new Date();
            date.setDate(date.getDate() + da);
            document.cookie = key + "=" + val + ";expires=" + date.toGMTString();
        }

        function getcookie(key){
           var keyVal;
           var allCookie =  document.cookie.split("; ");
           for(var i=0; l=allCookie.length,i
```