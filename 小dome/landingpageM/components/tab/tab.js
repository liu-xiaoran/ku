'use strict';

// var $ = require('zepto');
module.exports = {
	shows: function() {
		function scroll(n,h) {
			var times = setInterval(function() {
				n+= 10;
				if(n > h) {
					clearInterval(times);
					n = h;
				}
				$(window).scrollTop(n);
			},1)
		}
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
		
		//点击选择按钮跳转到对应部分
		$(".vip_btn").on("touchend",function() {
			var n = $(window).scrollTop();
			var h1 = $(".headercon").height()+$(".banner").height()+$(".register").height()+$(".tab").height()-$(".choose").height();
			scroll(n,h1);
		})
		$(".vip_btns").on("touchend",function() {
			var n = $(window).scrollTop();
			var h1 = $(".headercon").height()+$(".banner").height()+$(".register").height()+$(".tab").height()-$(".choose").height();
			if (n>h1) {
				scrolls(n,h1);
			} else {
				scroll(n,h1);
			}
			
		})
		$(".red_btn").on("touchend",function() {
			var n = $(window).scrollTop();
			var h2 = $("body,html").height()-$(window).height();
			scroll(n,h2);
		})
		
		//滑动定位选项部分
		var timer;
		var timers;
		$(window).scroll(function() {
			var h2 = $(".banner").height();
			if($(this).scrollTop() >= h2) {
				if(timer) {
					clearTimeout(timer);
					timer=null;
				}
				$(".chose").removeClass("fadeOut").addClass("fadeIn").show();
			} else {
				$(".chose").removeClass("fadeIn").addClass("fadeOut");
				if(!timer) {
					timer=setTimeout(function() {
						$(".chose").hide();
					},400)
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
         var tpl = __inline('tab.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        img1: window.remoteConfig.tab_src1,
	        img2: window.remoteConfig.tab_src2,
	        img3: window.remoteConfig.tab_src3,
	        img4: window.remoteConfig.tab_src4,
	        bgcolor: window.remoteConfig.tab_bgcolor
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
//      dom.innerHTML = __inline('tab.tpl');
        module.exports.shows();
    }
};