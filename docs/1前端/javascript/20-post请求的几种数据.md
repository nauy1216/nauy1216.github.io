# post请求的四种数据格式
协议规定 POST 提交的数据必须放在消息主体（entity-body）中，但协议并没有规定数据必须使用什么编码方式。
实际上，开发者完全可以自己决定消息主体的格式，只要最后发送的 HTTP 请求满足上面的格式就可以。
但是，数据发送出去，还要服务端解析成功才有意义。一般服务端语言如 php、python 等，以及它们的 framework，都内置了自动解析常见数据格式的功能。
服务端通常是根据请求头（headers）中的 Content-Type 字段来获知请求中的消息主体是用何种方式编码，再对主体进行解析。
所以说到 POST 提交数据方案，包含了 Content-Type 和消息主体编码方式两部分。

### application/x-www-form-urlencoded
浏览器的原生 form 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。
- 首先，Content-Type 被指定为 application/x-www-form-urlencoded；
- 其次，提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码。大部分服务端语言都对这种方式有很好的支持。

例如：
```js
POST http://www.example.com HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
```
### 3. multipart/form-data
首先生成了一个 boundary 用于分割不同的字段，为了避免与正文内容重复，boundary 很长很复杂。
然后 Content-Type 里指明了数据是以 mutipart/form-data 来编码，本次请求的 boundary 是什么内容。
消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 –boundary 开始，紧接着内容描述信息，然后是回车，
最后是字段具体内容（文本或二进制）。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 –boundary– 标示结束。
```js
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryfERI6l1QeXO8bzwW
------WebKitFormBoundaryfERI6l1QeXO8bzwW
Content-Disposition: form-data; name="apictype"

1
------WebKitFormBoundaryfERI6l1QeXO8bzwW
Content-Disposition: form-data; name="file"; filename="pay-success.png"
Content-Type: image/png


------WebKitFormBoundaryfERI6l1QeXO8bzwW--
```

### 4. application/json

### 5. text/xml