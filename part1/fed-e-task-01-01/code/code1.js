/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

let p1 = new Promise((resolve, reject) => {
  resolve('hello ')
}).then(value => value + 'lagou ')
  .then(value => value + 'I ♥ U')
  .then(value => console.log(value))
