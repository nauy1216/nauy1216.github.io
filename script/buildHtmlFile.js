const path = require('path')
const fs = require('fs')
const transform = require('./md2html')

start()

function start() {
  transformAllMd2Html()
  createIndexHtml()
}

function transformAllMd2Html() {
  const rootDir = path.resolve(process.cwd(), 'docs')
  transformDeep(rootDir)

  function transformDeep(dir) {
    let dirChildList = fs.readdirSync(dir)
    dirChildList.forEach(child => {
      let isDir = fs.statSync(path.resolve(dir, child)).isDirectory()
      if (!isDir && /\.md$/.test(child)) {
        transform(child, path.resolve(dir, child))
        console.log('file: ', path.resolve(dir, child))
      }
      if (isDir) {
        transformDeep(path.resolve(dir, child))
      }
    })
  }
}

function createIndexHtml() {
  const baseUrl = 'https://github.com/chengyuan1216/chengyuan1216.github.io/blob/master/docs/'
  const rootDir = path.resolve(process.cwd(), 'docs')
  let htmlStr = `<ul>`
  build(rootDir)
  htmlStr += `</ul>`
  htmlStr = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>liuchengyuan</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        display: flex;
      }
      #menu {
        width: 300px;
        height: 100vh;
        overflow: auto;
        flex: 0 0 300px;
      }
      #content {
        flex: 1 1 100%;
        border: none;
      }
      ul {
        font-size: 16px;
        font-weight: 700;
        color: #333;
        list-style: none;
        margin:  0 0 10px 0;
        padding: 0 0 0 10px;
      }
      li {
        margin: 4px 0 0 0;
        font-size:14px;
        font-weight: normal;
      }
    </style>
  </head>
  <body>
    <div id="menu">
    ${htmlStr}
    </div>
    <iframe id="content"></iframe>
    <script>
    var oMenu = document.body.querySelector("#menu")
    console.log(oMenu, "oMenu")
    var oContent = document.body.querySelector("#content")
    var oA = document.body.querySelector("a")
    oContent.src = oA.getAttribute("data-href")
    oMenu.onclick = function(ev) {
      if (ev.target.getAttribute("data-href")) {
        oContent.src = ev.target.getAttribute("data-href")
      }
    }
    </script>
  </body>
  </html>
  `
  fs.writeFile(path.resolve(process.cwd(), 'index.html'), htmlStr, function () {
    console.log('index.html 更新成功！')
  })

  function build(dir) {
    let dirChildList = fs.readdirSync(dir)
    const noBuildList = ['image', 'source']
    dirChildList.forEach(child => {
      let isDir = fs.statSync(path.resolve(dir, child))
      if (isDir.isDirectory()) {
        if (!noBuildList.includes(child)) {
          htmlStr += `<li>${child}<ul>`
          build(path.resolve(dir, child))
          htmlStr += `</ul></li>`
        }
      } else {
        console.log(dir)
        let relativeUrl = dir.split('\\docs\\')[1].replace(/\\/g, '/')
        let url
        if (/.html$/.test(child)) {
          url = 'docs' + '/' + relativeUrl + '/' + child
          htmlStr += `<li><a href="javascript:void" data-href="${url}">${child.split('.')[0]}</a></li>`
        } else if (!/.md$/.test(child)) {
          url = baseUrl + '/' + relativeUrl + '/' + child
          htmlStr += `<li><a href="javascript:void" data-href="${url}">${child}</a></li>`
        }
        // htmlStr += `<li><a href="${url}">${child.split('.')[0]}</a></li>`
      }
    })
  }
}