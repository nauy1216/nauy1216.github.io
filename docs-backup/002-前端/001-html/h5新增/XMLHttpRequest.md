### XMLHttpRequest Level2

XMLHttpRequest 的改进版,可以跨域。

标准浏览器下：
XMLHttpRequest对象已经是升级版本，支持了更多的特性，可以跨域了。
但是需要后端的配合。
在php文件上添加：
header('Access-control-Allow-origin:http://www....');
例子：

```
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    alert(xhr.responseText);
                }
            }
        }

        xhr.open('get', 'ajax.php', true);
        xhr.send();
        
```

IE浏览器下：



XDomainRequest对象:跨域（支持IE7+）

XMLHttpRequest:不跨域

事件：

onerror 请求错误

onload 请求成功

onprogress 请求进行中

ontimeout 请求超时

例子：

```
            var oXDomainRequest = new XDomainRequest();

            oXDomainRequest.onload = function() {
                alert(this.responseText);
            }

            oXDomainRequest.open('get', 'http://www.b.com/ajax.php', true);
            oXDomainRequest.send();
        
```

看文档。

实现无刷新上传?????????????????

FormData对象。