https://zhuanlan.zhihu.com/p/36678971

# 在 Windows 上衍生 .bat 和 .cmd 文件
child_process.exec() 和 child_process.execFile() 之间区别的重要性可能因平台而异。 在 Unix 类型的操作系统（Unix、Linux、macOS）上，child_process.execFile() 可以更高效，因为它默认不衍生 shell。 但是，在 Windows 上，.bat 和 .cmd 文件在没有终端的情况下无法自行执行，因此无法使用 child_process.execFile() 启动。 在 Windows 上运行时，.bat 和 .cmd 文件可以使用具有 shell 选项集的 child_process.spawn()、使用 child_process.exec()、或通过衍生 cmd.exe 并将 .bat 或 .cmd 文件作为参数传入（这也是 shell 选项和 child_process.exec() 所做的）来调用。 在任何情况下，如果脚本文件名包含空格，则需要加上引号。


# 异步进程的创建
`child_process.spawn()、child_process.fork()、child_process.exec() 和 child_process.execFile() `方法都遵循其他 Node.js API 典型的惯用异步编程模式。
每个方法都返回 ChildProcess 实例。 这些对象实现了 Node.js EventEmitter API，允许父进程注册在子进程的生命周期中发生某些事件时调用的监听器函数。
child_process.exec() 和 child_process.execFile() 方法还允许指定可选的 callback 函数，其在子进程终止时调用。


# 同步进程的创建
child_process.spawnSync()、child_process.execSync() 和 child_process.execFileSync() 方法是同步的，将阻塞 Node.js 事件循环，暂停任何其他代码的执行，直到衍生的进程退出。
像这样的阻塞调用对于简化通用脚本任务和在启动时简化应用程序配置的加载/处理非常有用。

# ChildProcess 类

### exec()、execSync()

```js
const {exec, execSync} = require('child_process')

execCommandSync('git status')

execCommandSync('git status')
function execCommand(command) {
    exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
    })
}
function execCommandSync(command) {
    try {
        var r = execSync(command)
        console.log(r.toString('utf8', 0, r.length - 1))
    } catch(e) {
        console.log('error: '+ command)
    }
}
```



### execFile、execFileSync

```js
const {execFile, execFileSync} = require('child_process')


execFileCommandSync('node', ['./1.js'])

function execFileCommand(file, args) {
    try {
        const child = execFile(file, args)

        // console.log(child)
        child.stdout.on('data', (data) => {
            console.log('stdout=========================')
            console.log(data.toString())
        })
    
        child.stderr.on('data', (data) => {
            console.log('stderr=========================')
            console.error(data.toString())
        })
    
        child.on('exit', (code) => {
            console.log(`子进程退出，退出码 ${code}`)
        })
    } catch(e) {
        console.log('err == ', e)
    }
}

function execFileCommandSync(file, args) {
    const child = execFileSync(file, args)
    console.log(child.toString('utf8', 0, child.length - 1))
}
```

