'use strict';
var config = {
	baseUrl: "",
	channelid: window.cid
};
//var $ = require('zepto');

module.exports = {
	kd:function() {
		var me = this;

		//placeholder设置
		$("input[type='text'],input[type='password'],input[type='number']").focus(function() {
			this.placeholder = '';
		})
		$("input[type='number']").blur(function() {
			this.placeholder = '请输入手机号';
		})
	
		//判断字符是否为空或null
		this.isEmpty = function(str) {
			if((str.length == 0) || (str == null)) {
				return true;
			} else {
				return false;
			}
		}
	
		//判断正数
		this.isDigit = function(str) {
			var reg = /^\d+(\.\d+)?$/;
			if(reg.test(str)) {
				return true;
			} else {
				return false;
			}
		}
	
		//校验手机号码
		this.isMobile = function(str) {
			var reg = /^(1[3|4|5|7|8])[\d]{9}$/;
			if(reg.test(str)) {
				return true;
			} else {
				return false;
			}
		}
	
		//手机号的验证
		function test_phone() {
			var str = $("#phone").val();
			if(!me.isEmpty(str)) {
				if(str.length == 11) {
					if(me.isMobile(str)) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	
		//用户注册
		$("#submit").on("touchend", function(e) {
			var e = event || window.event;
			e.preventDefault();
			if(!test_phone()) {
				$(".prompt").html("请填写正确的手机号码");
				me.show_prompt();
			} else {
				register();
			}
		})
	
		//注册
		function register() {
			var data = JSON.stringify({
				userAcc: $("#phone").val(),
				platform: "app",
				vericode:"123456",
				channelid: config.channelid
			});
			customajax(
				config.baseUrl + "/jzucapp/tmp/register",
				data,
				function(data) {
					if(data.errorCode == 0) {
						$(".prompt").html("注册成功");
						me.show_prompt();
						location.href = "download.html?apkLink="+window.getCookie("apkLink");
					} else {
						$(".prompt").html(data.errorMessage);
						me.show_prompt();
					}
				}
			)
		}
	
		//提示框显示
		this.show_prompt = function() {
			$(".prompt_box").show();
			setTimeout(function() {
				$(".prompt_box").hide();
			}, 2000)
		}
	
		//ajax封装
		function myAjax(type, url, data, Fn) {
			$.ajax({
				type: type,
				url: url,
				data: data,
				success: function(data) {
					Fn(data);
				},
				error: function(xhr, type) {
					console.log('xhr=' + JSON.stringify(xhr) + 'type=' + type);
				}
			});
		}
	
		function customajax(url, data, Fn) {
			$.ajax({
				type: 'POST',
				url: url,
				data: data,
				dataType: 'json',
				contentType: 'application/json',
				success: function(data) {
					Fn(data);
				},
				error: function(xhr, type) {
					console.log('xhr=' + JSON.stringify(xhr) + 'type=' + type);
				}
			});
	
		}
	
//		$(".lingqu").on("touchstart",function() {
//			$(".lq_btn").html('<img src="img/btnv.png"/>');
//		}).on("touchend",function() {
//			$(".lq_btn").html('<img src="img/btns.png"/>');
//		})
		
		//解决获取焦点出现键盘时悬浮框上升的bug
		$("input[type='text'],input[type='password'],input[type='number']").focus(function() {
		    $(".footer").css("position","absolute")
		}).blur(function() {
			$(".footer").css("position","fixed")
		})
	},
    render: function (dom) {
        // tpl后缀的文件也可以用于模板嵌入，相比handlebars
        // tpl文件不具有模板变量功能，嵌入后只是作为字符串使
        // 用，tpl文件嵌入之前可以被插件压缩，体积更小。
        // handlebars由于缺少相应的压缩插件因此暂时不能在预
        // 编译阶段做压缩。选择tpl还是handlebars可以自由选
        // 择
        var tpl = __inline('register4.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        bgimg: window.remoteConfig.register4_bgimg,
	        img: window.remoteConfig.register4_src
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
//      dom.innerHTML = __inline('register4.tpl');
        module.exports.kd();
    }
};