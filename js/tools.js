var str=location.href;
 if(str.indexOf('mei2ti3bao4dao4')>=0){
  location.href='/information/mtbd/';
 }
 if(str.indexOf('xin1wen2dong4tai4')>=0){
  location.href='/information/xwdt/';
 }
 if(str.indexOf('li3cai2zhi1shi1')>=0){
  location.href='/information/lczs/';
 }
 if(str.indexOf('xing2ye4dong4tai4')>=0){
  location.href='/information/hydt/';
 }
 if(str.indexOf('hu4lian2wang3jin1rong2')>=0){
  location.href='/information/hlwjr/';
 }
 if(str.indexOf('wang3dai4xing2ye4jie4shao4')>=0){
  location.href='/wdhyjs/mtbd/';
 }
 
var GHutils = {}

var HOST = "";

var channelid = "999920170228100000"

//生产环境环境（地址：https://www.zhangyuelicai.com）

var channelOid = "ff8080815a8452de015a89408cee3682";
var cid = "1";
var ckey = "PC20170301";
var cmsChannelOid = "000000005a83152e015a894d28b80000";
var returnUrl="https:///"

GHutils.constant = {
	userStatus: "userStatus",
}

GHutils.userinfo = null;

GHutils.API = {

		}
	}
	//ajax请求
GHutils.load = function(op) {
		if (!op || !op.url) {
			return;
		}

		if (op.params) {
			op.url = op.url + "?" + decodeURIComponent($.param(op.params));
		}

		if (op.sp) {
			GHutils.processingShow();
		}

		var set = {
			type: op.type || "post",
			url: op.url,
			async: op.async == false ? false : true,
			data: JSON.stringify(op.data) || "",
			contentType:op.contentType || "application/json",
			dataType: "json",
			success: function() {
				if (op.sp) {
					GHutils.processingHide();
				}
				if (op.callback && typeof(op.callback) == 'function') {
					if (GHutils.preErrorHandle(arguments[0],op.loginStatus)) {
						op.callback.apply(null, arguments);
					}
				}
			},
			timeout: 20000,
			error: function(xhr, type, errorThrown) {
				if (op.sp) {
					GHutils.processingHide();
				}
				//window.console && console.log && console.log(type);
				if (op.errcallback) {
					op.errcallback();
				}
			}
		};
		$.ajax(set);
	}
/**
 * 将对象转换成带参数的形式 &a=1&b=2
 */
GHutils.buildQueryUrl = function(url, param) {
	var x = url
	var ba = true
	if (x.indexOf('?') != -1) {
		if (x.indexOf('?') == url.length - 1) {
			ba = false
		} else {
			ba = true
		}
	} else {
		x = x + '?'
		ba = false
	}
	var builder = ''
	for (var i in param) {
		var p = '&' + i + '='
		if (param[i]) {
			var v = param[i]
			if (Object.prototype.toString.call(v) === '[object Array]') {
				for (var j = 0; j < v.length; j++) {
					builder = builder + p + encodeURIComponent(v[j])
				}
			} else if (typeof(v) == "object" && Object.prototype.toString.call(v).toLowerCase() == "[object object]" && !v.length) {
				builder = builder + p + encodeURIComponent(JSON.stringify(v))
			} else {
				builder = builder + p + encodeURIComponent(v)
			}
		}
	}
	if (!ba) {
		builder = builder.substring(1)
	}
	return x + builder
}
	//
GHutils.preErrorHandle = function(resp,loginStatus) {
		var errcode = resp.errorCode
		var isFlag = true
		if (errcode == "40004") {
			window.location.href = "repair.html";
		}
		if (errcode == "E10001") {
			//GHLocalStorage.clear();
			GHutils.loginOut(true);
		}
		if(errcode == "10002"){
			if(loginStatus && typeof(loginStatus) == 'function'){
				loginStatus(resp)
				isFlag = false
			}
		}
		return isFlag;
	}

	//格式化时间格式
	/*param{
	 * data:time,
	 * type:0,
	 * showtime:"true"
	 * }
	 *
	 *
	 * */
GHutils.formatTimestamp = function(param) {
	var d = new Date();
	d.setTime(param && param.time || d);
	var datetime = null;
	var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
	var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

	if (param.showtime == "false") {
		datetime = x + y;
	} else {
		datetime = x;
	}

	return datetime;
}

GHutils.addDate = function(date,days){   
    var d=new Date(date);   
    d.setDate(d.getDate()+days);   
    var month=d.getMonth()+1;   
    var day = d.getDate();  
    if(month<10){  
        month = "0"+month;  
    }  
    if(day<10){  
        day = "0"+day;  
    }  
    var val = d.getFullYear()+"-"+month+"-"+day;   
    return val;  
} 

//获取验证码按钮倒计时
GHutils.btnTime = function(obj){
	var btntime = null;

	if(obj){
		var t = 120;
        btntime = setInterval(function(){
            if(t >= 0){
            	obj.addClass("btn_loading");
                obj.html('重新获取('+ t +')');
                t--;
            }else{
                obj.removeClass("btn_loading");
                obj.removeAttr("disabled");
                obj.html("获取验证码");
                clearInterval(btntime);
                t = 120;
            }
        },1000)
	}
	return btntime
}
//清楚按钮倒计时
GHutils.clearBtnTime = function(btnTime,obj){
	if(obj){
		obj.removeClass("btn_loading");
        obj.removeAttr("disabled");
        obj.html("获取验证码");
        clearInterval(btnTime);
	}
}

