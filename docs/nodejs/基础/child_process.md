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

