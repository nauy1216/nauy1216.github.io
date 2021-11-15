- https://segmentfault.com/a/1190000039045541
- https://juejin.cn/post/6844904190913822727
- https://help.aliyun.com/document_detail/27101.htm?spm=a2c4g.11186623.0.0.435e2acbrkPfxf#section-wql-p2l-56f
- https://zhuanlan.zhihu.com/p/113037678

# 什么是CDN？
CDN 即内容分发网络（Content Delivery Network）的简称，是建立在承载网基础上的虚拟分布式网络，能够将源站内容（包括各类动静态资源）智能缓存到全球各节点服务器上。

- 这样不仅方便了用户就近获取内容，提高了资源的访问速度。
- 也分担了源站压力。



### 加速域名

加速域名指需要使用 CDN 加速的域名。加速域名也是一个域名。加速域名一般配置 CNAME 记录，指向 CDN 网络节点。普通域名一般配置 A 记录，指向提供服务的业务服务器。

- 加速域名一般配置成我们自己的域名。
- 然后将加速域名的CNAME配置成CDN网络节点域名。

比如说加速域名`cdn.staticfile.org`。

```shell
#  使用dig cdn.staticfile.org查询

;; ANSWER SECTION:
cdn.staticfile.org.	56	IN	CNAME	iduwdjf.qiniudns.com.
iduwdjf.qiniudns.com.	283	IN	CNAME	importantglobalcdnweb.qiniu.com.w.cdngslb.com.
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.219
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.218
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.215
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.221
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.220
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.216
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.217
importantglobalcdnweb.qiniu.com.w.cdngslb.com. 60 IN A 14.215.172.222


```

- `cdn.staticfile.org`配置了CNAME为`iduwdjf.qiniudns.com`
- `CNAME	iduwdjf.qiniudns.com`配置了CNAME为`importantglobalcdnweb.qiniu.com.w.cdngslb.com`
- `importantglobalcdnweb.qiniu.com.w.cdngslb.com`指向了多个IP地址。



### 源站

提供原始资源（使用 CDN 加速的资源）的业务服务器，可以指定为域名或 IP 地址。



### 回溯

CDN 节点未缓存资源，或者缓存资源已过期时，回到源站获取资源，返回给客户端。





### 接入流程

假设我建立了一个网站，域名为 `www.tt.com`，用户访问的主页链接为 `www.tt.com/idx.html`。为了缓解服务端压力和加快访问速度，决定使用阿里云 `CDN` 服务。 为了更好地理解工作原理，先了解一下 CDN 的接入流程。

### 接入流程

主要接入步骤如下：

1. 到某域名供应商处申请一个加速域名：`js.tt.com`。
2. 到阿里云 CDN 平台添加加速域名 `js.tt.com`，同时设置其源站域名为 `www.tt.com`。
3. 阿里云 CDN 平台自动分配一个 `CNAME` 域名：`js.tt.com.ali.com`。
4. 到域名供应商处给加速域名 `js.tt.com` 添加 `CNAME` 记录，其值为上一步得到的 `CNAME` 域名：`js.tt.com.ali.com`。

对以上步骤做进一步说明：

- 为了使用 CDN，必需另外再申请一个加速域名，作为使用 CDN 的入口。
- 加速域名配置的是 `CNAME` 记录，值为 CDN 平台提供的 `CNAME` 域名，该 `CNAME` 域名指向 CDN 系统节点。
- 添加加速域名时需要配置源站域名，据此，CDN 平台保存了加速域名与源站域名的映射关系。
- CNAME 域名的格式一般是：<加速域名> + <供应商主域名>。

### 







# CDN的作用

- 加速网站的访问

- 为了实现跨运营商、跨地域的全网覆盖

互联不互通、区域ISP地域局限、出口带宽受限制等种种因素都造成了网站的区域性无法访问。CDN加速可以覆盖全球的线路，通过和运营商合作，部署IDC资源，在全国骨干节点商，合理部署CDN边缘分发存储节点，充分利用带宽资源，平衡源站流量。阿里云在国内有500+节点，海外300+节点，覆盖主流国家和地区不是问题，可以确保CDN服务的稳定和快速。

- 为了保障你的网站安全

CDN的负载均衡和分布式存储技术，可以加强网站的可靠性，相当无无形中给你的网站添加了一把保护伞，应对绝大部分的互联网攻击事件。防攻击系统也能避免网站遭到恶意攻击。

- 为了异地备援

当某个服务器发生意外故障时，系统将会调用其他临近的健康服务器节点进行服务，进而提供接近100%的可靠性，这就让你的网站可以做到永不宕机。





> 总结

- CDN的基本思路就是尽可能避开互联网上有可能影响数据传输速度和稳定性的瓶颈和环节，使内容传输的更快，更稳定。
- CDN便是让用户以最短的路径，最快的速度对网站进行访问，减少源站中心的负载压力。