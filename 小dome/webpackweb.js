// gulp错误处理
// 错误处理
var notify = require("gulp-notify")

module.exports = function(errorObject, callback) {
    // 错误通知
    notify.onError(errorObject.toString().split(': ').join(':\n'))
        .apply(this, arguments);

    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
}

// 任务
var gulp = require('gulp');
var plumber = require('gulp-plumber');

var project = require('../lib/project')(); // 得到当前的后台项目
var config = require('../config.' + project).views; // 读取配置文件
var handleErrors = require('../lib/handleErrors');


gulp.task('views', function() {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors)) // 错误自启动
        .pipe(gulp.dest(config.dest));
});
// 同步任务
gulp.task('views', function() {
    return gulp.src(config.src)
        .pipe(plumber(handleErrors))
        .pipe(gulp.dest(config.dest));
});

// 异步任务
gulp.task('webpack', function(callback) {
    webpack(config, function(err, stats) {
        compileLogger(err, stats);

        callback(); //异步任务的关键之处，如果没有这行，任务会一直阻塞
    });
});

// webpack的相关配置
// webpack.config.js  css单独抽出
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        'homes/index': 'pages/homes/index.js'
    },
    output: {
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
}
// webpack.config.js 抽离公共模块
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        'homes/index': 'pages/homes/index.js'
    },
    output: {
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }]
    },
    plugins: [
        //抽离公共模块，包含js和css
        new webpack.optimize.CommonsChunkPlugin("commons", "commons.js"), 
        new ExtractTextPlugin("[name].css")
    ]
}
//获取文件夹下面的所有的文件(包括子文件夹)
var path = require('path'),
    glob = require('glob');

module.exports = function(dir, ext) {
    var files = glob.sync(dir + '/**/*.' + ext),
        res = {};

    files.forEach(function(file) {
        var relativePath = path.relative(dir, file),
            relativeName = relativePath.slice(0, relativePath.lastIndexOf('.'));

        res[relativeName] = './' + relativePath;
    });

    return res;
};
// 其中定义了getLoaders，getAlias，getPlugins，getPostcss函数
// 都是为了解决development配置和production配置的差异问题
// 既最大程度的复用配置，又允许差异的存在
module.exports = function(env) {
    return {
        context: config.context,
        entry: config.src,
        output: {
            path: path.join(config.jsDest, project),
            filename: '[name].js',
            chunkFilename: '[name].[chunkhash:8].js',
            publicPath: '/assets/' + project + '/'
        },
        devtool: "eval",
        watch: false,
        profile: true,
        cache: true,
        module: {
            loaders: getLoaders(env)
        },
        resolve: {
            alias: getAlias(env)
        },
        plugins: getPlugins(env),
        postcss: getPostcss(env)
    };
}
