# 查看版本号
```
docker -v
```

# 修改镜像源
```
daemon.json
```

# 查看
```
docker info
```

# image 文件

`Docker` 把应用程序及其依赖，打包在` image `文件里面。只有通过这个文件，才能生成` Docker `容器。`image `文件可以看作是容器的模板。`Docker `根据` image `文件生成容器的实例。同一个` image `文件，可以生成多个同时运行的容器实例。

`image `是二进制文件。实际开发中，一个` image `文件往往通过继承另一个` image `文件，加上一些个性化设置而生成。举例来说，你可以在` Ubuntu `的` image `基础上，往里面加入` Apache `服务器，形成你的` image`。

# 查看所有的image
```
docker image ls
```

# 删除指定image
```
docker image rm [imageName]
```

# 从远程仓库Docker Hub拉取镜像
```
docker image pull library/hello-world
```

# 运行image
```
docker container run hello-world
```
***注意，docker container run命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取。因此，前面的docker image pull命令并不是必需的步骤。***


# 停止容器的运行
```
docker container kill [containID]
```


# 容器文件
image 文件生成的容器实例，本身也是一个文件，称为容器文件。也就是说，一旦容器生成，就会同时存在两个文件： image 文件和容器文件。而且关闭容器并不会删除容器文件，只是容器停止运行而已。
```
列出本机正在运行的容器
$ docker container ls

列出本机所有容器，包括终止运行的容器
$ docker container ls --all
```

# 删除容器
终止运行的容器文件，依然会占据硬盘空间，可以使用docker container rm命令删除。
```
docker container rm [containerID]
```
# Dockerfile 文件

学会使用 image 文件以后，接下来的问题就是，如何可以生成 image 文件？如果你要推广自己的软件，势必要自己制作 image 文件。
这就需要用到 Dockerfile 文件。它是一个文本文件，用来配置 image。Docker 根据 该文件生成二进制的 image 文件。
下面通过一个实例，演示如何编写 Dockerfile 文件。


# 构建image
```
$ docker image build -t koa-demo .
# 或者
$ docker image build -t koa-demo:0.0.1 .
```


# 生成容器
docker container run命令会从 image 文件生成容器。

```
$ docker container run -p 8000:3000 -it koa-demo /bin/bash
# 或者
$ docker container run -p 8000:3000 -it koa-demo:0.0.1 /bin/bash
```















































