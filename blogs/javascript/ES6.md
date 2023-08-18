---
title: ES6
date: 2023/02/16
tags:
 - tag3
---

ES6：ECMAScript6.0，2015年6月正式发布，又名：ES2015。JavaScript语言的下一代标准。

参考地址：[https://es6.ruanyifeng.com/#README](https://es6.ruanyifeng.com/#README)

## 常用API
* let 和 const
* 解构赋值
* 扩展
* 箭头函数
* class语法糖

## let 和 const：

1. const用来声明常量。
2. 块级作用域。
3. 不存在变量提升，暂时性死区。要先声明再使用。
4. 不允许重复声明赋值。

### const
const 保证的是变量指向的内存地址所保存的数据不得改变，对于复合类型的数据（对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的，不能控制数据结构是否可变。

```javascript
// 对象
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
console.log(foo.prop) // 123
// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
// 数组
const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```

### let
let 的用法和var类似，但是let声明的变量只在let命令所在的代码块级作用域。

```javascript
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```
暂时性死区：只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```javascript
var tmp = 123;
if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}


// 不报错
var x = x;
// 报错
let x = x; // 使用let声明变量时，只要变量在还没有声明完成前使用，就会报错。
// ReferenceError: x is not defined
```

## 解构赋值
### 数组的解构赋值

```javascript
let [a, b, c] = [1, 2, 3];
//嵌套解构
let [foo, [[bar], baz]] = [1, [[2], 3]];
//解构赋值允许指定默认值。
let [foo = true] = [];
foo // true
let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

var [x,y,m]=[3,4];
console.log(m);//解构不成功为undefind

```

### 对象的解构赋值

```javascript
//对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
//默认值
var {x = 3} = {};
```
### 字符串解构赋值
```javascript
//字符串的解构赋值
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
//类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值
let {length : len} = 'hello';
len // 5

```

## 扩展
Es6增加了许多扩展：字符串扩展，正则扩展，数值扩展，函数扩展，数组扩展，对象扩展，运算符扩展等。
* 常用的字符串扩展：模版字符串 `Hello ${name}, how are you ${time}?`
* 常用的数组扩展：（...,Array.from,Array.of,find,findIndex,include）
* 常用的函数扩展：（默认值，rest参数...，箭头函数）
* 常用的对象扩展（扩展运算符...,Object.assign,Object.keys(obj)，Object.values(obj), Object.entries(obj)取键值对数组）

1. 扩展运算符：`...`
```javascript
console.log(...[1, 2, 3])
// 1 2 3
console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5
[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```
2. Array.from()：用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。
```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
// ES5 的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6 的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```
3. Array.of()方法用于将一组值，转换为数组。
```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```
4. 箭头函数
```javascript
const test = (a, b) => {
    return a + b
}
const test = (a, b) => a + b
```
使用箭头函数应注意什么？
* 箭头函数并不会形成独立上下文,函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象。普通函数里的this是使用的时候决定的
* 不可以当做构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
* 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以使用rest参数代替
* 不可以使用yield命令，因此箭头函数不能用作Genertor函数。

场景：
1. dom操作cb,tn.addEventListener('click', () => {}
2. 类操作
  * 箭头函数不能用作构造函数
  * 箭头函数无法构造原型方法，没prototype属性

## class语法糖

### 定义class
```javascript
//类声明
class Person { }
//类表达式
const Animal = class { }
```
### 函数和class区别
* 函数声明可以提升，但是类不行。
* 函数受函数作用域限制，而类受块作用域限制

::: tip 类的构成
  包含构造函数方法、实例方法、获取函数get、设置函数set和静态类方法staic。 
:::

### constructor：构造函数

在创建类的新实例的时候，会调用这个函数。

使用new 调用类的构造函数会执行如下操作

1. 在内存创建一个空对象
2. 将这个对象的内部的prototype指针被赋值为构造函数的prototype属性
3. 构造函数内部this指向新对象
4. 执行构造函数内部代码，（给新对象添加属性）
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的对象

### 静态类方法 static
用于执行不特定于实例的操作，也不要求存在类的实例，在使用中 static作为前缀关键字， 比如Promise.resolve()等。

* 可以使用set和get函数

### 继承

通过extends关键字继承

使用super可以调用父类构造函数

## async
Generator 函数的语法糖。async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

## Proxy
proxy在目标对象的外层搭建了一层拦截，外界对目标对象的某些操作，必须通过这层拦截
```javascript
var proxy = new Proxy(target, handler);
```
new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
### Proxy的作用
对于代理模式 Proxy 的作用主要体现在三个方面

* 拦截和监视外部对对象的访问
* 降低函数或类的复杂度
* 在复杂操作前对操作进行校验或对所需资源进行管理

## Reflect 
一些语言内部的方法会放到Reflect对象上，例如defineObject
        
## Set和Map
Set可以用来数组去重，Map提供一种特殊的数据结构吧，可以以数组对象作为键的对象

weakSet: 弱引用，接受一个数组或者对象作为参数，数组的成员只能是对象

weakMap: 与weakSet类似，键名只能是对象类型，不计入垃圾回收机制

## Symbol类型
一种新的原始数据类型，表示独一无二的类型，从根本上防止属性名的冲突

## Moudle
模块语法，导入导出