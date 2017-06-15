'use strict';

module.exports = {
	scroll: function() {
		function scrolls(n,h) {
			var times = setInterval(function() {
				n-= 10;
				if(n < h) {
					clearInterval(times);
					n = h;
				}
				$(window).scrollTop(n);
			},1)
		}
		
		//点击定位至注册模块，注册模块顶部与显示页面顶部重合
		$(".gotoreg").on("touchend",function() {
			var n = $(window).scrollTop();
			var h0 = $(".banner").height();
			scrolls(n,h0);
		})
	},
    render: function (dom) {
        // tpl后缀的文件也可以用于模板嵌入，相比handlebars
        // tpl文件不具有模板变量功能，嵌入后只是作为字符串使
        // 用，tpl文件嵌入之前可以被插件压缩，体积更小。
        // handlebars由于缺少相应的压缩插件因此暂时不能在预
        // 编译阶段做压缩。选择tpl还是handlebars可以自由选
        // 择
         var tpl = __inline('content2.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        img1: window.remoteConfig.content2_src1,
	        img2: window.remoteConfig.content2_src2
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
	    this.scroll();
//      dom.innerHTML = __inline('content2.tpl');
    }
};