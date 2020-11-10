### 代码字符串与AST的转换

```js
// code string -> ast
const babylon = require('babylon')
// ast -> code string 
const generator = require('babel-generator').default

const fs = require('fs')

let code = fs.readFileSync(__dirname + '/code1.js', 'utf8')

// 将代码字符串解析成AST
let result = babylon.parse(code, {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    // sourceFilename: '',
    plugin: []
})

// console.log(result)

// 根据AST生成代码字符串
let r_code = 'let a = 1;'
let result_code = generator(result, {
    auxiliaryCommentBefore: '****before*****',
    auxiliaryCommentAfter: '****after*****' 
}, r_code)

// console.log(result_code)
console.log(result_code.code)
console.log(r_code)
```



### babel-template

```jsx
const template = require('babel-template')
const generator = require('babel-generator').default
const t = require('babel-types')


let code = `
<div class="timer">
  <div>{time}</div>
</div>
`

let build = template(code, {
    plugins: [
        'jsx'
    ]
})

const ast = build({
    // IMPORT_NAME: t.identifier("myModule"),
    // SOURCE: t.stringLiteral("my-module")
    'time': t.identifier('t1')
});
   
console.log(generator(ast).code);
/* <div class="timer">
  <div>{t1}</div>
</div>; */
```



### babel-types

```js
const types = require('babel-types')
const generator = require('babel-generator').default

let te = types.templateElement({
    raw: "qq",
    cooked: "qq"
}, true)

console.log(te)
let tl = types.templateLiteral([te], [])
console.log(tl)

let result= generator(tl)
console.log(result.code)
```



### babel.transform

```js
const babel = require('babel-core')
const t = require('babel-types')

const code = `
  if(3>5) {}
`

const visitor = {
  BinaryExpression(path) {
    if(path.node.operator === '>') {
      path.replaceWith(
        t.binaryExpression(
          '<=',
          path.node.left,
          path.node.right
        )
      );
    }
  }
}

// 在将code转换成AST的同时, 也会调用visitor来修改AST
const result = babel.transform(code, {
  plugins: [
    { visitor }
  ]
})

console.log(result.code)
```

