## Promise，异步编程的一种解决方案。
### 规范 [PromiseA+规范](https://promisesaplus.com/)
* promise 是一个有then法的对象或者是函数，行为遵循本规范
* thenable 是一个有then方法的对象或者是函数
* value 是promise状态成功时的值，也就是resolve的参数, 包括各种数据类型, 也包括undefined/thenable或者是 promise
* reason 是promise状态失败时的值, 也就是reject的参数, 表示拒绝的
* exception 是一个使用throw抛出的异常值

### 两个特点: 三种状态。
1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。
```javascript
const promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
注意：Promise 新建后就会立即执行。
```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});
promise.then(function() {
  console.log('resolved.');
});
console.log('Hi!');
// Promise
// Hi!
// resolved
```

## 实现Promise

### 用class来实现
```javascript
class MyPromise {
    constructor() {

    }
}
```
### 定义三种状态类型
```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```
### 设置初始状态
```javascript
class MyPromise {
    constructor() {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;
    }
}
```
### resolve 和 reject 方法
1. 根据刚才的规范, 这两个方法是要更改status的, 从pending改到fulfilled/rejected.
2. 注意两个函数的入参分别是value 和 reason.
```javascript
class MyPromise {
    constructor() {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;
    }

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }
}
```
### promise添加入参函数
promise添加入参函数,在初始化promise的时候函数同步执行，有任何异常需reject出去
```javascript
class MyPromise {
    constructor(fn) {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;

        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }
}
```
### 实现一下关键的then方法
1. then接收两个参数, onFulfilled 和 onRejected
```javascript
then(onFulfilled, onRejected) {}
```
2. 检查并处理参数, 之前提到的如果不是function, 就忽略. 这个忽略指的是原样返回value或者reason.
```javascript
isFunction(param) {
    return typeof param === 'function';
}

