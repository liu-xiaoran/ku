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