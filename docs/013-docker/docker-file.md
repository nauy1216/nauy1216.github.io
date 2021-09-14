```shell
# 将node作为基础镜像
FROM node:14.16.1

# ENV 环境变量。设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。
# 使用：
# 在这里定义的环境变量，在前端项目打包构建时可以使用到
ENV REACT_APP_NODE_VERSION 14.16.1
ENV REACT_APP_ENV development

# ARG
# 构建参数，与 ENV 作用一致。不过作用域不一样。ARG 设置的环境变量仅对 Dockerfile 内有效，也就是说只有 docker build 的过程中有效，构建好的镜像内不存在此环境变量。
# 构建命令 docker build 中可以用 --build-arg <参数名>=<值> 来覆盖。
ARG mode ""

# VOLUME
# 定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。
# 作用：
# 1. 避免重要的数据，因容器重启而丢失，这是非常致命的。
# 2. 避免容器不断变大。
# VOLUME [ "/" ]

# docker build 时运行
RUN echo $NODE_VERSION

# 复制指令，从上下文目录中复制文件或者目录到容器里指定路径。
COPY . /app

# 设置/app为工作目录，类似与cd
# 指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。
# docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。只有通过 WORKDIR 创建的目录才会一直存在。
WORKDIR /app

# 设置npm仓库地址
RUN npm config set registry http://registry.npm.taobao.org

# 安装依赖
RUN npm install

# 暴露端口
# 仅仅只是声明端口。
# 作用：
# 帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。
# 在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。
EXPOSE 9527

# 类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，
# 而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。
# 但是, 如果运行 docker run 时使用了 --entrypoint 选项，将覆盖 CMD 指令指定的程序。
# 优点：在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。
# 注意：如果 Dockerfile 中如果存在多个 ENTRYPOINT 指令，仅最后一个生效。
ENTRYPOINT ["npm", "run"]

# CMD 类似于 RUN 指令，用于运行程序，但二者运行的时间点不同:
# CMD 在docker run 时运行。
# RUN 是在 docker build。
# 作用：
# 1. 为启动的容器指定默认要运行的程序，程序运行结束，容器也就结束。
# 2. CMD 指令指定的程序可被 docker run 命令行参数中指定要运行的程序所覆盖。
# 注意：
# 如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效。
CMD ["start"]
```