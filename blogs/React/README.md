## React
单向响应的数据流 − React 实现了单向响应的数据流，从而减少了重复代码，这也是它为什么比传统数据绑定更简单

### jsx
React 使用 JSX 来替代常规的 JavaScript，JSX 是一个看起来很像 XML 的 JavaScript 语法扩展，其实就是将js和html结合起来书写。

### class组件生命周期

1. 初始化阶段 initialization, 比如constructor 
2. 组件挂载阶段 mount
  * componentWillMount 组件挂载到DOM前调用,只会被调用一次, 这里写setState不会引起组件重新渲染
  * render 返回一个react元素, react根据此函数的返回值渲染DOM. 不能在这里setState
  * componentDidMount 组件挂载到DOM后调用, 且只会被调用一次
3. 更新阶段 update
  * componentWillReceiveProps(nextProps) 触发于props引起的组件更新过程中
  * shouldComponentUpdate(nextProps, nextState) 比较之前和当前的props state是否有变化
  * componentWillUpdate(nextProps, nextState) render方法前执行
  * render
  * componentDidUpdate(preProps, preState)
4.卸载阶段 unmount
  * componentWillUnmount 卸载前调用, 在这里可以清理一些定时器

### 事件机制：
答 ：React并不是将click事件绑在该div的真实DOM上，而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数运行。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。
另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 event.preventDefault。

### Hooks
规则限制: 只在React最顶层使用，不能在循环，条件，或者嵌套函数中使用。指的是 useXXX 不能在if中使用，不是指定义的 setXXX 方法不能在if中使用。
基础： useState, useEffect, useContext
额外的：useReducer, useCallback, useMemo, useRef, useImperativeHandle, useLayoutEffect, useDebugValue

1. 常用的用法：useReducer + useContext， 利用二者结合来实现`局部`中的全局数据管理。效果类似 redux。
2. useMemo： 类似vue的计算属性computed，返回一个 memoized 值。
```js 
// a, b 为依赖项，当依赖项变化时才会变化，否则使用缓存的
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
3. useCallback：缓存函数。返回一个 memoized 回调函数。
```js
// a, b 为依赖项，当依赖项变化时才会变化，否则使用缓存的
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
4. useImperativeHandle：类似于vue3的defineExpose， 暴露出子组件，在父组件调用ref, 来调用子组件的方法。
```js
// 用法： useImperativeHandle(ref, createHandle, [deps])
// useImperativeHandle 可以在使用 ref 时自定义暴露给父组件的实例值。
// 在大多数情况下，应当避免使用 ref 这样的命令式代码。
// useImperativeHandle 应当与 forwardRef 一起使用：
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);

// 在 渲染 <FancyInput ref={inputRef} /> 的父组件可以调用 inputRef.current.focus()。

```

5. useLayoutEffect：尽可能使用标准的 useEffect 以避免阻塞视觉更新。

说明：其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

6. useDebugValue：用于在 React 开发者工具中显示自定义 hook 的标签。

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ...
  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

### React原理
* 虚拟 DOM
* 组件化和声明式编程
* Reconciliation（协调）

### React的diff算法是怎么完成的
1. 把树形结构按照层级分解，只比较同级元素。
2. 通过给列表结构的每个单元添加的唯一 key值进行区分同层次的子节点的比较。
3. React 只会匹配相同 class 的 component（这里面的 class 指的是组件的名字）
4. 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 dirty。到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制。
5. 选择性渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能。

### redux
redux 的数据流：用户页面行为触发一个action（用到dispatch），然后store自动调用reducer，并传入两个参数，当前state和收到的action，reducer会返回一个新的state，每当state更新之后，view会根据state 触发重新渲染。
react-redux的实现原理：主要两个核心是
  * Provider: 从最外面封装整个应用，并向connect模块传递store。
  * Connect: 
    1. 包装原组件，将state和action通过props的方式传入原组件内部。
    2. 监听store tree变化，使其包装的原组件可以响应state变化

redux异步中间件：redux-trunk， redux-saga 利用 applyMiddleware 将中间件添加到store上。