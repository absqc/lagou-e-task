# vue-app-base

# 安装webpack 和webpack-cli webpack-dev-server

```js
npm install webpack webpack-cli webpack-dev-server -D
```
# webpack.common.js配置入口和出口
```js
// webpack.common.js
const path = require('path')
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'bundle_[chunkhash:8].js'
    },
}
```
# 修改package.json里的script标签
```js
//package.json
  "scripts": {
        "serve": "webpack-dev-server --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js",
        "lint": "eslint ./src/main.js"
    },
```
# 通过babel-loader 转译js文件
```js
npm install babel-loader @babel/core @babel/preset-env --dev
```

```js
//配置babel-loader

module.exports = {
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }
                }
            }
        ]
    }
}
```
# 编译其他文件(less、css、 图片)
```js
npm install css-loader vue-style-loader url-loader less-loader
```
```js
module.exports = {
    module:{
        rules:[
           {
                test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 1024 * 10
                }
            }, {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    { loader: 'css-loader', options: { esModule: false } },
                ],
            }, {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    { loader: 'css-loader', options: { esModule: false } },
                    { loader: 'less-loader' }
                ]
            }
        ]
    }
}
```
# 通过vue-loader 处理vue组件
```js
npm install vue-loader vue-template-compiler --dev
```
```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins:[
         new VueLoaderPlugin()
    ]
}
```
# 通过html-webpack-plugin 生成html
```js
npm install html-webpack-plugin --dev
```
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins:[
        new HtmlWebpackPlugin({
            title: 'vue-webpack-demo',
            template: path.join(__dirname + '/public/index.html')
        })
    ]
}
```
# 使用Eslint校验代码
```js
npm install eslint eslint-loader
```
```js
    module.exports = {
        module:{
            rules:[
                {
                    test:/\.js$/,
                    exclude:/node_modules/,
                    use:{
                        loader:'eslint-loader',
                        enforce:'pre'
                    }
                }
            ]
        }
    }
```
# 配置开发环境config
```js
npm install webpack-merge 
```js
```js
const { merge } = require('webpack-merge')
const config = require('./webpack.common.js')
const path = require('path')

module.exports = merge(config, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.join(__dirname + '/public')
    }
})
```
# 修改生产环境config
```js
    npm install copy-webpack-plugin clean-webpack-plugin
```
```js
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public/*' }]
        })
    ]
})
```
# 总结  
npm run serve:通过webpack-dev-server启动一个服务器，实现本地开发
npm run build: 编译生成生产环境代码
npm run lint: 通过eslint检查js代码