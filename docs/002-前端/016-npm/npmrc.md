# 查看.npmrc文件的位置
```shell
npm config list
# 也可以直接使用
npm config get userconfig
```
找到`userconfig`字段。

# 修改配置
```shell
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass
phantomjs_cdnurl=http://cdn.npm.taobao.org/dist/phantomjs
puppeteer_download_host=https://storage.googleapis.com.cnpmjs.org
# @scope1/package1将从https://cnpm.scope1.cn/下载
@scope1:registry=https://cnpm.scope1.cn/
DISTURL=https://npm.taobao.org/dist
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
mozjpeg_binary_site=https://npm.taobao.org/mirrors/mozjpeg-bin
optipng_binary_site=https://npm.taobao.org/mirrors/optipng-bin
sentrycli_cdnurl=https://npm.taobao.org/mirrors/sentry-cli
@scope2:registry=https://cnpm.scope2.cn
//cnpm.codemao.cn/:_password="**********"
//cnpm.codemao.cn/:username=********
//cnpm.codemao.cn/:email=**********
//cnpm.codemao.cn/:always-auth=true

ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
@scope:registry=https://gitlab.******.cn/******
//gitlab.******.cn/******:_authToken="AccGFWN8EJSFDD1sJYgf"
```