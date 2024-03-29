## http

::: tip HTTP

HTTP 是超文本传输协议，它定义了客户端和服务器之间交换报文的格式和方式，默认使用 80 端口。它使用 TCP 作为传输层协议，保证了数据传输的可靠性。

:::

### http/1.0/1.1/2.0 在并发请求的主要区别:

http是一种建立在tcp协议之上的应用层网络协议，用于客户端与服务端沟通。http2.0与1.x的区别：
1. http2.0采用二进制传输，1.x 采用文本传输。
2. 多路复用，http2.0可以并发请求。
3. header信息压缩，提高传输效率。
4. 允许服务器主动推送。

### http 与 https 的区别：

https是以安全为目标的http通道，简单的说就是http的安全版，也就是http下加入SSL层，主要作用有两种，一种是建立一个信息安全通道，保证数据传输的安全。另一种是确认网站的真实性。

主要区别有 
1. https协议需要ca申请证书，一般免费证书较少,需要一定费用。
2. http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
3. http和https用的是完全不同的连接方式，用的端口也不一样，前者是80，后者443。http的连接很简单，是无状态的，https协议是有SSL+HTTP协议构建的可进行加密传输，身份认证的网络协议。

### 解决跨域

1. jsonp 原理：动态创建一个script标签。利用script标签的src属性不受同源策略限制。因为所有的src属性和href属性都不受同源策略限制。可以请求第三方服务器数据内容。 步骤：
  1. 去创建一个script标签
  2. script的src属性设置接口地址
  3. 接口参数,必须要带一个自定义函数名 要不然后台无法返回数据。
  4. 通过定义函数名去接收后台返回数据
2. cors
3. node正向代理，比如请求/api 可以转接到同域的服务去访问/api，绕过浏览器同源策略，再返回前端
  1. 像vue的proxy，用 node 运行了一个服务器，底层用的http-proxy-middleware中间件。
4. nginx 反向代理，proxy_pass
5. image标签
6. document.domain + iframe：主域名相同，子域名不通，设置document.domain为主域名解决
7. postMessage

### tcp三次握手，四次挥手
三次握手为了让客户端与服务端知道自己与对方发送和接收消息的能力正常。
1. 第一次握手：客户端向服务端发送请求连接SYN，并带上自己的初始序列号seq=x;服务端知道自己的接收能力与客户端发送能力正常。
2. 第二次握手：服务端向客户端发送请求连接SYN，确认表示ACK，确认号ack = x + 1, 以及自己的序列号seq = y; 客户端知道自己的发送，接收能力以及服务端的发送接收能力正常。
3. 第三次握手：客户端向服务端发送确认ACK，确认号ack=y+1, 序列号seq = x + 1;服务端知道客户端与自己的发送接收能力正常。

四次挥手：四次挥手是为了客户端与服务端断开连接。

1. 第一次挥手：客户端向服务端发送断开连接FIN， 自己的序列号seq = u;
2. 第二次挥手：服务端接收到客户端报文后向客户端发送确认号ACK，自己的序列号seq = v;
3. 第三次挥手：客户端收到服务端确认之后，服务端又向客户端发送断开连接FIN，确认号ACK，ack=u+1,序列号 seq = w;
4. 第四次挥手：客户端向服务端发送确认ACK，确认号ack = w + 1,序列号 seq = u + 1,服务端收到之后立即断开，客户端会等待两个最长报文段寿命之后再断开连接。

### http缓存，浏览器缓存
http 缓存分为强缓存和协商缓存。http 缓存都是从第二次请求开始的。

第一次请求资源时，服务器返回资源，并在header中回传资源的缓存参数，第二次请求时，浏览器判断这些请求参数，击中强缓存就直接返回200，否则就把请求参数加到header中传给服务器，如果击中协商缓存，就返回304，否则服务器会返回新的资源。
