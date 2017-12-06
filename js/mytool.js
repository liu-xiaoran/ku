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
//其实就是 .toLocaleString() 转换本地时间而已

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
		
	}
	

//滑动时，touchend阻止冒泡
var locked = false;
window.addEventListener('touchmove', function(ev){
    locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
}, true);
function stopTouchendPropagation(e){
	var e = window.event||event;
    if(document.all){  //只有ie识别
        e.cancelBubble=true;
    }else{
        e.stopPropagation();
    }
    window.removeEventListener('touchend', stopTouchendPropagation, true);
    locked = false;
}


 return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');    
 
//一般的数据交互，提交时都转为JSON格式；
  JSON.parse()      字符串转json对象
  JSON.stringify()  json对象转字符串
  


//时间时间戳转换
new Date("2017-08-05 00:00:00").getTime()
new Date("2017-08-05").getTime()
new Date("2017-08-05 00:00:00")
new Date("2017-08-05")
Date.parse( new Date("2017-08-05 00:00:00"))
( new Date("2017-08-05 00:00:00")).valueOf()
new Date(["2017","08","05 00:00:00"]).getTime()
new Date('2015-09-14T09:30:16').getTime()


// 提交格式是Formdata
<script>
    /**
     * FromData:表单数据对象
     * 这是HTML5中新增的一个Api
     * 他能以表单对象作为参数，自动的把表单的数据打包
     * 当ajax发送数据时，发送这个formData
     * 达到发送表单内数据的目的
     */
    function send(){
        var fm = document.getElementById('tform');
        var fd = new FormData(fm);//创建FormData对象
        var xhr = new XMLHttpRequest();//创建xhr对象
        xhr.open('POST','10-formdata.php',true);//配置请求参数
        //设置状态回调函数
        xhr.onreadystatechange = function (){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById('debug').innerHTML = this.responseText;
            }
        }
        //说明formdata对象不仅可以读取表单的数据，也可以自行追加数据
        fd.append('Single',false);
        xhr.send(fd);//发送请求
    }

</script>
<body>
    <form id="tform">
        用户名：<input type="text" name="username"/><br/>
        年龄：<input type="text" name="age"/><br/>
        邮箱：<input type="text" name="email"/><br/>
        性别：<input type="text" name="sex"/><br/>
        <input type="button" value="ajax发送" onclick="send();"/>
    </form>
    <div id="debug"></div>
</body>

// JSON.parse() 方法解析一个JSON字符串，构造由字符串描述的JavaScript值或对象。可以提供可选的reviver函数以在返回之前对所得到的对象执行变换。
JSON.parse(text[, reviver])
//JSON.stringify() 方法将一个  JavaScript 值转换为一个 JSON 字符串，如果指定了一个 replacer 函数，则可以替换值，或者如果指定了一个 replacer 数组，可选地仅包括指定的属性。
JSON.stringify(value[, replacer [, space]])

//判断相等的JS中不能直接使用相等,为真时即为相等
Math.abs(0.2+0.1-0.3)<1e-14



onkeypress="return (/^[a-z0-9]+$/i.test(String.fromCharCode(event.keyCode)))"