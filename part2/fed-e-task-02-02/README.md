# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
答：1.根据webpack.config.js中的entry配置识别入口文件,加载入口文件文件  
	2.逐层识别模块依赖(包括CommonJS、es6中import等)  
	3.对代码进行分析、转换、编译、最终将结果输出  
	4.最终输出打包后的代码  

	详细说明：  
	1. 首先解析webpack.config.js中的配置参数，将webpack.config.js的配置和shell中传入的配置合并，输出最终的配置结果  
	2. 根据上一步得到的结果初始化compiler对象，注册所有配置的插件，插件监听声明周期的事件节点，做出相应的反应，执行对象的run方法开始执行编译  
	3. 从 webpack.config.js中通过配置的entry开始解析构建AST语法树，找出依赖模块，递归找到所有文件的依赖模块  
	4. 递归中根据文件类型和loader的配置，调用相应的loader对文件进行转换，再找出该模块依赖的模块，递归处理，保证所有的文件都经过相应loader的处理  
	5. loader转换完成之后，会得到各个文件的结果，最终将文件结果输出到文件系统中(注意：在构建的声明周期中，会有一系列的插件在合适的时间节点做相应的事情)  
	6. 输出资源，上一步得到的各个文件回根据他们之间的依赖关系组成一个个chunk，再把每个chunk输出到文件中。  
	7. 根据配置确定输出路径和文件名，把文件内容写入到文件中
　

　

　

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
# Loader
正常情况下webpack只识别js 和json代码，像html、css、less等其他文件，我们需要通过loader来将其转换为相应的js  
loader的本质就是一个函数，这个函数的作用就是拿到source源文件，对文件进行转换处理并返回
```js
module.exports = (source)=>{
    //下面的translate函数，就是对文件做处理转换的逻辑
    const result = translate(source)
    return result
}
```
# Plugin  
插件的本质是一个带有apply方法的类或者一个函数。webpack在工作过程中是基于tapable事件流的，在它工作的整个生命周期会有很多钩子，plugin就是在对应的阶段通过这些钩子来触发相应的事件。
```js
//compiler对象包含了整个构建过程中所需要的资源
// compilation 包含一次构建过程所需要的所有信息，它和compiler是多对一的关系
class MyPlugin {
    apply(compiler) {
        compiler.hoosk.emit.tap('MyPlugin',compilation=>{
            //在这里执行需要处理的逻辑
        })
    }
}
```
　

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性



**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

**其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.**



#### 作业要求

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 最终将录制的视频或说明文档和代码统一提交至作业仓库。