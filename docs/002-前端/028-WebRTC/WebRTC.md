- https://webrtc.org.cn/webrtc-tutorial-basic/
- https://github.com/ChenYilong/WebRTC/blob/master/WebRTC%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/WebRTC%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B.md
- https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API


# 测试
- https://webrtc-from-chat.glitch.me/
- https://webrtc.github.io/samples/

# 什么是WebRTC？
1. WebRTC（网页实时通信技术）是一系列为了建立端到端文本或者随机数据的规范，标准，API和概念的统称。
2. 这些对等端通常是由两个浏览器组成，但是WebRTC也可以被用于在客户端和服务器之间建立通信连接，或者在任何其他可以实施WebRTC标准的设备之间进行通信建立。


# 什么是ICE?
https://zhuanlan.zhihu.com/p/60684464
https://datatracker.ietf.org/doc/html/rfc5245


# STUN 
1. NAT 的会话穿越功能`Session Traversal Utilities for NAT (STUN) `(缩略语的最后一个字母是 NAT 的首字母) 是一个允许位于 NAT 后的客户端找出自己的公网地址，判断出路由器阻止直连的限制方法的协议。
2. P2P网络要求通信双方都能主动发起访问，但是NAT设备的存在，却阻断了这种主动访问，导致P2P应用无法正常运行。STUN是一种解决P2P应用NAT穿越问题的常用技术。它允许网络设备找出通信端点经NAT设备后的IP地址和端口号，并利用这些信息在通信双方之间建立一条可以穿越NAT设备的数据通道，实现P2P通信。

# NAT
- https://zhuanlan.zhihu.com/p/140067897

​ NAT（Network Address Translation，网络地址转换)
1. 当在专用网内部的一些主机本来已经分配到了本地IP地址（即仅在本专用网内使用的专用地址），但现在又想和因特网上的主机通信（并不需要加密）时，可使用NAT方法。
2. 这种方法需要在专用网连接到因特网的路由器上安装NAT软件。装有NAT软件的路由器叫做NAT路由器，它至少有一个有效的外部全球IP地址。这样，所有使用本地地址的主机在和外界通信时，都要在NAT路由器上将其本地地址转换成全球IP地址，才能和因特网连接。
3. 另外，这种通过使用少量的公有IP 地址代表较多的私有IP 地址的方式，将有助于减缓可用的IP地址空间的枯竭。
4. 

# TURN
- https://zhuanlan.zhihu.com/p/71025431


# 信令服务器
- https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Session_lifetime#%E5%88%9B%E5%BB%BA%E8%BF%9E%E6%8E%A5

# SDP描述
> WebRTC 连接上的端点配置称为`会话描述`。 该描述包括关于要发送的媒体类型，其格式，正在使用的传输协议，端点的 IP 地址和端口以及描述媒体传输端点所需的其他信息的信息。 使用会话描述协议(SDP) 来交换和存储该信息; 如果您想要有关 SDP 数据格式的详细信息，可以在`RFC 2327`中找到。


1. 会话描述协议`Session Description Protocol (SDP) `是一个描述多媒体连接内容的协议，例如分辨率，格式，编码，加密算法等。所以在数据传输时两端都能够理解彼此的数据。本质上，这些描述内容的元数据并不是媒体流本身。
2. 从技术上讲，SDP 并不是一个真正的协议，而是一种数据格式，用于描述在设备之间共享媒体的连接。
3. 当用户对另一个用户启动 WebRTC 调用时，将创建一个称为提议(offer) 的特定描述。 该描述包括有关呼叫者建议的呼叫配置的所有信息。 接收者然后用应答(answer) 进行响应，这是他们对呼叫结束的描述。 以这种方式，两个设备彼此共享以便交换媒体数据所需的信息。 该交换(`这里指的事媒体数据交换`)是使用交互式连接建立 (`ICE`)(ICE处理的，这是一种协议，即使两个设备通过网络地址转换 (NAT)。
4. 每个对等端保持两个描述：描述本身的本地描述和描述呼叫的远端的远程描述。



# 交换 ICE 候选人


# 什么是提议(offer)/应答(answer)和信号通道？
作为连接发起者的同伴 A 将创建一个`提议`。 然后他们将使用所选择的`信号通道`将此提议发送给对等体 B. 对等体 B 将从信号通道接收提议并创建`应答`。 然后，它们将沿着信号通道发送回对等体 A。


# 什么是 ICE 候选地址？
1. 除了交换关于媒体的信息 (上面提到的 Offer / Answer 和 SDP ) 中，对等体必须交换关于网络连接的信息。 这被称为 ICE 候选者，并详细说明了对等体能够直接或通过 TURN 服务器进行通信的可用方法。 
2. 通常，每个对点将优先提出最佳的 ICE 候选，逐次尝试到不佳的候选中。 理想情况下，候选地址是 UDP(因为速度更快，媒体流能够相对容易地从中断恢复 )，但 ICE 标准也允许 TCP 候选。