---
title: Promise
author: Ys
date: '2021-12-28'
---

# 一步步实现一个Promise
01. 平常用promise的时候, 是通过new关键字来new Promise(), 所以咱们应该用构造函数或者class来实现. 都2021年了, 咱们就用class来实现一下吧.

```js
class MPromise {
    constructor() {

    }
}
```

02. 定义三种状态类型

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

03. 设置初始状态

```js
class MPromise {
    constructor() {
        // 初始状态为pending
        this.status = PENDING;
        this.value = null;
        this.reason = null;
    }
}
```

04. resolve 和 reject 方法

    01. 根据刚才的规范, 这两个方法是要更改status的, 从pending改到fulfilled/rejected.
    02. 注意两个函数的入参分别是value 和 reason. 

```js
class MPromise {
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

05. 是不是发现咱们的promise少了入参, 咱们来加一下

    01. 入参是一个函数, 函数接收resolve和reject两个参数.
    02. 注意在初始化promise的时候, 就要执行这个函数, 并且有任何报错都要通过reject抛出去

```js
class MPromise {
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

    

06. 接下来来实现一下关键的then方法

    01. then接收两个参数, onFulfilled 和 onRejected

$mdFormatter$34$mdFormatter$

```js
    then(onFulfilled, onRejected) {}
```

    02. 检查并处理参数, 之前提到的如果不是function, 就忽略. 这个忽略指的是原样返回value或者reason.

$mdFormatter$34$mdFormatter$

```js
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

    03. 要知道.then的返回值整体是一个promise, 所以咱们先用promise来包裹一下, 其他逻辑待会再实现.

$mdFormatter$34$mdFormatter$

```js
    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value
        }
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        };
        const promise2 = new MPromise((resolve, reject) => {})
        return promise2
    }
```

    04. 根据当前promise的状态, 调用不同的函数

$mdFormatter$34$mdFormatter$

```js
    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value
        }
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        };
        const promise2 = new MPromise((resolve, reject) => {
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

    05. 这个时候有的同学要问了, 你这样写, 是在then函数被调用的瞬间就会执行. 那这时候如果status还没变成fulfilled或者rejected怎么办, 很有可能还是pending的. 所以我们需要一个状态的监听机制, 当状态变成fulfilled或者rejected后, 再去执行callback.

        01. 那么我们首先要拿到所有的callback, 然后才能在某个时机去执行他. 新建两个数组, 来分别存储成功和失败的回调, 调用then的时候, 如果还是pending就存入数组.

$mdFormatter$63$mdFormatter$

```js
        FULFILLED_CALLBACK_LIST = [];
        REJECTED_CALLBACK_LIST = [];

        then(onFulfilled, onRejected) {
            const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
                return value
            }
            const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
                throw reason;
            };
            const promise2 = new MPromise((resolve, reject) => {
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

        02. 在status发生变化的时候, 就执行所有的回调. 这里咱们用一下es6的getter和setter. 这样更符合语义, 当status改变时, 去做什么事情. (当然也可以顺序执行, 在给status赋值后, 下面再加一行forEach)

$mdFormatter$63$mdFormatter$

```js
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

07. then的返回值
   上面只是简单说了下, then的返回值是一个Promise, 那么接下来具体讲一下返回promise的value和reason是什么.

    01. 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e。(这样的话, 我们就需要手动catch代码，遇到报错就reject)

$mdFormatter$34$mdFormatter$

```js
    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value
        }
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        };
        const promise2 = new MPromise((resolve, reject) => {
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

    7.2 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
    
    7.3 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因。

    需要注意的是，如果promise1的onRejected执行成功了，promise2应该被resolve

    这里咱们其实已经在参数检查的时候做过了, 也就是这段代码

$mdFormatter$34$mdFormatter$

```js
    const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
        return value
    }
    const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
        throw reason;
    };
```

    7.4 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行resolvePromise方法

$mdFormatter$34$mdFormatter$

```js
    then(onFulfilled, onRejected) {
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value
        }
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        };
        const promise2 = new MPromise((resolve, reject) => {
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

        

08. resolvePromise

```js
resolvePromise(promise2, x, resolve, reject) {
    // 如果 newPromise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 newPromise
    // 这是为了防止死循环
    if (promise2 === x) {
        return reject(new TypeError('The promise and the return value are the same'));
    }

    if (x instanceof MPromise) {
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

09. onFulfilled 和 onRejected 是微任务
    咱们可以用queueMicrotask包裹执行函数

```js
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

10. 简单写点代码测试一下

```js
const test = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000);
}).then(console.log);

console.log(test);

setTimeout(() => {
    console.log(test);

}, 2000)
```

    这个时候同学们会发现, 为什么我可以调用.then, 不可以调用.catch呢? 因为我们并没有在类里面声明catch方法

11. catch方法

```js
catch (onRejected) {
    return this.then(null, onRejected);
}
```

12. promise.resolve
    将现有对象转为Promise对象，如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为fulfilled。
    注意这是一个静态方法, 因为咱们是通过Promise.resolve调用的, 而不是通过实例去调用的.

```js
static resolve(value) {
    if (value instanceof MPromise) {
        return value;
    }

    return new MPromise((resolve) => {
        resolve(value);
    });
}
```

13. promise.reject
    返回一个新的Promise实例，该实例的状态为rejected。Promise.reject方法的参数reason，会被传递给实例的回调函数。

```js
static reject(reason) {
    return new MPromise((resolve, reject) => {
        reject(reason);
    });
}
```

14. promise.race
 `const p = Promise.race([p1, p2, p3]);`

    该方法是将多个 Promise 实例，包装成一个新的 Promise 实例。
    只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

```js
static race(promiseList) {
    return new MPromise((resolve, reject) => {
        const length = promiseList.length;

        if (length === 0) {
            return resolve();
        } else {
            for (let i = 0; i < length; i++) {
                MPromise.resolve(promiseList[i]).then(
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

    写段测试代码

```js
const test = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(111);
    }, 1000);
});

const test2 = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(222);
    }, 2000);
});

const test3 = new MPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(333);
    }, 3000);
});

MPromise.race([test, test2, test3]).then(console.log);
```