/**
 * 将数值截取后2位小数,格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
GHutils.formatCurrency = function(num) {
	num +=''
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(GHutils.Fmul(num, 100));
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + num + '.' + cents);
}

GHutils.formatIntCurrency = function(num) {
	num = parseInt(num.toString().replace(/\$|\,/g, '')).toString();
	if (isNaN(num))
		num = "0";
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return num;
}
GHutils.tableToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,',
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
		base64 = function(s) {
			return window.btoa(unescape(encodeURIComponent(s)))
		},
		format = function(s, c) {
			return s.replace(/{(\w+)}/g, function(m, p) {
				return c[p];
			})
		}
	return function(table, name) {
		if (!table.nodeType) table = document.getElementById(table)
		var ctx = {
			worksheet: name || 'Worksheet',
			table: table.innerHTML
		}
		window.location.href = uri + base64(format(template, ctx))
	}
})();
//修复JS浮点的加减乘除运算 Fadd加 Fsub减 Fmul乘 Fdiv除
GHutils.Fadd = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (GHutils.Fmul(a, e) + GHutils.Fmul(b, e)) / e;
}
GHutils.Fsub = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (GHutils.Fmul(a, e) - GHutils.Fmul(b, e)) / e;
}

GHutils.Fmul = function(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch (f) {}
	try {
		c += e.split(".")[1].length;
	} catch (f) {}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

GHutils.Fdiv = function(a, b) {
		var c, d, e = 0,
			f = 0;
		try {
			e = a.toString().split(".")[1].length;
		} catch (g) {}
		try {
			f = b.toString().split(".")[1].length;
		} catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), GHutils.Fmul(c / d, Math.pow(10, f - e));
	}
	//转几位小数点（按位数截取），带后缀（单位）GHutils.toFixed(10000,4,"元") = 10000.0000元
GHutils.toFixeds = function(numb, digital, suffix) {
		var digital = digital ? digital : 0;
		var fixed = 1;
		for (var i = 0; i < digital; i++) {
			fixed = fixed * 10;
		}

		if (numb == undefined || numb.length == 0) {
			return "--";
		} else {
			var numb = GHutils.Fmul(Number(numb), fixed);
			return (parseInt(numb) / fixed).toFixed(digital) + (suffix ? suffix : "");
		}
	}
	//获取浏览器URL参数
GHutils.parseUrlParam = function(url) {
		var urlParam = {};
		if (url.indexOf("?") < 0) {
			return urlParam;
		}
		var params = url.substring(url.indexOf("?") + 1).split("&");
		for (var i = 0; i < params.length; i++) {
			var k = params[i].substring(0, params[i].indexOf("="));
			var v = params[i].substring(params[i].indexOf("=") + 1);
			if (v.indexOf("#") > 0) {
				v = v.substring(0, v.indexOf("#"));
			}
			urlParam[k] = v;
		}
		return urlParam;
	}
	/**
	 *检测登录状态，并跳转 
	 * @param {Object} goback 登录完重新回到哪个页面
	 */
GHutils.checkLogin = function(goback) {
	var r = false;
	GHutils.load({
		url: GHutils.API.USER.getstatus + '?platform=wx',
		type: "post",
		async: false,
		callback: function(result) {
			if (result.errorCode == 0) {
				if(result.login){
					r = true;
				}else{
					if (goback) {
						window.location.href = '../../html/user/user-login.html?goback=' + goback;
					} else {
						window.location.href = '../../html/user/user-login.html';
					}
				}
			} 
		}
	});
	return r;
}

//回退
GHutils.goback = function(trace) {
	if (!trace) {
		history.go(-1);
	} else {
		window.location.href = trace;
	}
}

GHutils.checkErrorCode = function(result, tips) {
	var that = this;
	var tips = tips || false;
	var icon = '<span class="app-icon app-icon-clear"></span>';
	//that.log(result);
	if (result.errorCode == 0) {
		return true;
	} else {
		if (tips) {
			$(tips).html(result.errorMessage);
			//			if(GHutils.tipsTimer){
			//				clearTimeout(GHutils.tipsTimer);
			//			}
			//			GHutils.tipsTimer = setTimeout(function(){
			//				$(tips).html("&nbsp;");
			//			},3000);

		} else {
			alert(result.errorMessage);
		}
		GHutils.processingHide();
		return false;
	}
}

//打印信息
GHutils.log = function(msg) {
		console.log(JSON.stringify(msg));
	}
	//悬浮提示
GHutils.warn = function(content) {
	$.tips({
		content: content,
		stayTime: 2000,
		type: "warn"
	})
}

GHutils.showError = function(content, tips) {
	if (tips) {
		var icon = '<span class="app-icon app-icon-clear"></span>';
		$(tips).html(icon + content);
		//		if(GHutils.tipsTimer){
		//			clearTimeout(GHutils.tipsTimer);
		//		}
		//		GHutils.tipsTimer = setTimeout(function(){
		//			$(tips).html("&nbsp;");
		//		},3000);
		return
	}
	if (content) {
		GHutils.warn(content);
	}
}

GHutils.bindClear = function() {
	$(".ui-icon-close").on("click", function(e) {
		$(this).parent().find("input").val("");
	})
}

