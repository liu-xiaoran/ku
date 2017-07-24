<template>
	<div></div>
</template>

<script>
	
export default {
	name: 'wechat',
	data (){
		return{
			wxSigned: false,
			wxContent: {
				link: String(window.location.href).split("#")[0],
				image:  "https://www.zhangyuelicai.com/share/invite/images/shareicon.png",
				title: '及时行夏礼品领取',
				friend: '及时行夏，趁现在，动起来',
				timeline: '及时行夏礼品领取'
			}
		}
	},
	methods:{
		detectWeixin() {
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") return true;
			else return false;
		},
		weixin_sign() {
			var localUrl = encodeURIComponent(String(window.location.href).split("#")[0]);
			this.$http.post("https://www.zhangyuelicai.com/jzucapp/weChart/jsApiTicket?url=" + localUrl).then((data) => {
				if (data) {
					wx.config({
						debug: location.href.indexOf("amontest")>=0,
						appId: data.body.appId,
						timestamp: data.body.timestamp,
						nonceStr: data.body.nonceStr,
						signature: data.body.signature,
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
					this.wxSigned = true; //通过微信新SDK验证
					wx.ready(()=> {
						wx.showOptionMenu(); //用微信“扫一扫”打开，optionMenu是off状态，默认开启
						this.wx_share();
					}); //end wx.ready
				} //end if(data)
			}, (response) => {
			});
			
		},
		wx_share(content) {
			if (this.wxSigned) {
				//window.preload();
				if (content) {
					this.wxContent.link = content.link != null ? content.link : this.wxContent.link;
					this.wxContent.image = content.image != null ? content.image : this.wxContent.image;
					this.wxContent.title = content.title != null ? content.title : this.wxContent.title;
					this.wxContent.friend = content.friend != null ? content.friend : this.wxContent.friend;
					this.wxContent.timeline = content.timeline != null ? content.timeline : this.wxContent.timeline;
				} //end if
				wx.onMenuShareTimeline({
					title: this.wxContent.timeline, // 分享标题
					link: this.wxContent.link, // 分享链接
					imgUrl: this.wxContent.image, // 分享图标
					success: function() {
						// 用户确认分享后执行的回调函数
						//monitorAdd({label:'分享到朋友圈'});
					},
					cancel: function() {
						// 用户取消分享后执行的回调函数
					}
				});
				wx.onMenuShareAppMessage({
					title: this.wxContent.title, // 分享标题
					desc: this.wxContent.friend, // 分享描述
					link: this.wxContent.link, // 分享链接
					imgUrl: this.wxContent.image, // 分享图标
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
			else setTimeout(()=>{
				this.wx_share();
			}, 250, content);
		} //end func
	},
	created(){
		if(this.detectWeixin()){
			this.weixin_sign()
		}

	}
	
}
</script>

<style scoped>
	
</style>