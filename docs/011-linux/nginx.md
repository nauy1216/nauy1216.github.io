- https://learnku.com/articles/46372


# 负载均衡
由于 Nginx 除了作为常规的 Web 服务器外，还会被大规模的用于反向代理商前台，由于 Nginx 的异步框架可以解决很大的并发请求，把这些并发请求 hold 住之后即可以分发给后端服务端 (backend servers, 后面简称 backend) 来做复杂的计算、解决和响应，并且在业务量添加的时候可以方便地扩容后端服务器。