GHutils.processingShow = function(cnt) {
	var cnt = cnt || 　'处理中...'
	this.loading = $.loading({
		content: cnt,
	})
}

GHutils.processingHide = function() {
		if (this.loading) {
			this.loading.loading("hide");
		}
	}
	//打开列表链接
GHutils.listlink = function() {
	if ($ && $(".ui-arrowlink")) {
		$(".ui-arrowlink").on("tap", function() {
			var href = $(this).attr("target-href");
			if (href) {
				location.href = href;
			}
		})
	}
}

GHutils.bindEvent = function() {
	window.onhashchange = function() {
			var href = location.href;
			if (href.lastIndexOf("#") > 0) {
				var step = href.substring(href.lastIndexOf("#"));
				if (step) {
					$(".steps").forEach(function(e, i) {
						$(e).hide();
					});
					$(step).show();
				}
			}
		}
		//页面连接
	$(".app_nav_links").on("click", function() {
		var _href = $(this).attr("data-href");
		window.location.href = _href;
	});
	//页面内跳转
	$(".app_gostep").on("click", function() {
		var _step = $(this).attr("data-step");
		GHutils.goStep(_step);
	});
}
GHutils.bindKeyDown = function() {
		$("input").on("keyup", function(e) {
			var _val = $(this).val();
			if (e.keyCode == 13) {
				var tid = $(this).attr("triggerId");
				if (tid) {
					$(tid).trigger("click");
				}
			}
			//if(_val != ''){
			//	$(this).next(".ui-icon-close").show();
			//}else{
			//	$(this).next(".ui-icon-close").hide();
			//}
		});
		//$("input").blur(function(){
		//	$(this).next(".ui-icon-close").hide();
		//});
		//$("input").focus(function(){
		//	var _val = $(this).val();
		//	var readonly = $(this).attr("readonly");
		//	if(_val != '' && readonly != "true"){
		//		$(this).next(".ui-icon-close").show();
		//	}
		//});
	}
	//单页面内部显示切换
GHutils.goStep = function(step) {
	location.href = "#" + step;
}

GHutils.bindEventBanner = function(){
	$(".app_nav_links").on("click", function() {
		var _href = $(this).attr("data-href");
		window.location.href = _href;
	});
}

/**
 * 获取banner
 * @param {Object} obj
 * @param {Object} channel 渠道编号
 * @param {Object} singleChannel ok-只当前渠道 no-当前渠道+all渠道
 */
GHutils.getBanner = function(obj, channel, singleChannel){
	GHutils.load({
		url: GHutils.API.CMS.getBanner + '?channelCode=' + channel + '&singleChannel=' + singleChannel,
		data: {},
		type: "post",
		async: false,
		callback: function(result) {
			if (result.errorCode == 0) {
				var rows = result.rows;
				var bannerHtml = '';
				for(var i in rows){
					if(rows[i].linkUrl){
						bannerHtml += '<li><img src="' + rows[i].imageUrl + '" class="app_nav_links" data-href="' + rows[i].linkUrl + '"/></li>';
					}else{
						bannerHtml += '<li><img src="' + rows[i].imageUrl +  '"/></li>';
					}
				}
				$(obj).html(bannerHtml);
				GHutils.bindEventBanner();
				//初始化banner
				var _len = $(".ui-slider-content li").length;
				
				if( _len > 1 ){
					var slider = new fz.Scroll('.ui-slider', {
				        role: 'slider',
				        indicator: true,
				        autoplay: false,
				        interval: 3000
				    });
				}
			}
		}
	}); 
}

//表单输入验证
GHutils.checkInput = function(obj, regnum) {
		var regTel = /^[0-9]{0,11}$/g; //电话号码(0)
		var regPwd = /^([\x21-\x7e]|[a-zA-Z0-9]){0,16}$/g; //密码(1)
		var regNum = /^\d+$/g; //纯数字(2)
		var regNump = /^(([1-9]\d*)|0)(\.\d{0,2})?$/g; //含两位小数数字(3)
		var regNumId = /^\d{0,17}(\d|x|X)$/g; //身份验证(4)
		var regYzm = /^\d{0,6}$/g; //纯数字(5)
		var regMoney = /^((([1-9]{1}\d{0,7}))|(100000000))?$/; //1亿以内整数金额(6)
		//var	regTxt    = /^[\u4E00-\u9FA5]$/g;//汉字(4)

		var value = obj.value;
		if (3 == regnum || 6 == regnum) {
			value = value.replace(",", "");
		}
		var regs = [regTel, regPwd, regNum, regNump, regNumId, regYzm, regMoney];
		var _val = value.match(regs[regnum]);
		var Start = obj.selectionStart;

		//console.log(_val);

		if (_val || value == '') {
			value == '' ? _val = value : _val = _val[0];
			obj.setAttribute("app_backvalue", _val);
		} else {
			_val = obj.getAttribute("app_backvalue");
			//Start = Start - 1;
		}
		obj.value = _val;
		//设置光标位置
		obj.selectionStart = obj.selectionEnd = Start;
	}
	//表单提交验证
