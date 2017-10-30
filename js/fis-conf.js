// 加 md5
fis.match('*.{js,css,png,jpg}', {
    // useHash: true,
    // release : '/static/images$0',
    // url : '/h5/res$0'
});

// 启用插件 
fis.hook('relative'); 
// 让所有文件，都使用相对路径。 
fis.match('**', { relative: true })
fis.match('**/common-template/**', { relative: false })
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});
fis.set('new date', Date.now());
// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    // useSprite: true
    // fis-optimizer-clean-css 插件进行压缩，已内置
  	optimizer: fis.plugin('clean-css'),
  	// query: '?=t' + fis.get('new date')
});

fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    // optimizer: fis.plugin('uglify-js'),
    // release : '/static/js$0',
    // url : '/mm/static/js$0'
    // query: '?=t' + fis.get('new date')
});

// fis.match('*.css', {
//     // fis-optimizer-clean-css 插件进行压缩，已内置
//     optimizer: fis.plugin('clean-css'),
//     // release : '/static/css$0'
// });

// fis.match('*.png', {
//     // fis-optimizer-png-compressor 插件进行压缩，已内置
//     optimizer: fis.plugin('png-compressor')
// });

// fis.match('::package', {
//   postpackager: fis.plugin('loader', {
//     allInOne: {
//         ignore: ['static/js/public/echarts.min.js.js','static/js/public/echarts.common.min.js','static/js/public/echarts.simple.min.js','static/js/public/bootstrap-datetimepicker.js','static/js/public/jquery-2.1.3.min.js','static/js/public/bootstrap.min.js','static/js/public/require.min.js']
//     }
//   })
// });