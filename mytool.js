//滚回顶部
$(".sidebarTops").off().on("click",function(){
    $('html, body').stop().animate({'scrollTop':'0px'},300);
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
	document.cookie =  c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
}

window.cid = getQueryString("cid")?getQueryString("cid"):"999920170508100021";
getQueryString("cid")&&setCookie("channelid",window.cid,3);

//新更改的    落地页转走时要带上信息，不然不能验证
原网址+window.cid
var getCookie = function(name) {
			    var str = "; " + document.cookie + "; ",
			        index = str.indexOf("; " + name + "=");
			    if (index != -1) {
			        var tempStr = str.substring(index + name.length + 3, str.length),
			            target = tempStr.substring(0, tempStr.indexOf("; "));

			        return decodeURIComponent(target);
			    }
			    return null;
		}

//解决获取焦点出现键盘时悬浮框上升的bug
		$("input[type='text'],input[type='password'],input[type='number']").focus(function() {
		    $(".footer").css("position","absolute")
		}).blur(function() {
			$(".footer").css("position","fixed")
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
vm.turnDate = function(tm){ 
   	var tt=new Date(tm).toLocaleString(); 
    return tt; 
}