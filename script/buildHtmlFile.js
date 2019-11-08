const path = require('path')
const fs = require('fs')

const rootDir = path.resolve(process.cwd(), 'docs')
let parentTag = 'ul'
let htmlStr = `<ul>`
build(rootDir, parentTag)
htmlStr += `</ul>`

function build(dir) {
  let dirChildList = fs.readdirSync(dir)
  dirChildList.forEach(child => {
    let isDir = fs.statSync(path.resolve(dir, child))
    // let tag = parentTag === 'ul' ? 'li' : 'ul'
    if (isDir.isDirectory()) {
      htmlStr += `<li>${child}<ul>`
      build(path.resolve(dir, child))
      htmlStr += `</ul></li>`
    } else {
      htmlStr += `<li>${child}</li>`
    }
  })
}

console.log(htmlStr)