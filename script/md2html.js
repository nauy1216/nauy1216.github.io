/**
 * markdown文件转html页面
 * @constructor
 */
class Md2Html {
  constructor(fileName) {
    this.fs = require('fs'); //文件模块
    this.path = require('path'); //路径模块
    this.marked = require('marked'); //md转html模块
    this.request = require('request'); //http请求模块
    this.fileName = fileName;
    this.target = this.path.resolve(process.cwd(), fileName + '.md');
    this.watchFile();
  }

  /**
  * 检测文件改动
  */
  watchFile() {
    this.fs.watchFile(this.target, {
      persistent: true, //是否持续监听
      interval: 200, //刷新间隔
    }, (curr, prev) => {

      if (curr.mtime == prev.mtime) { //比较修改时间，判断保存后内容是否真的发生了变化
        return false;
      }

      this.fs.readFile(this.target, 'utf-8', (err, data) => { //读取文件

        if (err) {
          throw err;
        }

        const html = this.marked(data); //将md内容转为html内容
        let template = this.createTemplate();
        template = template.replace('{{{content}}}', html); //替换html内容占位标记


        this.createMarkdownCss(css => {
          template = template.replace('{{{style}}}', css); //替换css内容占位标记
          this.createFile(template);

        });
      });
    });
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
          <title>${this.fileName}</title>
          <link href="http://cdn.bootcss.com/highlight.js/9.15.10/styles/github-gist.min.css" rel="stylesheet">  
          <style>
              .markdown-body {
                  box-sizing: border-box;
                  min-width: 200px;
                  max-width: 980px;
                  margin: 0 auto;
                  padding: 45px;
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
            <script src="http://cdn.bootcss.com/highlight.js/9.15.10/highlight.min.js"></script>  
          </body>
      </html>`;
    return template;
  }

  /**
   * 读取css内容
   * @param {function} fn 回调函数
   */
  createMarkdownCss(fn) {
    var url = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css';
    this.request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        fn && fn(body);
      }
    });
  }


  /**
   * 创建html文件
   * @param {string} content 写入html的文件内容
   */
  createFile(content) {
    const outfile = this.path.resolve(process.cwd(), this.fileName + '.html');

    this.fs.writeFile(outfile, content, 'utf-8', err => {
      if (err) {
        throw err;
      }
      console.log('写入成功！');
    });
  }

}

new Md2Html('docs/java/javaSE');