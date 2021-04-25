const MyPromise = require('./MyPromise.js')

//--- 多个then方法
// let p1 = new MyPromise((resolve, reject) => {
//     resolve('成功')
// })
// p1.then(console.log, console.log)
// p1.then(console.log, console.log)
// p1.then(console.log, console.log)


//--- then方法的链式调用
// let p1 = new MyPromise((resolve, reject) => {
//     resolve('成功')
// })
// let other = new MyPromise((resolve, reject) => {
//     resolve('other')
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     return other
// })
// p2.then(value => console.log(value), reason => console.log(reason.message))

// ---  promise实例循环调用问题
// let p1 = new MyPromise((resolve, reject) => {
//     resolve('成功')
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     return p2
// })
// p2.then(value => console.log(value), reason => console.log(reason.message))

// ---  promise实例异常处理
// let p1 = new MyPromise((resolve, reject) => {
//     throw new Error('execute error')
//     resolve('成功')
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     throw new Error('then Error')
// }, reason => console.log(reason.message))

//---  捕获then阶段的error
// let p1 = new MyPromise((resolve, reject) => {
//     //throw new Error('execute error')
//     resolve('成功')
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     throw new Error('then Error')
// }, reason => console.log(reason.message))
// p2.then(console.log, console.log)

//--- reject状态下的链式调用
// let p1 = new MyPromise((resolve, reject) => {
//     reject('失败...')
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     throw new Error('then Error')
// }, reason => {
//     console.log(reason)
//     return 'then reject'
// })
// p2.then(console.log, console.log)


//--- 测试then中处理异步调用的过程
// let p1 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('成功')
//     }, 2000);
// })
// let p2 = p1.then(value => {
//     console.log(value)
//     return 1000
// }, reason => {
//     console.log(reason)
//     return 'then reject'
// })
// p2.then(console.log, console.log)

//--- 多个链式调用

// let p1 = new MyPromise((resolve, reject) => {
//     //  resolve('成功')
//     reject('失败')
// })
// p1.then().then().then(console.log, console.log)

//--- 测试 Promise.all
// let p1 = new MyPromise((resolve, reject) => {
//     // setTimeout(() => {
//     //     resolve('成功')
//     // }, 2000);
//     reject('失败')
// })
// Promise.all(['a', p1]).then(value => console.log(value))

//--- 测试 Promise.race
let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功111')
    }, 2000);
    //  reject('失败')
})
let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功222')
    }, 5000);
    //  reject('失败')
})
Promise.race([p2, p1]).then(value => console.log(value))


//--- 测试Promise.resolve方法
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('hello')
//     }, 2000);
// })
// MyPromise.resolve(100).then(console.log)
// MyPromise.resolve(p1).then(console.log)

// //--- 测试finally 方法

// let p1 = new MyPromise((resolve, reject) => {
//     reject(100)
// })

// p1.finally(() => {
//     console.log('finally')
// }).then(value => {
//     console.log('111111')
//     console.log(value)
// }, reason => {
//     console.log('333333')
//     console.log(reason)
// })

//--- 测试finally 方法，finally 中返回一个异步promise

// let p1 = new MyPromise((resolve, reject) => {
//     reject(100)
// })
// let p2 = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('wait 200..')
//     }, 2000);
// })
// p1.finally(() => {
//     console.log('finally')
//     return p2
// }).then(value => {
//     console.log('111111')
//     console.log(value)
// }, reason => {
//     console.log('333333')
//     console.log(reason)
// })