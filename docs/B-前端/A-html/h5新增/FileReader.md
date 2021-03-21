### FileReader

作用：读取文件信息和内容。
readAsDataURL
参数为要读取的文件对象，将文件读取为DataUrl。

onload
当读取文件成功完成的时候触发此事件。

this. result
来获取读取的文件数据，如果是图片，将返回base64格式的图片数据。

例子：拖放外部文件：

将文件拖放到这里



```js
<div id="div" style="width:200px;height:200px;background:red;">将文件拖放到这里</div>
<ul id="ul"></ul>


<script>
    var oDiv = document.querySelector('#div');
    var oUl = document.querySelector('#ul');

    oDiv.ondragenter=function(){
        this.innerHTML='可以释放啦';
    };
    oDiv.ondragover=function(ev){
        ev.preventDefault();
    }
    oDiv.ondragleave=function(){
        this.style.cssText='green';
        this.innerHTML='将文件拖放到这里';
    };
    oDiv.ondrop=function(ev){
        this.innerHTML='将文件拖放到这里';
        ev.preventDefault();

        var fs = ev.dataTransfer.files;//获取文件列表,释放目标获取拖拽目标。

        for(var i=0;i<fs.length;i++){
            //alert(fs.length);
            var fd = new FileReader();//异步操作所以要创建多个对象
            fd.readAsDataURL(fs[i]);//读取文件

            fd.onload=function(){//读取成功
                var oLi = document.createElement('li');
                var oImg = document.createElement('img');
                oImg.src=this.result;//可以直接将图片数据给url，和给地址不一样。
                oLi.appendChild(oImg);
                oUl.appendChild(oLi);
                oUl.style.display="block";
            };
        }
    };
</script>

        
```

