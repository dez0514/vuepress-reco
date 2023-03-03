# npm-link

## 作用

`npm link` 可以用来调试测试本地开发的依赖包。

npm 提供的标准做法是，我们完成依赖包（或组件）的开发后，登录`npm login`， 发布`npm publish`，成功后去npm查看是否发布成功，然后在项目里 `npm install xxx` 来完成引用。

但是 如果依赖包有修改，需要改包的版本重走一遍上述过程，并且项目里需要重新`npm install xxx`，相对来说会造成bug修复版本过多，对引用到包的项目也需要重新install，比较麻烦。

使用 `npm link` 就可以在本地完成链接和引用。并且更新时，所有引用会同步更新，不需要重新引用。

## 示例用法

1. 创建两个项目，一个依赖包，一个引用该依赖的项目。暂时放一块(根目录：npmlink-test)便于终端shell切换目录，也可以放不同目录。
![](/engineer/testmodule.png)

2. 创建一个依赖包项目根目录，例如：testModule，使用 `npm init` 初始化配置生产 `package.json` 文件。在目录下创建 `index.js` 文件，例如：

```js
module.exports = {
  name: "testModule",
  sayHello: function(){
    console.log("hello testModule");
  }
}
```

3. 创建项目，就用简单node.js项目举例， 例如：myProject， main.js。

```js
var myModule = require("testModule");
console.log(myModule.name);
myModule.sayHello();
```
此时在终端进入myProject目录，使用 `node main.js` 运行项目， 肯定会报错，找不到模块。
![](/engineer/err.png)

4. 使用 `npm link` 链接到模块。
首先进入依赖包根目录（testModule）， 终端shell运行 `npm link`， 会看到`testModule`中新增了`package-lock.json`文件，
并且 `nodejs` 环境 `node_modules` 目录中添加了`testModule的快捷方式`，由于是快捷方式，所以修改`testModule`时也不需要再重复的link。

![](/engineer/link.png)

此时`testModule`包已经可以被项目引用了，所以进入 myProject 目录，将依赖包与项目链接起来。执行 `npm link testModule`

![](/engineer/link.png)

会看到 `myProject` 中出现了 `node_modules` 并且里面有了`testModule的快捷方式`

此时再运行 myProject 就能正常运行。

![](/engineer/dev.png)

## 解绑 npm unlink
不想使用时，可以使用 `npm unlink` 来解绑。项目解绑，进入myProject目录执行 `npm unlink testModule`，会删掉`node_modules`中的`testModule快捷方式`。解绑依赖包，进入testModule目录执行`npm unlink`，会删掉nodejs环境的`node_modules`中的`testModule快捷方式`。

## npm link 使用全局安装的模块

上面的例子中`npm link`用来使用自己开发模块。使用npm的模块，也可以使用npm link命令。

比如多个项目都用到 test-script 模块：
第一步，将test-script安装到全局模式下。
npm install test-script -g

第二步，在`每一个`要开发的应用中，连接全局安装的test-script。
```shell
cd project1:
npm link test-script
cd project2:
npm link test-script
...
```

执行 `npm update test-script -g` 更新全局模式的test-script，所有link过去的项目同时更新了。

注意：`npm install -g` 只是安装到全局目录了，只是命令行可以使用，每个项目还是需要将包引用到node_modules才能require使用，所以还是需要每个项目都 `npm link`
