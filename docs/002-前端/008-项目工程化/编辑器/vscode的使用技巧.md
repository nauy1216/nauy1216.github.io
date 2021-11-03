### 类型检查JavaScript 

VS Code允许您在常规JavaScript文件中利用TypeScript的一些高级类型检查和错误报告功能。这是捕获常见编程错误的好方法。

在JavaScript文件中启用类型检查的最简单方法是添加`// @ts-check`到文件顶部。

```js
// @ts-check
let itsAsEasyAs = 'abc';
itsAsEasyAs = 123; // Error: Type '123' is not assignable to type 'string'
```

使用`// @ts-check`是一个很好的方法，如果你只是想尝试一些文件类型检查，但尚未启用它的整个代码库。



### vscode调试

调试： https://c.lanmit.com/Webqianduan/JavaScript/12038.html
`

```
{`
    `// 使用 IntelliSense 了解相关属性。` 
    `// 悬停以查看现有属性的描述。`
    `// 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387`
    `"version": "0.2.0",`
    `"configurations": [`
        `{`
            `"type": "node",`
            `"request": "launch",`
            `"name": "启动程序",`
            `"skipFiles": [`
                `"<node_internals>/**"`
            `],`
            `"env":{`
                `"NODE_ENV":"development",`
                `"UNI_PLATFORM":"h5"`
            `},`
            `"args": ["uni-serve"],`
            `"program": "${file}"`
        `}`
    `]`
`}
```

