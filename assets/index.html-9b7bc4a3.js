import{_ as i,p as e,q as l,s as t,G as a,J as h}from"./framework-4a7f5a2b.js";const s={},p=t("h2",{id:"http",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#http","aria-hidden":"true"},"#"),a(" http")],-1),r=t("div",{class:"custom-container tip"},[t("svg",{xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 24 24"},[t("g",{fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[t("circle",{cx:"12",cy:"12",r:"9"}),t("path",{d:"M12 8h.01"}),t("path",{d:"M11 12h1v4h1"})])]),t("p",{class:"custom-container-title"},"HTTP"),t("p",null,"HTTP 是超文本传输协议，它定义了客户端和服务器之间交换报文的格式和方式，默认使用 80 端口。它使用 TCP 作为传输层协议，保证了数据传输的可靠性。")],-1),o=h('<h3 id="http-1-0-1-1-2-0-在并发请求的主要区别" tabindex="-1"><a class="header-anchor" href="#http-1-0-1-1-2-0-在并发请求的主要区别" aria-hidden="true">#</a> http/1.0/1.1/2.0 在并发请求的主要区别:</h3><p>http是一种建立在tcp协议之上的应用层网络协议，用于客户端与服务端沟通。http2.0与1.x的区别：</p><ol><li>http2.0采用二进制传输，1.x 采用文本传输。</li><li>多路复用，http2.0可以并发请求。</li><li>header信息压缩，提高传输效率。</li><li>允许服务器主动推送。</li></ol><h3 id="http-与-https-的区别" tabindex="-1"><a class="header-anchor" href="#http-与-https-的区别" aria-hidden="true">#</a> http 与 https 的区别：</h3><p>https是以安全为目标的http通道，简单的说就是http的安全版，也就是http下加入SSL层，主要作用有两种，一种是建立一个信息安全通道，保证数据传输的安全。另一种是确认网站的真实性。</p><p>主要区别有</p><ol><li>https协议需要ca申请证书，一般免费证书较少,需要一定费用。</li><li>http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。</li><li>http和https用的是完全不同的连接方式，用的端口也不一样，前者是80，后者443。http的连接很简单，是无状态的，https协议是有SSL+HTTP协议构建的可进行加密传输，身份认证的网络协议。</li></ol><h3 id="解决跨域" tabindex="-1"><a class="header-anchor" href="#解决跨域" aria-hidden="true">#</a> 解决跨域</h3><ol><li>jsonp 原理：动态创建一个script标签。利用script标签的src属性不受同源策略限制。因为所有的src属性和href属性都不受同源策略限制。可以请求第三方服务器数据内容。 步骤：</li><li>去创建一个script标签</li><li>script的src属性设置接口地址</li><li>接口参数,必须要带一个自定义函数名 要不然后台无法返回数据。</li><li>通过定义函数名去接收后台返回数据</li><li>cors</li><li>node正向代理，比如请求/api 可以转接到同域的服务去访问/api，绕过浏览器同源策略，再返回前端</li><li>像vue的proxy，用 node 运行了一个服务器，底层用的http-proxy-middleware中间件。</li><li>nginx 反向代理，proxy_pass</li><li>image标签</li><li>document.domain + iframe：主域名相同，子域名不通，设置document.domain为主域名解决</li><li>postMessage</li></ol><h3 id="tcp三次握手-四次挥手" tabindex="-1"><a class="header-anchor" href="#tcp三次握手-四次挥手" aria-hidden="true">#</a> tcp三次握手，四次挥手</h3><p>三次握手为了让客户端与服务端知道自己与对方发送和接收消息的能力正常。</p><ol><li>第一次握手：客户端向服务端发送请求连接SYN，并带上自己的初始序列号seq=x;服务端知道自己的接收能力与客户端发送能力正常。</li><li>第二次握手：服务端向客户端发送请求连接SYN，确认表示ACK，确认号ack = x + 1, 以及自己的序列号seq = y; 客户端知道自己的发送，接收能力以及服务端的发送接收能力正常。</li><li>第三次握手：客户端向服务端发送确认ACK，确认号ack=y+1, 序列号seq = x + 1;服务端知道客户端与自己的发送接收能力正常。</li></ol><p>四次挥手：四次挥手是为了客户端与服务端断开连接。</p><ol><li>第一次挥手：客户端向服务端发送断开连接FIN， 自己的序列号seq = u;</li><li>第二次挥手：服务端接收到客户端报文后向客户端发送确认号ACK，自己的序列号seq = v;</li><li>第三次挥手：客户端收到服务端确认之后，服务端又向客户端发送断开连接FIN，确认号ACK，ack=u+1,序列号 seq = w;</li><li>第四次挥手：客户端向服务端发送确认ACK，确认号ack = w + 1,序列号 seq = u + 1,服务端收到之后立即断开，客户端会等待两个最长报文段寿命之后再断开连接。</li></ol><h3 id="http缓存-浏览器缓存" tabindex="-1"><a class="header-anchor" href="#http缓存-浏览器缓存" aria-hidden="true">#</a> http缓存，浏览器缓存</h3><p>http 缓存分为强缓存和协商缓存。http 缓存都是从第二次请求开始的。</p><p>第一次请求资源时，服务器返回资源，并在header中回传资源的缓存参数，第二次请求时，浏览器判断这些请求参数，击中强缓存就直接返回200，否则就把请求参数加到header中传给服务器，如果击中协商缓存，就返回304，否则服务器会返回新的资源。</p>',17),c=[p,r,o];function n(d,x){return e(),l("div",null,c)}const _=i(s,[["render",n],["__file","index.html.vue"]]);export{_ as default};
