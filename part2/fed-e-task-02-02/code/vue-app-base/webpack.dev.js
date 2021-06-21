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