'use strict';

//var $ = require('zepto');
module.exports = {
	isScrolls: function() {
		//滑动定位选项部分
		var timer;
		$(window).scroll(function() {
			var h2 = $(".header").height()*2-$(".immediately_entry").height();
			if($(this).scrollTop() >= h2) {
				if(timer) {
					clearTimeout(timer);
					timer=null;
				}
				$(".footer").show().removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".footer").removeClass("fadeIn").addClass("fadeOut");
				if(!timer) {
					timer=setTimeout(function() {
						$(".footer").hide();
					},400)
				}
			}
		})
	},
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
		$(".downLoad").on("touchend", function () {
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
         var tpl = __inline('footer.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        img1: window.remoteConfig.footer_src1,
	        img2: window.remoteConfig.footer_src2
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
//      dom.innerHTML = __inline('footer.tpl');
        module.exports.isScrolls();
        module.exports.downLoad();
    }
};

