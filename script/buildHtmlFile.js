const path = require('path')
const fs = require('fs')

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
  <base href="${baseUrl}" />
  <title>liuchengyuan</title>
</head>
<body>
  ${htmlStr}
</body>
</html>
`
fs.writeFile(path.resolve(process.cwd(), 'index.html'), htmlStr, function () {

})


function build(dir) {
  let dirChildList = fs.readdirSync(dir)
  dirChildList.forEach(child => {
    let isDir = fs.statSync(path.resolve(dir, child))
    if (isDir.isDirectory()) {
      htmlStr += `<li>${child}<ul>`
      build(path.resolve(dir, child))
      htmlStr += `</ul></li>`
    } else {
      let relativeUrl = dir.split('\\docs\\')[1].replace(/\\/g, '/')
      let url = relativeUrl + '/' + child
      htmlStr += `<li><a href="${url}">${child}</a></li>`
    }
  })
}

console.log(htmlStr)