then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
}
```
3. then的返回值整体是一个promise, 先用promise来包裹一下，然后返回出去
```javascript
then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
    const promise2 = new MyPromise((resolve, reject) => {})
    return promise2
}
```
4. 根据当前promise的状态, 调用不同的函数
```javascript
then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
    const promise2 = new MyPromise((resolve, reject) => {
        switch (this.status) {
            case FULFILLED: {
                realOnFulfilled()
                break;
            }
            case REJECTED: {
                realOnRejected()
                break;
            }
        }
    })
    return promise2

}
```
5. 当前代码在then函数被调用的瞬间就会执行. 那这时候如果status还没变成fulfilled或者rejected怎么办？ 很有可能还是pending的. 所以需要一个状态的监听机制, 当状态变成fulfilled或者rejected后, 再去执行callback.
  1. 那么首先要拿到所有的callback, 然后才能在某个时机去执行他. 新建两个数组, 来分别存储成功和失败的回调, 调用then的时候, 如果还是pending就存入数组.
  ```javascript
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
    const promise2 = new MyPromise((resolve, reject) => {
        switch (this.status) {
            case FULFILLED: {
                realOnFulfilled()
                break;
            }
            case REJECTED: {
                realOnRejected()
                break;
            }
            case PENDING: {
                this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled)
                this.REJECTED_CALLBACK_LIST.push(realOnRejected)
            }
        }
    })
    return promise2
  }
  ```
  1. 当status发生变化的时候, 就执行所有的回调. 这里用一下es6的getter和setter. 这样更符合语义, 当status改变时, 去做什么事情. (当然也可以顺序执行, 在给status赋值后, 下面再加一行forEach)
  ```javascript
    _status = PENDING;

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = newStatus;
        switch (newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value);
                });
                break;
            }
            case REJECTED: {
                this.REJECTED_CALLBACK_LIST.forEach(callback => {
                    callback(this.reason);
                });
                break;
            }
        }
    }
  ```

6. then的返回值 上面只是简单说了下, then的返回值是一个Promise, 那么接下来具体讲一下返回promise的value和reason是什么.
  1. 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e。(这样的话, 我们就需要手动catch代码，遇到报错就reject)
  ```javascript
  then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
          return value
      }
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
          throw reason;
      };
      const promise2 = new MyPromise((resolve, reject) => {
          const fulfilledMicrotask = () => {
              try {
                  realOnFulfilled(this.value);
              } catch (e) {
                  reject(e)
              }
          };
          const rejectedMicrotask = () => {
              try {
                  realOnRejected(this.reason);
              } catch (e) {
                  reject(e);
              }
          }

          switch (this.status) {
              case FULFILLED: {
                  fulfilledMicrotask()
                  break;
              }
              case REJECTED: {
                  rejectedMicrotask()
                  break;
              }
              case PENDING: {
                  this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask)
                  this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask)
              }
          }
      })
      return promise2
  }
  ```
  2. 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
  3. 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因。需要注意的是，如果promise1的onRejected执行成功了，promise2应该被resolve这里之前已经在参数检查的时候做过了, 也就是这段代码
  ```javascript
  const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
    return value
  }
  const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
      throw reason;
  };
  ```
  4. 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行resolvePromise方法
  ```javascript
  then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
          return value
      }
      const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
          throw reason;
      };
      const promise2 = new MyPromise((resolve, reject) => {
          const fulfilledMicrotask = () => {
              try {
                  const x = realOnFulfilled(this.value);
                  this.resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                  reject(e)
              }
          };
          const rejectedMicrotask = () => {
              try {
                  const x = realOnRejected(this.reason);
                  this.resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                  reject(e);
              }
          }

          switch (this.status) {
              case FULFILLED: {
                  fulfilledMicrotask()
                  break;
              }
              case REJECTED: {
                  rejectedMicrotask()
                  break;
              }
              case PENDING: {
                  this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask)
                  this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask)
              }
          }
      })
      return promise2
  }

  ```
7. resolvePromise
```javascript
resolvePromise(promise2, x, resolve, reject) {
    // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
    // 这是为了防止死循环
    if (promise2 === x) {
        return reject(new TypeError('The promise and the return value are the same'));
    }

    if (x instanceof MyPromise) {
        // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
        // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
        queueMicrotask(() => {
            x.then((y) => {
                this.resolvePromise(promise2, y, resolve, reject);
            }, reject);
        })
    } else if (typeof x === 'object' || this.isFunction(x)) {
        // 如果 x 为对象或者函数
        if (x === null) {
            // null也会被判断为对象
            return resolve(x);
        }

        let then = null;

        try {
            // 把 x.then 赋值给 then 
            then = x.then;
        } catch (error) {
            // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(error);
        }

        // 如果 then 是函数
        if (this.isFunction(then)) {
            let called = false;
            // 将 x 作为函数的作用域 this 调用
            // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
            try {
                then.call(
                    x,
                    // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                    (y) => {
                        // 需要有一个变量called来保证只调用一次.
                        if (called) return;
                        called = true;
                        this.resolvePromise(promise2, y, resolve, reject);
                    },
                    // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
            } catch (error) {
                // 如果调用 then 方法抛出了异常 e：
                if (called) return;

                // 否则以 e 为据因拒绝 promise
                reject(error);
            }
        } else {
            // 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 如果 x 不为对象或者函数，以 x 为参数执行 promise
        resolve(x);
    }
}

```
8. onFulfilled 和 onRejected 是微任务。可以用queueMicrotask包裹执行函数
```javascript
const fulfilledMicrotask = () => {
    queueMicrotask(() => {
        try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
            reject(e)
        }
    })
};
const rejectedMicrotask = () => {
    queueMicrotask(() => {
        try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
            reject(e);
        }
    })
}
```
9. catch方法
```javascript
catch (onRejected) {
    return this.then(null, onRejected);
}
```
10. 简单写点代码测试一下
```javascript
const test = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000);
}).then(console.log);

console.log(test);

setTimeout(() => {
  console.log(test);
}, 2000)

```
### Promise.resolve
将现有对象转为Promise对象，如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为fulfilled。 注意这是一个静态方法, 因为咱们是通过Promise.resolve调用的, 而不是通过实例去调用的.
```javascript
static resolve(value) {
    if (value instanceof MyPromise) {
        return value;
    }
    return new MyPromise((resolve) => {
        resolve(value);
    });
}
```
### Promise.reject
返回一个新的Promise实例，该实例的状态为rejected。Promise.reject方法的参数reason，会被传递给实例的回调函数。
```javascript
static reject(reason) {
    return new MyPromise((resolve, reject) => {
        reject(reason);
    });
}
```
### Promise.race
`const p = Promise.race([p1, p2, p3]);`
该方法是将多个 Promise 实例，包装成一个新的 Promise 实例。 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
```javascript
static race(promiseList) {
    return new MyPromise((resolve, reject) => {
        const length = promiseList.length;

        if (length === 0) {
            return resolve();
        } else {
            for (let i = 0; i < length; i++) {
                MyPromise.resolve(promiseList[i]).then(
                    (value) => {
                        return resolve(value);
                    },
                    (reason) => {
                        return reject(reason);
                    });
            }
        }
    });

}
```
### Promise.all
有一个报错了,其他的Promise还会执行嘛?
* 会的,在实例化的时候就已经执行了

```javascript
static all(promise_list) {
   return new MyPromise((reslove, reject) => {
      let res = []
      let count = 0//这个变量用来计数
      for (let i = 0; i < promise_list.length; i++) {
         //检验传来的值是不是promise,直接Promise.resolve,因为Promise.resolve包裹的参数默认就会转Promise,不需要关注类型了
         MyPromise.reslove(promise_list[i])
            .then((val) => {
               count++
               res.push(val)
               //为何不用resArr.length去判断?是因为执行的可能是异步,
                //所以在赋值的时候,很可能先赋值到大的下标,这时候数组长度虽然变长,但是其他Promise并未返回
               if (res.length === count) {
                     reslove(res)
               }
            })
            .catch(err => {
               reject(err)
            })
      }
   })
}

