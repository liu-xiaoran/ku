(function() {
    /**
     * 动态加载js文件
     * @param  {string}   url      js文件的url地址
     * @param  {Function} callback 加载完成后的回调函数
     */
    var _getScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');

        js.setAttribute('type', 'text/javascript'); 
        js.setAttribute('src', url); 

        head.appendChild(js);

        //执行回调
        var callbackFn = function(){
                if(typeof callback === 'function'){
                    callback();
                }
            };

        if (document.all) { //IE
            js.onreadystatechange = function() {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
                    callbackFn();
                }
            }
        } else {
            js.onload = function() {
                callbackFn();
            }
        }
    }

    //如果使用的是zepto，就添加扩展函数
    if(Zepto){
        $.getScript = _getScript;
    }
    
})();
function detectWeixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") return true;
	else return false;
} //end func
//判断是否处于微信内置浏览器
var isWeixin = detectWeixin();
//-------------------------------------------------------定义当前站点URL，分享功能会调用到
var siteUrl = 'https://www.zhangyuelicai.com';

//-------------------------------------------------------微信公众号授权
var wxContent = {
	link: window.location.href,
	image: siteUrl + "/share/invite/images/shareicon.png",
	title: '100%国资背景，688元现金红包等你来领',
	friend: '完成新手任务，红包任你拿',
	timeline: '100%国资背景，688元现金红包等你来领'
};
var wxSigned = false;
if (isWeixin) {
	// document.write('<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>');
	$.getScript('https://res.wx.qq.com/open/js/jweixin-1.2.0.js',function(){
		weixin_sign(); //微信公众号认证
	})
	
} //end if

/*
改变分享内容的方法：
1、先修改微信分享内容变量wxContent的内容
		wxContent.link='新的分享url';
		wxContent.image='新的分享图标';
		wxContent.title='新的分享标题文字';
		wxContent.timeline='新的分享到朋友圈的内容文字';
		wxContent.friend='新的分享给朋友的内容文字';
2、再执行一次分享函数：
wx_share();
*/
//--------------------------------微信分享设置
function weixin_sign() {
	var localUrl = encodeURIComponent(String(window.location.href).split("#")[0]);

	$.getJSON(siteUrl+"/jzucapp/weChart/jsApiTicket?url=" + localUrl, function(data) {
		if (data) {
			wx.config({
				debug: false,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'hideMenuItems',
					'showMenuItems',
					'hideAllNonBaseMenuItem',
					'showAllNonBaseMenuItem',
					'translateVoice',
					'startRecord',
					'stopRecord',
					'onRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'uploadVoice',
					'downloadVoice',
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'getNetworkType',
					'openLocation',
					'getLocation',
					'hideOptionMenu',
					'showOptionMenu',
					'closeWindow',
					'scanQRCode',
					'chooseWXPay',
					'openProductSpecificView',
					'addCard',
					'chooseCard',
					'openCard'
				]
			}); //end wx.config
			wxSigned = true; //通过微信新SDK验证
			wx.ready(function() {
				wx.showOptionMenu(); //用微信“扫一扫”打开，optionMenu是off状态，默认开启
				wx_share();
			}); //end wx.ready
		} //end if(data)
	}); //end ajax
} //end func




function wx_share(content) {
	if (wxSigned) {
		//window.preload();
		if (content) {
			wxContent.link = content.link != null ? content.link : wxContent.link;
			wxContent.image = content.image != null ? content.image : wxContent.image;
			wxContent.title = content.title != null ? content.title : wxContent.title;
			wxContent.friend = content.friend != null ? content.friend : wxContent.friend;
			wxContent.timeline = content.timeline != null ? content.timeline : wxContent.timeline;
		} //end if
		wx.onMenuShareTimeline({
			title: wxContent.timeline, // 分享标题
			link: wxContent.link, // 分享链接
			imgUrl: wxContent.image, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
				//monitorAdd({label:'分享到朋友圈'});
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareAppMessage({
			title: wxContent.title, // 分享标题
			desc: wxContent.friend, // 分享描述
			link: wxContent.link, // 分享链接
			imgUrl: wxContent.image, // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
				//monitorAdd({label:'分享给朋友'});
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
	} //end if
	else setTimeout(wx_share, 250, content);
} //end func



