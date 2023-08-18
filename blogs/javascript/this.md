## 作用域

定义变量的区域，找到对应的定义的变量，就是作用域 JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域，***函数的作用域基于函数创建的位置***。
```js
// case 1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// case 2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();

```
### 作用域与作用域链

作用域：全局作用域、函数作用域、块级作用域。 可以隔离变量或函数，并控制生命周期。 作用域在函数执行上下文创建时定义好的，不是执行才定义（静态）！。

对于作用域链,其实就是向上找爹的一个过程。

当一个块或函数嵌套在另一个块或函数中时，发生了作用域嵌套。在当前函数中如果无法找到某个变量，就会往上一级嵌套的作用域中去寻找，直到找到该变量或抵达全局作用域，这样的链式关系称为作用域链

1. 对于作用域链我们直接通过创建时的层级结构来定位作用域链
2. 我们可以通过一些方式手动取消全局作用域，使用块级作用域， 比如立刻执行函数,let等

### 执行上下文

已知js引擎是一段一段去执行代码的，在当前有一个可执行的代码块就是执行上下文（execution context）， 执行上下文栈（先进后出）,说白了就是通过栈来维护代码的执行顺序，单线程执行。执行某个区域相当于入栈，执行完成后出

创建和执行是分开的

1. 创建阶段
  * 创建作用域链：当前变量、所有父级变量
  * 初始化：参数、变量、函数
  * content：指定this
2. 执行阶段
  * 变量赋值
  * 变量使用
  * 函数引用

## this指向
this是在执行时动态读取上下文决定的，而不是创建时

1. 函数直接调用,不管放在哪里,函数内部this指向的都是window => 变种方式(函数表达式、匿名函数、嵌套函数)
2. 在隐式绑定中,this指向的是调用堆栈的上一级 => 变种方式(对象、数组等引用关系逻辑（找到最后谁激活的我）)
3. call、apply时，this是第一个参数。bind要优与call/apply，call参数多，apply参数少
4. 在构造函数中，this是当前类的一个实例，异步方法内，指向的是window。
5. 箭头函数自身没this，需要看其外层上一级的this。
6. 默认绑定（函数直接调用）

#### 默认直接调用
```js
  function foo() {
    console.log('函数内部this', this);//window
  }
  foo();
```
#### 隐式绑定(函数被谁调用)
隐式绑定的 this 指的是调用堆栈的上一级（.前面一个）->被谁调用就指向谁
```js
function fn(){
  console.log(this.a)
}
const obj={
  a:1
}
obj.fn=fn //引用
obj.fn()//调用的时候 fn的上一级是obj
```

#### 显示绑定:bind apply call
```js
    function foo() {
        console.log('函数内部this', this);
    }
    foo();

    // 使用，更改this指向
    foo.call({a: 1},[1,2,3]);//源码会使用大量的call
    foo.apply({a: 1},1,2,3);//第一个参数为null||undefined的时候指向全局

    const bindFoo = foo.bind({a: 1},[1,2,3]);
    bindFoo();
```
apply call bind区别
1. call和apply区别是传参是不一样的，第一个参数都是改变的this的上下文。 第二个参数传参：apply是数组传入，call是依次传入传入
2. bind返回原函数的拷贝,先改变了作用域，没被执行，需要再次调用
  * bind第二个参数和apply一样，都是数组传入

#### new 创建实例
this指向的是new之后得到的实例
```js
    class Course {
        constructor(name) {
            this.name = name;
            console.log('构造函数中的this:', this);//指向 实例 
        }

        test() {
            console.log('类方法中的this:', this);//指向 实例
        }
    }

    const course = new Course('this');
    course.test();

```

### 实现bind | apply
```js
//手写bind => bind位置（挂在那里） => Function.prototype
Function.prototype.myBind = function () {
    //此时的this，指向调用的这个函数
    const _this = this
    //调用数组原型方法变成真数组
    let args = Array.prototype.slice.call(arguments)
    //args特点，第一项是新的this，第二项~最后一项函数传参，将第一项从数组弹出
    let newThis = args.shift()
    // a. 返回一个函数
    return function () {
        // b. 返回原函数执行结果 c. 传参不变
        return _this.apply(newThis, args)
    }
}

//手写apply
Function.prototype.myApply = function (context) {
    //边缘监测
    if (typeof this !== 'function') {
        throw new TypeError(this + 'is not a function')
    }
    // 参数检测
    context = context || window
    // 挂载执行函数
    context.fn = this
    // 执行函数，如果有参数就执行带参数的，否则直接调用
    let result = arguments[1] ? context.fn(...arguments[1]) : context.fn()
    //用后销毁临时挂载
    delete context.fn
    //结果返回出去
    return result
}

```

## 闭包
::: tip 突破作用域束缚
一个函数有权访问另一个函数作用域中的变量（函数引用了外部作用域的变量）。 一个函数和他周围状态的引用捆绑在一起的组合

能够访问自由变量的函数 在函数中使用的，既不是函数的参数，也不是函数局部变量的变量 闭包 = 函数 + 函数内部能够访问自由变量
:::

### 函数作为返回值的场景
函数外部获取到了函数作用域内的变量值
```js
    function mail() {
        let content = '信';
        return function() {
            console.log(content);
        }
    }
    const envelop = mail();
    envelop();

```
### 函数作为参数的时候
```js
    let content;
    //通用数据存储
    function envelop(fn) {
        content = 1
        fn()
    }

    //负责读，业务逻辑
    function mail() {
        console.log(content);
    }

    envelop(mail)//1
    envelop(mail)//1

```
### 函数嵌套 比如用作计数器
```js
    let counter = 0;

    function outerFn() {
        function innerFn() {
            counter++;
            console.log(counter);
            // ...
        }
        return innerFn;
    }
    outerFn()();

```
### 事件处理（异步执行）的闭包
```js
    let lis = document.getElementsByTagName('li');

    for(var i = 0; i < lis.length; i++) {
        (function(i) {//借用立刻执行函数，把i传进去
            lis[i].onclick = function() {
                console.log(i);
            }
        })(i);
    }

```

### 如何实现私有变量
也是闭包来实现
```js
    function createStack() {
        return {
            items: [],
            push(item) {
                this.item.push(item);
            }
        }
    }

    const stack = {
        items: [],
        push: function () { }
    }
    //做成私有的
    function createStack() {
        const items = [];
        return {
            push(item) {
                items.push(item);
            }
        }
    }
```

