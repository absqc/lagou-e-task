
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname + '/dist'),
        filename: 'bundle_[chunkhash:8].js'
    },

    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] }
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'eslint-loader',
            enforce: 'pre'
        }, {
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
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'vue-webpack-demo',
            template: path.join(__dirname + '/public/index.html')
        })
    ],
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    }
}