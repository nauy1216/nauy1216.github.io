### 1、注册npm账号

```
npm adduser
```

### 2、登陆npm

```
npm login
```

### 3、切换回原始的npm镜像

```
npm config set registry https://registry.npmjs.org/

// 淘宝镜像
npm config set registry https://r.npm.taobao.org/
https://r.npm.taobao.org/
```

### 4、发布

```
npm publish
```

发现报了下面的错误：

```
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT http://registry.npmjs.org/nauy-jschain - Forbidden
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
```

解决方案：首次注册，没有验证邮箱，去邮箱按步验证，再次发布即可解决

注意：

1. 包名称不要与npm已有包重名
2. 以@开头的包比如@vue是某个机构的名称， 需要付费。