var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: {
    req:__dirname+'/src/req.js',
    wechat:__dirname+'/src/wechat.js',
    reqwechat:__dirname+'/src/reqwechat.js',
    h5:__dirname+'/src/h5.js',
    download:__dirname+'/src/download.js'
  },
	output: {
		path: __dirname+'/dist/',
		filename: 'ZYLIB.[name]-0.0.1.min.js',
		libraryTarget: 'umd',
    library: "ZYLIB"
	},
	module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','latest']
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(""+(new Date()).toLocaleString()),
    new HtmlWebpackPlugin({
      template: __dirname + "/index.html"
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devServer: {
    contentBase: __dirname+'/dist/',
    compress: true,
    port: 8080,
    stats: "errors-only"
  }
};