```
### 验证是否符合PromiseA+
使用promises-aplus-tests插件进行测试
::: tip 安装
npm i promises-aplus-tests -g
命令行下 promises-aplus-tests [js文件名] 即可验证
:::
```javascript
static deferred() {
    let dfd = {}
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
```
## 全部代码
```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    fulfilled_callBack_list = []
    rejected_callBack_list = []
    _status = PENDING
    constructor(fn) {
        this.status = PENDING;
        this.value = null
        this.reason = null

        try {
            fn(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(value) {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
        }
    }
    reject(reason) {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
        }
    }
    then(onFulfilled, onRejected) {
      const realOnFulfilled = this.isFun(onFulfilled) ? onFulfilled : (value) => { value }
      const realOnRejected = this.isFun(onRejected) ? onRejected : (reason) => {
         throw reason
      }
        const Promise2 = new MyPromise((resolve, reject) => {
            const realOnFulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnFulfilled(this.value)
                        resolvePromise(Promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            const realOnRejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = realOnRejected(this.reason)
                        resolvePromise(Promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            switch (this.status) {
                case FULFILLED: {
                    realOnFulfilledMicrotask()
                    break
                }
                case REJECTED: {
                    realOnRejectedMicrotask()
                    break
                }
                case PENDING: {
                    this.fulfilled_callBack_list.push(realOnFulfilledMicrotask)
                    this.rejected_callBack_list.push(realOnRejectedMicrotask)
                    break;
                }
            }

        })
        return Promise2
    }
    catch(e) {
        // this.reject(e)
        return this.then(null, e)
    }
    isFun(params) {
        return typeof params === 'function'
    }
    resolvePromise(Promise2, x, resolve, reject) {
        if (Promise2 === x) {
            return reject(new TypeError('TypeError'))
        }
        if (x instanceof MyPromise) {
            queueMicrotask(() => {
                x.then((y) => this.resolvePromise(Promise2, y, resolve, reject))
            })
        } else if (typeof x === 'object' || this.isFun(x)) {
            if (x === null) return resolve(x)
            let then = null
            try {
                then = x.then

            } catch (error) {
                return reject(error)
            }
            if (this.isFun(then)) {
                let flag = false
                try {
                    then.call(
                        x,
                        (y) => {
                            if (flag) return
                            flag = true
                            this.resolvePromise(Promise2, y, resolve, reject)
                        },
                        (r) => {
                            if (flag) return
                            flag = true
                            reject(r)
                        }
                    )
                } catch (error) {
                    if (flag) return
                    reject(e)
                }

            } else {
                resolve(x)
            }
        } else {
            resolve(x)
        }

    }
    get status() {
        return this._status
    }
    set status(new_val) {
        this._status = new_val
        switch (new_val) {
            case FULFILLED: {
                this.fulfilled_callBack_list.forEach(fn => {
                    fn(this.value)
                })
                break
            }
            case REJECTED: {
                this.rejected_callBack_list.forEach(fn => {
                    fn(this.reason)
                })
                break
            }
        }
    }

    static reslove(params) {
        if (params instanceof MyPromise) {
            return params
        }
        return new MyPromise((reslove, reject) => {
            reslove(params)
        })
    }
    static reject(reason) {
        return new MyPromise((reslove, reject) => {
            reject(reason)
        })
    }

    static race(promise_list) {
        return new MyPromise((reslove, reject) => {
            if (promise_list.length) {
                reslove()
            }
            promise_list.forEach(fn => {
                fn.then(reslove, reject)
            })
        })
    }

    static all(promise_list) {
        return new MyPromise((reslove, reject) => {
            let res = []
            let count = 0
            for (let i = 0; i < promise_list.length; i++) {
                MyPromise.reslove(promise_list[i])
                    .then((val) => {
                        count++
                        res.push(val)
                        if (res.length === count) {
                            reslove(res)
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
        })
    }
    // 目前是通过他测试 他会测试一个对象
    static deferred() {
        let dfd = {}
        dfd.promise = new MyPromise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd;
    }



}

//测试demo
var a = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(888)
    }, 110)
    // resolve(999)
}).then(res => {
    console.log(111, res);
})
.catch((err) => {
    console.log('err', err);
})

module.exports = MyPromise

```
