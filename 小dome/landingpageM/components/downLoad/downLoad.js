'use strict';

// require依赖的文件
var shade = require('shade');

/**
 * 渲染页面骨架
 * @param {HTMLElement} dom
 */
module.exports = {
	downLoad: function() {
		//判断设备类型和浏览器环境
		function ue() {
		    var e = navigator.userAgent.toLowerCase();
		    return {
		        iphone: /iphone/.test(e),
		        android: /android/.test(e),
		        winphone: /windows phone/.test(e),
		        weixin: /micromessenger/.test(e),
		        qqnews: /qqnews/.test(e),
		        mqqbrowser: /mqqbrowser/.test(e),
		        qq: /\sqq/.test(e)
		    }
		}
		
		//下载app
		$(".down_btn").on("touchend", function () {
			if(ue().weixin == true) {
				$(".shade_box").show();
				$(".shade").show();
				$("html,body").addClass("ovfHiden");
			} else {
				if (ue().iphone == true) {
			        location.href = 'https://itunes.apple.com/app/id1203692435';
			    } else if (ue().android == true) {
		            location.href = window.getCookie('apkLink');
			    }
			}
		})
	},
	render: function (dom) {
        // tpl后缀的文件也可以用于模板嵌入，相比handlebars
        // tpl文件不具有模板变量功能，嵌入后只是作为字符串使
        // 用，tpl文件嵌入之前可以被插件压缩，体积更小。
        // handlebars由于缺少相应的压缩插件因此暂时不能在预
        // 编译阶段做压缩。选择tpl还是handlebars可以自由选
        // 择
         var tpl = __inline('downLoad.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        img1: window.remoteConfig.downLoad_src1,
	        img2: window.remoteConfig.downLoad_src2
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
//      dom.innerHTML = __inline('downLoad.tpl');
	    module.exports.downLoad();
    }
}