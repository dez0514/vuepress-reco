# vue-router


## Router 发展历史

路由的概念，是伴随 SPA 出现的。在此之前，页面的跳转是通过服务器端进⾏控制的；
* 传统的页面的跳转，是通过前端向后台发送请求 
* 后台通过模板引擎的渲染，将⼀个新的 html 界面 
* ⽐如页面跳转时：
  - from 表单的提交； 
  - a 标签的默认属性； 
  - js 调⽤ location.href，给其赋值； 
  - H5: history 的 go / forward / back -- // history.push / replace ?
* 在 SPA（即只有⼀个 html ） 的出现后，前端可以⾃由控制组件的渲染，来模拟页面的跳转。
  - 页面是怎么发⽣跳转，向服务端请求的呢？-- 浏览器劫持
  - SPA的⽅法，需要拦截请求；
    - hash 路由，当我的hash
    - history 的 go / forward / back 的时候，我的浏览器的地址，是发⽣了改变的，
:::tip 总结
后端路由是根据 url 访问相关的 controller 进⾏数据资源和模板引擎的拼接，返回前端；

前端路由是通过 js 根据 url 返回对应的组件加载。 
所以，前端的路由包含两个部分： 
- url 的处理
- 组件加载
:::

### 路由的分类

* history 路由 
* hash 路由 
* memory 路由 * 

### hash 路由
window.location.hash = "xxx" 

hash 的出现,他有以下⼏种特性：
1. url 中的 hash 值只是客⼾端/浏览器端的⼀种状态，向服务器发送请求的时候，hash 部分的值不 会携带。 
2. hash 值的更改，并不会导致页面的刷新
3. hash 值的更改，会在浏览器的访问历史中增加记录，所以我们可以通过浏览器的回退、前进按钮 控制 hash 的切换 
4. hash 值的更改，会触发 hashchange 事件 

⽐如https://www.baidu.com/#/hash1, 改变#后面的内容并不会导致页面刷新，⽽且会触发 hashchange 事件。 

我们同样有两种⽅式来控制 hash 的变化： 

1. 通过 a 标签，设置 href 属性，当⽤⼾点击 a 标签的时候，Url 中的 hash 就会改变为 href 属性 值。
2. 通过 js location.hash = '#hash-change'
### history 路由

hash 虽然能解决问题，但是带有#很不美观。 

历史的⻋轮⽆情撵过 hash，到了 html5 时代，推出了 history api。

history./\(go|back|repalce|push|forward)/
```js
window.history.back(); // 后退 
window.history.forward(); // 前进 
window.history.go(-3); // 后退三个页面 
window.history.pushState(null, null, path); 
window.history.replaceState(null, null, path);
```