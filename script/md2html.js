const fs = require('fs')
const path = require('path')
const marked = require('marked')
const request = require('request')

class Md2Html {
  constructor(title, fileAbsolutePath) {
    this.title = title
    this.filePath = fileAbsolutePath
    this.transformFile()
  }

  /**
  * 转换文件
  */
  transformFile() {
    fs.readFile(this.filePath, 'utf-8', (err, data) => { //读取文件
      if (err) {
        throw err
      }
      const html = marked(data) //将md内容转为html内容
      let template = this.createTemplate()
      template = template.replace('{{{content}}}', html) //替换html内容占位标记
      this.createMarkdownCss(css => {
        template = template.replace('{{{style}}}', css) //替换css内容占位标记
        this.createFile(template)
      })
    })
  }


  /**
   * 创建页面模板
   * @returns {string} 页面骨架字符串
   */

  createTemplate() {
    const template = `<!DOCTYPE html>
      <html>
          <head>
          <meta charset="utf-8" >
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${this.title}</title>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github-gist.min.css" rel="stylesheet">  
          <style>
              .markdown-body {
                  box-sizing: border-box;
                  min-width: 200px;
                  max-width: 980px;
                  margin: 0 auto;
                  padding: 45px;
              }
              .markdown-body img {
                  box-sizing: border-box !important;
                  margin:10px 0 10px 2%;
                  padding: 20px;
                  width: 96%;
                  border-radius: 4px;
                  box-shadow: 0 0 6px 0px #999;
              }
              @media (max-width: 767px) {
                  .markdown-body {
                      padding: 15px;
                  }
              }
              {{{style}}}
          </style>
          <script>
              window.onload = function() {
                hljs.initHighlighting()
              }
          </script>
          </head>
          <body>
            <article class="markdown-body">
                {{{content}}}
            </article> 
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>  
          </body>
      </html>`
    return template
  }

  /**
   * 读取css内容
   * @param {function} callback 回调函数
   */
  createMarkdownCss(callback) {
    const markdownCssPath = path.resolve(process.cwd(), 'static/github-markdown.css')
    try {
      if (!Md2Html.markdownCss) {
        Md2Html.markdownCss = fs.readFileSync(markdownCssPath).toString()
        console.log('读取本地 css 成功')
      }
      callback && callback(Md2Html.markdownCss)
    } catch (e) {
      let url = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css'
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('github-markdown.css 请求成功！')
          fs.writeFile(markdownCssPath, body, err => {
            if (!err) {
              console.log('github-markdown.css 保存到本地成功！')
              callback && callback(body)
            } else {
              console.log(err)
            }
          })
        }
      })
    }
  }


  /**
   * 创建html文件
   * @param {string} content 写入html的文件内容
   */
  createFile(content) {
    const outfile = this.filePath.replace(/\.md$/, '.html')
    fs.writeFile(outfile, content, 'utf-8', err => {
      if (err) {
        throw err
      }
    })
  }

}
Md2Html.markdownCss = ''

module.exports = function transform(pageTitle, filePath) {
  new Md2Html(pageTitle, filePath)
}
