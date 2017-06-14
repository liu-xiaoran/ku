//滚回顶部
$(".sidebarTops").off().on("click", function() {
	$('html, body').stop().animate({
		'scrollTop': '0px'
	}, 300);
})

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var setCookie = function(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
}

window.cid = getQueryString("cid") ? getQueryString("cid") : "999920170508100021";
getQueryString("cid") && setCookie("channelid", window.cid, 3);

//新更改的    落地页转走时要带上信息，不然不能验证
原网址 + window.cid
var getCookie = function(name) {
	var str = "; " + document.cookie + "; ",
		index = str.indexOf("; " + name + "=");
	if(index != -1) {
		var tempStr = str.substring(index + name.length + 3, str.length),
			target = tempStr.substring(0, tempStr.indexOf("; "));

		return decodeURIComponent(target);
	}
	return null;
}

//解决获取焦点出现键盘时悬浮框上升的bug
$("input[type='text'],input[type='password'],input[type='number']").focus(function() {
	$(".footer").css("position", "absolute")
}).blur(function() {
	$(".footer").css("position", "fixed")
})

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

// 毫秒时间戳转换为时间 
vm.turnDate = function(tm) {
	var tt = new Date(tm).toLocaleString();
	return tt;
}
// 添加post例证。落地页管理工具中的
vm.tableParams5 = new ngTableParams({
	page: 1, // show first page
	count: 10 // count per page
}, {
	total: 20, // length of data
	counts: [], // hide page counts control
	getData: function($defer, params) {
		pageInfo.pageNo = params.url().page;
		pageInfo.pageSize = 10;
		$http
			.post('/ZYManager/api/platforMail/list', {
				data: data,
				reqTime: '' + (new Date()).getTime(),
				pf: "PC",
				pageInfo: pageInfo
			})
			.success(function(response) {
				// console.log(response.data)
				vm.channels = JSON.stringify(response.data)

				//添加替换条件
				vm.channels = vm.channels.replace(/toApprove/g, "待审核")
					.replace(/pass/g, "已发送")
					.replace(/refused/g, "已驳回")
					.replace(/delete/g, "已删除")
					.replace(/person/g, "个人信息")
					.replace(/all/g, "全站信息")

				vm.channels = JSON.parse(vm.channels)

				$timeout(function() {
					// update table params
					params.total(response.pageInfo.totalSize);
					// set new data
					$defer.resolve(response.data);
				}, 500);
			})
			.error(function(response) {
				//alert(response.message);

				vm.errorAlert = "错误内容：" + response.serverMsg
				ngDialog.openConfirm({
					template: 'errorAlertId',
					className: 'ngdialog-theme-default',
					preCloseCallback: function( /*value*/ ) {
						var nestedConfirmDialog = ngDialog.openConfirm({
							template: '<p>放弃?</p>' +
								'<div>' +
								'<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">不' +
								'<button type="button" class="btn btn-primary" style="margin-left:80%" ng-click="confirm(1)">是的' +
								'</button></div>',
							plain: true,
							className: 'ngdialog-theme-default'
						});
						return nestedConfirmDialog;
					},
					scope: $scope
				})

			});

	}
});

//获取当前月份的日期
var GetDateStr=function(date) {
    var dd = new Date(date);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m=m<10?"0"+m:m;
    d=d<10?"0"+d:d;
    return y + "-" + m + "-" + d;
}

//不同担心不同页面函数重名

//添加到期时间变为还本付息日函数
function GetDateStr(date, AddDayCount) {
    var dd = new Date(date);
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    m=m<10?"0"+m:m;
    d=d<10?"0"+d:d;
    return y + "-" + m + "-" + d;
}
		
//预计提现时间
	withdrawTimes:function(){
		var addDay = 1;
		var time = new Date();
		if (time.getDay() >= 5) {
		    addDay = 8 - time.getDay()
		}
		time.setDate(time.getDate()+addDay)
		var month = time.getMonth()+1
		if(month<10){
			month = "0"+month
		}
		$("#withdrawTimes").html(month+"-"+time.getDate())
		
	},