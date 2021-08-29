### `ts-node`

1. `ts-node`是`tsc`和`node`的结合。相当于先执行`tsc`将`ts`文件编译成`js`文件，然后使用`node`执行编译生成的`js`文件。

   

### 问题

1. 当`tsconfig.json`设置`"module":"ESNext"`时报错

   ```js
   import NumberChain from "./chain/NumberChain";
   ^^^^^^
   
   SyntaxError: Cannot use import statement outside a module
   ```

   原因：本质原因是`node`不支持`import`

   解决：

   1. 将`"module":"ESNext"`改成`"module":"CommanJs"`
   2. `node13`可以运行
   3. 使用`babel`转换
   
2. 别名识别不了

