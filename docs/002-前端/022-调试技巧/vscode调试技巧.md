 调试： https://c.lanmit.com/Webqianduan/JavaScript/12038.html
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "env":{
                "NODE_ENV":"development",
                "UNI_PLATFORM":"h5"
            },
            "args": ["uni-serve"],
            "program": "${file}"
        }
    ]
}
```