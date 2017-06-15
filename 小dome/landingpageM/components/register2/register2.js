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
			this.placeholder = '请输入手机号码';
		})
		$("#pwd").blur(function() {
			this.placeholder = '请设置6-16位字母数字组合为密码';
		})
		$("#identify").blur(function() {
			this.placeholder = '请输入短信验证码';
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
	
		//判断密码为6-16位数字字母
		this.isPwd = function(str) {
			var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
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
	
		//校验验证码
		this.isCode = function(str) {
			var reg = /^\d{6}$/;
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
		//密码的验证
		function test_pwd() {
			var password = $("#pwd").val();
			if(!me.isEmpty(password)) {
				if(me.isPwd(password)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	
		//验证码的验证
		function test_code() {
			var str = $("#identify").val();
			if(!me.isEmpty(str)) {
				if(me.isCode(str)) {
					return true;
				} else {
					$(".prompt").html("请输入正确的短信验证码");
					return false;
				}
			} else {
				$(".prompt").html("短信验证码不能为空");
				return false;
			}
		}
	
		//获取验证码
		var timer; //定义计时器
		function get_code() {
			if(!test_phone()) {
				$(".prompt").html("请填写正确的手机号");
				me.show_prompt();
			} else {
				var data = JSON.stringify({
					phone: $("#phone").val(),
					smsType: "regist",
					values: ["", "2"]
				});
				customajax(
					config.baseUrl + "/wfduc/client/sms/sendvc",
					data,
					function(data) {
						if(data.errorCode == 0) {
							$(".prompt").html("发送成功");
							me.show_prompt();
							timer = setInterval(countDown, 1000);
						} else {
							$(".prompt").html(data.errorMessage);
							me.show_prompt();
						}
					}
				)
			}
		}
		$("#get_identify").on("touchend", get_code);
		//发送验证码倒计时
		var time = 120;
	
		function countDown() {
			$("#get_identify").val("重新获取(" + time + ")").attr("disabled", "disabled");
			time -= 1;
			if(time == 0) {
				$("#get_identify").val("重新获取").removeAttr("disabled");
				time = 120;
				clearInterval(timer);
			}
		}
		
		//用户注册
		$("#submit").on("touchend", function(e) {
			var e = event || window.event;
			e.preventDefault();
			if(!test_phone()) {
				$(".prompt").html("请填写正确的手机号码");
				me.show_prompt();
			} else if(!test_pwd()) {
				$(".prompt").html("请填写正确的密码格式");
				me.show_prompt();
			} else if(!$("#choice[type='checkbox']").is(':checked')) {
				$(".prompt").html("请勾选服务协议");
				me.show_prompt();
			} else if(!test_code()) {
				me.show_prompt();
			} else {
				var data = JSON.stringify({
					phone: $("#phone").val(),
					veriCode: $("#identify").val(),
					smsType: "regist"
				});
				customajax(
					config.baseUrl + "/wfduc/client/sms/checkvc",
					data,
					function(data) {
						if(data.errorCode == 0) {
							register();
						} else {
							$(".prompt").html("验证码填写错误");
							me.show_prompt();
						}
					}
				)
			}
		})
	
		//注册
		function register() {
			var data = JSON.stringify({
				userAcc: $("#phone").val(),
				userPwd: $("#pwd").val(),
				vericode: $("#identify").val(),
				platform: "app",
				channelid: config.channelid
			});
			customajax(
				config.baseUrl + "/wfduc/client/user/register",
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
         var tpl = __inline('register2.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        bgimg1: window.remoteConfig.register2_bgimg1,
	        bgimg2: window.remoteConfig.register2_bgimg2,
	        img: window.remoteConfig.register2_src,
	        color1: window.remoteConfig.register2_color1,
	        color2: window.remoteConfig.register2_color2,
	        color3: window.remoteConfig.register2_color3,
	        color4: window.remoteConfig.register2_color4,
	        color5: window.remoteConfig.register2_color5,
	        color6: window.remoteConfig.register2_color6
	    };
	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
//      dom.innerHTML = __inline('register2.tpl');
        module.exports.kd();
    }
};