const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: {
                    loader: 'url-loader?limit=8192'
                }
            }, {
                test:/\.html$/,
                loader:"html-withimg-loader"
            }
        ]
    },
    plugins:[
        // new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
            title:"测试",
            template: __dirname +"/app/index.html"
        })
    ]
}