GHutils.validate = function(scope) {
		var result = true;

		$("#" + scope + " input,#" + scope + " select,#" + scope + " textarea").each(function(d, i) {
			var dom = $(i);
			var valid = dom.attr("valid");
			if(valid && result) {
				var ops = JSON.parse(valid);

				var tips = ops.tipsbox || false;

				//console.log(dom)

				if(ops.required || dom.val()) {
					if(!dom.val()) {

						GHutils.showError(ops.msg + '不能为空', tips);
						result = false;
						return;
					}
					var e = ops;
					if (e.minLength) {
						if (dom.val().length < e.minLength) {
							GHutils.showError(e.msg + '不能小于' +e.minLength + '位', tips);
							result = false;
							return;
						}
					}
					if (e.maxLength) {
						if (dom.val().length > e.maxLength) {
							GHutils.showError(e.msg + '不能大于' +e.minLength + '位', tips);
							result = false;
							return;
						}
					}
					if (e.between) {
						if (dom.val().length < e.between[0] || dom.val().length > e.between[1]) {
							GHutils.showError(e.msg + '长度要' + e.minLength + '位和'  + e.minLength + '位之间', tips);
							result = false;
							return;
						}
					}
					if (e.finalLength) {
						if (dom.val().length != e.finalLength) {
							GHutils.showError(e.msg + '为' +e.finalLength + '位', tips);
							result = false;
							return;
						}
					}
					if (e.equals) {
						if (dom.val() != $("#" + e.equals).val()) {
							GHutils.showError(e.msg + '和' + e.equalsMsg + '不一致', tips);
							result = false;
							return;
						}
					}

					if (e.mobilePhone) {
						if (!dom.val().match("^1[3|4|5|7|8][0-9]{9}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.identityCard) {
						if (!dom.val().match("^\\d{17}[X|\\d|x]$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.passWord) {
						if (!dom.val().match("^([\x21-\x7e]|[a-zA-Z0-9]){6,16}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					}else if (e.payPassWord) {
						if (!dom.val().match("^[0-9]{6}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.debitCard) {
						if (!dom.val().match("^\\d{16,19}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.positiveInteger) {
						if (!dom.val().match("^[0-9]+\\d*$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.positiveNumber) {
						if (!dom.val().match("^[0-9]+\.?[0-9]*$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.floatNum) {
						if (!dom.val().match("^(([1-9]\\d*)|0)(\.\\d{0,2})?$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.nickName) {
						if (!dom.val().match("^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.invitationNum) {
						if (!dom.val().match("^[A-Za-z0-9]{7}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if (e.realName) {
						if (!dom.val().match("^[\u4E00-\u9FA5A-Za-z0-9_·]{1,20}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					}
				}
			}
		});
		return result;
	},
	//获取场景id
GHutils.getSceneid = function() {
	var params = GHutils.parseUrlParam(location.href);
	if (params.code) {
		GHutils.load({
			url: GHutils.API.WX.getsceneid,
			params: {
				code: params.code,
				tp: "10001"
			},
			async: true,
			type: "post",
			callback: function(result) {
				GHLocalStorage.put("tjs_sceneid", result.body.sceneid || "");
			}
		});
	}
}

//获取openid
GHutils.getOpenid = function() {
	var params = GHutils.parseUrlParam(location.href);
	if (params.code) {
		GHutils.load({
			url: GHutils.API.WX.getopenid,
			params: {
				code: params.code,
				tp: "10001"
			},
			async: false,
			type: "post",
			callback: function(result) {
				GHLocalStorage.put("gh_openid", result.body.openid || "");
			}
		});
	}
}

//判断是否登录，未登录跳转登录页面，已登录返回登录信息
/*参数示例
 *op = {
 *	gologin:"true",string类型，默认是"true";
 *	goback:url,string类型，默认是当前地址，用于登录返回
 *	callback:function(){}
 *	errcallback:function(){}
 *}
 */
GHutils.getUserInfo = function(op) {
		var info = null;
		op = op ? op : {};
		var gologin = op.gologin || "true";
		var warn = op.warn || "true";
		var goback = op.goback || window.location.href;
		var goTime = op.times || 3000;
		var loginstate = true;
		var txt = '';
		GHutils.load({
			url: GHutils.API.ACCOUNT.userinfo,
			type: "post",
			async: false,
			callback: function(result) {
				if (result.errorCode == 0) {
					if(result.islogin){
						info = result;
						if (op.callback && typeof(op.callback) == 'function') {
							op.callback.apply(null, arguments);
						}
					}else{
						loginstate = false;
						txt = '未登录或登录已超时，请先登录。';
						//退出登录
						GHutils.loginOut();
					}
				} else {	
					loginstate = false;
					txt = result.errorMessage;
					if (op.errcallback && typeof(op.errcallback) == 'function') {
						op.errcallback.apply(null, arguments);
					}
				}
				if(!loginstate){
					if (warn == "true") {
						GHutils.warn(txt);
					}
					if (gologin == "true") {
						setTimeout(function() {
							window.location.href = '../../html/user/user-login.html?goback=' + goback;
						}, goTime);
					}
				}
			}
		});
		return info;
	}
	//购买新手产品时判断用户是否为新手用户
	GHutils.isFreshman = function(){
		var freshman = false
		GHutils.load({
			url: GHutils.API.ACCOUNT.usermoneyinfo,
			type: "post",
			async: false,
			callback: function(result) {
				if(GHutils.checkErrorCode(result)){
					if(result.isFreshman && result.isFreshman == 'yes'){
						freshman = true
					}else{
						GHutils.warn('非新手用户不可购买新手产品')
					}
				}
			}
		});
		return freshman
	}
	//判断是否实名认证或是否设置支付密码
	GHutils.checkDepWit = function(){
		var info = {}, ifTrue = true;
		GHutils.getUserInfo({
            callback: function (result) {
                info = result;
            }
        });
		if (!info.idNumb) {
			GHutils.warn('请先实名认证');
			ifTrue = false
			setTimeout(function(){
				window.location.href = "../../html/user/user-setting.html"
			}, 1000)
		} else if(info.paypwd=='noSet'){
			GHutils.warn('请先设置支付密码');
			ifTrue = false
			setTimeout(function(){
				window.location.href = "../../html/user/user-setting.html"
			}, 1000)
		}
		return ifTrue;
	}
	//判断是否为数组
GHutils.isArray = function(obj) {
		if (!obj) {
			return false;
		}
		return Object.prototype.toString.call(obj) == "[object Array]";
	}
	//返回代理地址
GHutils.filterProxyUrl = function(obj) {
	if (!obj) {
		return obj;
	}
	var index = obj.indexOf("/rcp-war");
	if (-1 == index)
		return obj;

	return obj.substring(index);
}

//获取图形码
GHutils.changeVCode1 = function(obj) {
	$(obj).attr('src', '/app/common/verifyImage.jsp?Rand=' + Math.random() * 10000);
}
GHutils.slider = function(obj, cfg) {
		var _st = 0;

		if (cfg == "show") {
			setTimeout(function() {
				$(obj).addClass("app_show");
			}, 150);
		} else {
			$(obj).removeClass("app_show");
			_st = 500;
		}
		setTimeout(function() {
			$(obj).dialog(cfg);
		}, _st);

	}
	//获取本地存储数据
var GHLocalStorage = {
	put: function(key, value) {
		if (!key) {
			return;
		}
		if (typeof(value) == "object") {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, value);
		}
	},
	get: function(key) {
		return JSON.parse(localStorage.getItem(key));
	},
	getRaw: function(key) {
		return localStorage.getItem(key) || null;
	},
	remove: function(key) {
		localStorage.removeItem(key);
	},
	clear: function() {
		localStorage.clear();
	}
};

//清除投资卡券相关数据
GHutils.clearCouponLocalStorage = function(){
		GHLocalStorage.put("availableCouponList", {});
		GHLocalStorage.put("notAvailableCouponList", {});
		GHLocalStorage.put("checkedCoupon", {});
		GHLocalStorage.put("checkedCouponBackups", {})
		GHLocalStorage.put("maxProfitOidList", {})
	}

//活期产品根据不同状态返回收益率和万份收益数据
GHutils.switchShowType = function(tradeObj, detail, showSign){
		if(!tradeObj){
			return {"interestSec": 0, "profit": 0}
		}
		var annualInterestSec = [], rewardYieldRange = [], tenThsPerDayProfit = [], rewardTenThsProfit = [];
		var annualInterestSec0 = "", annualInterestSec1 = "", rewardYieldRange1 = "";
		var tenThsPerDayProfit0 = "", tenThsPerDayProfit1 = "", rewardTenThsProfit1 = "";
		var interestSec = "", profit = "";
		switch (tradeObj.showType) {
			case "1" : annualInterestSec = tradeObj.annualInterestSec.split("-");
					   annualInterestSec0 = annualInterestSec[0].replace('%','');
					   annualInterestSec1 = annualInterestSec[1].replace('%','');
					   if(detail){
							interestSec = tradeObj.annualInterestSec;
					   }else if(showSign){
							interestSec = annualInterestSec0+showSign+"-"+annualInterestSec1
					   }else{
							interestSec = annualInterestSec0+"-"+annualInterestSec1
					   }
					   tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split("-");
					   tenThsPerDayProfit0 = tenThsPerDayProfit[0];
					   tenThsPerDayProfit1 = tenThsPerDayProfit[1];
					   if(tradeObj.rewardInterest){
					   	interestSec += "+"+GHutils.toFixeds(tradeObj.rewardInterest, 2)
					   }
					   profit = GHutils.toFixeds(tenThsPerDayProfit0,4,'')+"-"+GHutils.toFixeds(tenThsPerDayProfit1,4,'')
					   break
			case "2" : if(detail){
							interestSec = tradeObj.annualInterestSec;
					   }else{
							interestSec = tradeObj.annualInterestSec.replace('%','');
					   }
					   if(tradeObj.rewardInterest){
					   	interestSec += "+"+GHutils.toFixeds(tradeObj.rewardInterest, 2)
					   }
					   profit = GHutils.toFixeds(tradeObj.tenThsPerDayProfit,4,'');
					   break
			case "4" : annualInterestSec = tradeObj.annualInterestSec.split("-");
					   annualInterestSec1 = parseFloat(annualInterestSec[1].replace('%',''));
					   rewardYieldRange = tradeObj.rewardYieldRange.split("-");
					   if(rewardYieldRange.length == 1){
							rewardYieldRange1 = parseFloat(rewardYieldRange[0].replace('%',''));
					   }else{
							rewardYieldRange1 = parseFloat(rewardYieldRange[1].replace('%',''));
					   }
					   tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split("-");
					   tenThsPerDayProfit0 = tenThsPerDayProfit[0];
					   tenThsPerDayProfit1 = parseFloat(tenThsPerDayProfit[1]);
					   rewardTenThsProfit = tradeObj.rewardTenThsProfit.split("-");
					   if(rewardTenThsProfit.length == 1){
							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[0]);
					   }else{
							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[1]);
					   }
					   if(detail){
							annualInterestSec0 = annualInterestSec[0];
							interestSec = annualInterestSec0+"-"+GHutils.toFixeds(annualInterestSec1 + rewardYieldRange1,2,'%')
					   }else if(showSign){
							annualInterestSec0 = annualInterestSec[0].replace('%',showSign);
							interestSec = annualInterestSec0+"-"+GHutils.toFixeds(annualInterestSec1 + rewardYieldRange1,2)
					   }else{
							annualInterestSec0 = annualInterestSec[0].replace('%','');
							interestSec = annualInterestSec0+"-"+GHutils.toFixeds(annualInterestSec1 + rewardYieldRange1,2,'')
					   }
					   profit = GHutils.toFixeds(tenThsPerDayProfit0,4,'')+"-"+GHutils.toFixeds(tenThsPerDayProfit1 + rewardTenThsProfit1,4,'')
					   break
			case "5" : annualInterestSec0 = parseFloat(tradeObj.annualInterestSec.replace('%',''));
					   rewardYieldRange = tradeObj.rewardYieldRange.split("-");
					   if(rewardYieldRange.length == 1){
							rewardYieldRange1 = parseFloat(rewardYieldRange[0].replace('%',''));
					   }else{
							rewardYieldRange1 = parseFloat(rewardYieldRange[1].replace('%',''));
					   }
					   tenThsPerDayProfit0 = parseFloat(tradeObj.tenThsPerDayProfit);
					   rewardTenThsProfit = tradeObj.rewardTenThsProfit.split("-");
					   if(rewardTenThsProfit.length == 1){
							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[0]);
					   }else{
							rewardTenThsProfit1 = parseFloat(rewardTenThsProfit[1]);
					   }
					   if(detail){
							interestSec = GHutils.toFixeds(annualInterestSec0,2,'')+"%+"+GHutils.toFixeds(rewardYieldRange1,2,'%')
					   }else if(showSign){
							interestSec = GHutils.toFixeds(annualInterestSec0,2,showSign)+"+"+GHutils.toFixeds(rewardYieldRange1,2)
					   }else{
							interestSec = GHutils.toFixeds(annualInterestSec0,2,'')+"+"+GHutils.toFixeds(rewardYieldRange1,2,'')
					   }
					   profit = GHutils.toFixeds(tenThsPerDayProfit0,4,'')+"-"+GHutils.toFixeds(tenThsPerDayProfit0 + rewardTenThsProfit1,4,'')
					   break
			default : break
		}
		
		return {"interestSec": interestSec, "profit": profit}
	}

GHutils.formatAnnual = function(num,fontsize){
	var numlsit = num.split("-");
	var numTxt = '';
	if(numlsit.length == 1){
		if(numlsit[0].indexOf('+')>-1){
			var idx = numlsit[0].indexOf('+')
			numTxt = GHutils.toFixeds(numlsit[0].substring(0,idx).replace("%",""),2)+'%';
			numTxt+= '<span style="font-size:'+fontsize+'px">+'+GHutils.toFixeds(numlsit[0].substr(idx+1),2)+'%</span>'
		}else{
			numTxt = GHutils.toFixeds(numlsit[0].replace("%",""),2)+'%';
		}
	}else{
		var _num = numlsit[0].replace("%","");
		
		//海洋昨天跟金砖确认了，实际生产的不会有区间加收益这种
//		if(numlsit[1].indexOf('+')>-1){
//			var idx = numlsit[1].indexOf('+')
//			numTxt = '<span class="f_22" style="font-size:'+fontsize+'px">'+ GHutils.toFixeds(_num,0) +'</span>-' +numlsit[1].substring(0,idx).replace("%","")+'%'
//			numTxt+= '<span style="font-size:'+fontsize+'px">+'+numlsit[1].substr(idx+1)+'%</span>'
//		}else{
			numTxt = '<span class="f_22" style="font-size:'+fontsize+'px">'+ GHutils.toFixeds(_num,0) +'</span>-' + numlsit[1].replace("%","")+'%'
//		}
	}
	
	return  numTxt;
}

//产品标签显示
GHutils.showProductLabels = function(labelCodes){
	var type = "";
	if(labelCodes && labelCodes.length > 0){
//		labelCodes.forEach(function(e, i){
//			if(e == "recom"){
//				type += '<span class="app_tag_icon app_tag_c3 app_fr">推荐</span>'
//			}else if(e == "freshman"){
//				type += '<span class="app_tag_icon app_tag_c1 app_fr">新手</span>'
//			}else if(e == "seckill"){
//				type += '<span class="app_tag_icon app_tag_c2 app_fr">秒杀</span>'
//			}else if(e == "8"){
//				type += '<span class="app_tag_icon app_tag_c4 app_fr">体验金</span>'
//			}else{
//				type += '<span class="app_tag_icon app_tag_c5 app_fr">'+e+'</span>'
//			}
//		})
		GHutils.forEach(labelCodes,function(i,e){
			if(e == "recom"){
				type += '<span class="app_tag_icon app_tag_c3 app_fr">推荐</span>'
			}else if(e == "freshman"){
				type += '<span class="app_tag_icon app_tag_c1 app_fr">新手</span>'
			}else if(e == "seckill"){
				type += '<span class="app_tag_icon app_tag_c2 app_fr">秒杀</span>'
			}else if(e == "8"){
				type += '<span class="app_tag_icon app_tag_c4 app_fr">体验金</span>'
			}else{
				type += '<span class="app_tag_icon app_tag_c5 app_fr">'+e+'</span>'
			}
		})
	}
	return type
}

//判断产品是否为某种标签产品,labelArr为标签数组,label为标签
GHutils.isLabelProduct = function(labelArr, label){
	var labelProduct = false
	if(labelArr && labelArr.length > 0){
//		labelArr.forEach(function(e, i){
//			if(e == label){
//				labelProduct = true
//			}
//		})
		GHutils.forEach(labelArr,function(i,e){
			if(e == label){
				labelProduct = true
			}
		})
	}
	return labelProduct
}

//获取当前用户体验金
GHutils.getTasteCoupon = function(){
	var tasteCouponList = [], couponId = "", amount = 0;
	GHutils.load({
		url: GHutils.API.ACCOUNT.coupon +"?page=1&rows=10000&status=notUsed",
		type:'post',
		async: false,
		callback: function(result){
			if(result.errorCode == 0){
				if(result.rows && result.rows.length > 0){
					for(var p in result.rows){
						if(result.rows[p].type == "tasteCoupon"){
							tasteCouponList.push(result.rows[p])
						}
					}
					if(tasteCouponList.length > 0){
						var amountList = [], maxAmountObjList = [], msecList = [], minMsecObjList = [], maxAmount = 0, minMsec = 0;
						for(var p in tasteCouponList){
							amountList.push(tasteCouponList[p].amount)
						}
						maxAmount = Math.max.apply(Math, amountList)
						for(var p in tasteCouponList){
							if(tasteCouponList[p].amount == maxAmount){
								maxAmountObjList.push(tasteCouponList[p]);
							}
						}
						for(var p in maxAmountObjList){
							var dateArr = maxAmountObjList[p].finish.split('-');
							msecList.push(new Date(dateArr[0],(dateArr[1]-1),dateArr[2]).getTime());
							maxAmountObjList[p].msec = msecList[p];
						}
						minMsec = Math.min.apply(Math, msecList)
						for(var p in maxAmountObjList){
							if(maxAmountObjList[p].msec == minMsec){
								minMsecObjList.push(maxAmountObjList[p]);
							}
						}
						couponId = minMsecObjList[0].oid
						amount = minMsecObjList[0].amount
					}
				}
			}else if(result.errorCode != 10002 && result.errorCode != 20005){
				GHutils.warn(result.errorMessage)
			}
		}
	})
	return {"tasteCouponList": tasteCouponList, "couponId": couponId, "amount": amount}
}

//GHutils.sendBindWechatTpl = function() {
//	var openId = GHLocalStorage.getRaw("gh_openid");
//	if (openId != null) {
//		var nowDate = GHutils.formatTimestamp({
//			showtime: "false"
//		});
//		var keywords = [GHutils.TPL.BINDWECHAT.title, GHutils.TPL.BINDWECHAT.tianjsAccount,
//			GHutils.TPL.BINDWECHAT.wechatAccount, nowDate, GHutils.TPL.BINDWECHAT.desc
//		];
//
//		$.ajax({
//			url: GHutils.API.WX.sendtplmsg,
//			type: "post",
//			async: false,
//			data: {
//				openId: openId,
//				tpl: "ACCOUNT_BOUND",
//				color: "ff9900",
//				url: "https://wechat.tianjs.com/tjswx/html/account/account.html",
//				keywords: keywords
//			},
//			complete: function(result) {}
//		});
//	}
//}
GHutils.linkPages = function(){
	var $ = Zepto || false;
	if($){
		$('.app_link_pages').off().on('click',function(){
			var _href = $(this).attr("data-links");
			var _login = $(this).attr("data-checklogin");
			if(_login && _login == "true" && GHutils.checkLogin(_href)){
				window.location.href = _href;
			}else{
				window.location.href = _href;
			}
			
		});
	}
}
GHutils.checkRechargeOrWithdraw = function(callback){
		var userInfo = GHutils.getUserInfo
		if(!userInfo.name){
			GHutils.warn('请先完成实名认证!');//未完成实名认证
			setTimeout(function(){
				window.location.href = '../user/user-setting.html';
			},1000);
		}else if(userInfo.paypwd == "noSet"){
			GHutils.warn('请先设置支付密码!');//为设置支付密码
			setTimeout(function(){
				window.location.href = '../user/user-setting.html';
			},1000);
		}else if (callback && typeof(callback) == 'function') {
			callback.apply(null, arguments);
		}
	}
//格式化时间格式
	/*param{
	 * data:time,
	 * type:0,
	 * showtime:"true"
	 * }
	 * */
GHutils.formatTimestamp = function(param) {
		var d = new Date();
		d.setTime(param && param.time || d);
		var datetime = null;
		var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
		var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

		if (param.showtime == "false") {
			datetime = x + y;
		} else {
			datetime = x;
		}
		return datetime;
	}

//绑定回车键
GHutils.inputBindKey = function() {
	$(".inputBindKey").off().on("keyup",function(e){
		if(e.keyCode == 13){
			if($(this).val() == ''){
				return
			}			
            var trigger = $(this).attr("data-trigger");
            if(trigger){
            	$(trigger).trigger("click");
            }
            
        }
	})
}

/*
 * set cookie
 * @params : cookie name, value, time
 */
GHutils.setCookie = function(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =  c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
}
GHutils.getCookie = function(name) {
    var str = "; " + document.cookie + "; ",
        index = str.indexOf("; " + name + "=");
    if (index != -1) {
        var tempStr = str.substring(index + name.length + 3, str.length),
            target = tempStr.substring(0, tempStr.indexOf("; "));

        return decodeURIComponent(target);
    }
    return null;
}

//退出登录
GHutils.loginOut = function(reload) {
    GHutils.load({
	    url: GHutils.API.USER.doLogout,
	    data: {},
	    type: "post",
	    callback: function(result) {
	    	if(reload){
	    		window.location.reload();
	    	}
			
	    }
    })
}
//切换显示
GHutils.boxSwitch = function(hide,show) {
	
	if(hide){
		$(hide).hide();
	}
	if(show){
		$(show).fadeIn(300)
	}
   
    
}
GHutils.isLogin = function(func){
		//判断用户是否在登陆状态，
		GHutils.load({
			url: GHutils.API.USER.isLogin,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				if(result.islogin){
					if(func){
						func()
					}
				}else{
					window.location.href = "index.html"
				}
				
			}
		})
}

GHutils.smipleTab = function(){
	$(".tab_nav").off().on("click",function(){
		var idx = $(this).index();
		//判断是否为当前页签
		if($(this).hasClass("active")){
			return
		}
		
		$(this).addClass("active").siblings(".tab_nav").removeClass("active");
		$(".tab_content_box").hide().eq(idx).fadeIn(300);
	})
}
GHutils.getHash = function() {
			var hash = '';

			if(location.hash.indexOf('?') >= 0) {
				hash = location.hash.substring(1, location.hash.indexOf('?'))
			} else {
				hash = location.hash.substr(1)
			}
			return hash;
		}
GHutils.changeHash = function(controls) {
			location.hash = controls;
		}
//根据配置code查询指定用户是否可用
GHutils.checkEnable  = function(code,phone,func) {
	var urlParam = '?code='+code
	if(phone){
		urlParam +='&phone='+phone
	}
	
	GHutils.load({
		url: GHutils.API.ACCOUNT.checkEnable+urlParam,
		data: {},
		type: "post",
		callback: function(result) {
			if(result.errorCode != 0){
				return false;
			}
			if(typeof(func)  == 'function'){
				if(result.type == 'configure'){
					func(result.content)
				}else{
					func(result.status)
				}
			}
		}
	})
}
//str.trim()方法ie8不兼容解决
GHutils.trim  = function(str) {
	str == null?str='':str+=''
	if(typeof(str) == 'undefined')str= ''
	return str.replace(/^\s+|\s+$/g, '')
}
//.forEach方法不兼容解决
GHutils.forEach = function(list,func){
	if(!(list instanceof Array)) return
	if(list.length == 0) return
//	$.each(list,function(i,element) {
//		 func(i,element)
//		 //跳出循环的功能还没加
//	});
	var rlt = false;
	var len = list.length;
	for(var i=0;i<len;i++){
		if(func(i,list[i])){
			i = len
			rlt = true
		}
	}
	return rlt;
	
}

//获取银行卡单笔限额
GHutils.getBankStyle = function(bankName,func) {
	var bankcode = {
			"中国农业银行": "103",
			"农业银行": "103",
			"中国工商银行": "102",
			"工商银行": "102",
			"中国银行": "104",
			"中国建设银行": "105",
			"建设银行": "105",
			"交通银行": "301",
			"中信银行": "302",
			"中国光大银行": "303",
			"光大银行": "303",
			"华夏银行": "304",
			"中国民生银行": "305",
			"民生银行": "305",
			"广发银行": "306",
			"平安银行": "307",
			"招商银行": "308",
			"兴业银行": "309",
			"上海浦东发展银行": "310",
			"中国邮政储蓄银行":"100"
		}
		var bankCodes = {
			"103": "ABC",
			"102": "ICBC",
			"104": "BOC",
			"105": "CCB",
			"301": "COMM",
			"302": "CITIC",
			"303": "CEB",
			"304": "HXB",
			"305": "CMBC",
			"306": "GDB",
			"307": "SZPAB",
			"308": "CMB",
			"309": "CIB",
			"310": "SPDB",
			"100": "PSBC"
		}
		var codes = bankCodes[bankcode[bankName]]
    	GHutils.load({
			url: GHutils.API.ACCOUNT.getBankStyle+'?codes=["'+codes+'"]',
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				if(func){
					func(result)
				}
			}
		})
}

//统计代码
$(function(){
	

	var _hmt = _hmt || [];
	(function() {
	  setTimeout(function(){
	  	var hm = document.createElement("script");
	    hm.src = "https://hm.baidu.com/hm.js?d361836c2f08b7ed0f588fd60827a759";
	    var s = document.getElementsByTagName("script")[0]; 
	    s.parentNode.insertBefore(hm, s);

	    GHutils.load({
			url: HOST+'/jzucapp/checkLogin',
			data: {},
			type: "post",
			callback: function(result) {
				
			}
		})


	  },10000)
	  
	})();
})
