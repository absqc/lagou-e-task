/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

const PENDING = 'pending' //表示等待的状态
const FULFILLED = 'fulfilled' // 表示成功的状态
const REJECTED = 'rejected' // 表示失败的状态
class MyPromise {
    constructor(executor) {
        this.status = PENDING // 初始化状态为pending
        this.value = undefined // 记录成功后的值，初始值为undefined
        this.reason = undefined //记录失败后的原因，初始值为undefined
        this.successCallbacks = [] //记录成功的回调函数
        this.failCallbacks = [] //记录失败的回调函数
        try {
            executor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)// 捕获异常
        }
    }
    resolve = (value) => {
        // 判断当前状态是否为pending，不为pending直接返回，因为状态是不可逆的
        if (this.status !== PENDING) return
        this.status = FULFILLED // 更改状态为fulfilled
        this.value = value //记录成功后的返回值
        while (this.successCallbacks.length) {
            this.successCallbacks.shift()()
        }
    }
    reject = (reason) => {
        // 判断当前状态是否为pending，不为pending直接返回，因为状态是不可逆的
        if (this.status !== PENDING) return
        this.status = REJECTED // 更改状态为rejected
        this.reason = reason //更新原因 
        while (this.failCallbacks.length) {
            this.failCallbacks.shift()()
        }
    }
    /**
     * 1.then 方法接收两个函数作为参数，且参数可选
     * 2.如果可选参数部委函数时会被忽略
     * 3.两个函数都是异步执行，会放入事件队列等待下一轮tick
     * 4.当调用onResolveFn的时候，会将this.value作为参数传入
     * 5.当调用onRejectFn的时候，会将this.reason作为参数传入
     * 6.then的返回值为promise
     * 7.then可以被同一个promise多次调用
     */
    then(onResolveFn, onRejectFn) {
        //判断传入的函数是否为空或者为是否为函数
        onResolveFn = onResolveFn && typeof onResolveFn === 'function' ? onResolveFn : value => value
        onRejectFn = onRejectFn && typeof onRejectFn === 'function' ? onRejectFn : reason => { throw reason }
        //这里是因为then方法返回仍然是promise的实例，保证实现then方法的链式调用
        let promise2 = new MyPromise((resolve, reject) => {
            //如果是成功状态，直接执行成功后的回调
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {// 处理then 回调函数中的异常
                        let x = onResolveFn(this.value)
                        promiseResolve(promise2, x, resolve, reject)//同步的情况下，拿不到promise2，需要异步执行
                    } catch (error) {
                        reject(error)
                    }
                }, 0)

            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {// 处理then 回调函数中的异常
                        let x = onRejectFn(this.reason)
                        promiseResolve(promise2, x, resolve, reject)//同步的情况下，拿不到promise2，需要异步执行
                    } catch (error) {
                        reject(error)
                    }
                }, 0)

            } else {//如果状态是pending，则用数组存储起来，等待状态发生变化再执行
                this.successCallbacks.push(() => {
                    // onResolveFn()
                    setTimeout(() => {
                        try {// 处理then 回调函数中的异常
                            let x = onResolveFn(this.value)
                            promiseResolve(promise2, x, resolve, reject)//同步的情况下，拿不到promise2，需要异步执行
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
                this.failCallbacks.push(() => {
                    setTimeout(() => {
                        try {// 处理then 回调函数中的异常
                            let x = onRejectFn(this.reason)
                            promiseResolve(promise2, x, resolve, reject)//同步的情况下，拿不到promise2，需要异步执行
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
            }
        })

        return promise2
    }
    /*
     *finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
     */
    finally(callback) {
        return this.then((value) => {
            return MyPromise.resolve(callback()).then(() => value)
            // callback()
            // return value
        }, (reason) => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
            // callback()
            // throw reason
        })
    }
    catch(failCallback) {
        return this.then(undefined, failCallback)
    }
    /**
     * 将多个 Promise 实例组合成一个新的 Promise 实例。组合后的 Promise 实例只有当每个包含的 Promise 实例都解决(fulfilled)后才解决(fulfilled)，
     * 如果有一个包含的 Promise 实例拒绝(rejected)了，则合成的 Promise 也会拒绝(rejected) 
     */
    static all(array) {
        let result = []
        return new MyPromise((resolve, reject) => {
            let index = 0
            if (!array || !array.length) {
                resolve(result)
            }
            function add(key, value) {
                index++
                result[key] = value
                if (index === array.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < array.length; i++) {
                let cur = array[i]
                if (cur instanceof MyPromise) {
                    cur.then(value => {
                        add(i, value)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    add(i, cur)
                }
            }
        })
    }
    /**
     * 返回一个合成的 Promise 实例，其会返回这一组中最先解决(fulfilled)或拒绝(rejected)的 Promise 实例的返回值 
     */
    static race(array) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < array.length; i++) {
                let cur = array[i]
                if (cur instanceof MyPromise) {
                    cur.then(value => resolve(value), reason => reject(reason))
                } else {
                    resolve(cur)
                }
            }
        })
    }
    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise((resolve, reject) => {
            resolve(value)
        })
    }
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
}
/**
 * promise的解决过程有以下几种情况：
 *  1. promise === x：这个时候说明存在循环调用，直接reject并返回
 *  2. x是Promise的实例：根据x的状态做相应的处理
 *  3. 否则直接以当前的值执行resolve
 */
function promiseResolve(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        x.then(value => resolve(value), reason => reject(reason))
    } else {
        resolve(x)
    }
}

module.exports = MyPromise
