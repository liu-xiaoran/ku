'use strict'

var net = require('./net');

var extend = function(des,src) {
	for(var i in src) {
		des[i] = src[i];
	}
	return des;
}

var Wechat = function(config) {
	this.config = {
		apiURL:'https://www.zhangyuelicai.com/actives1/public/jsapiTicket',
		wxURL:'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
		url:encodeURIComponent(location.href.split('#')[0]),
		debug:false,
		type:'post',
		jsonp:false,
		data:{
			link:location.href,
			title:'',
			desc:'',
			imgUrl:'https://www.zhangyuelicai.com/share/invite/images/shareicon.png',
			success:null,
			cancel:null
		},
		timelineData:{
			link:location.href,
			title:'',
			imgUrl:'https://www.zhangyuelicai.com/share/invite/images/shareicon.png',
			success:null,
			cancel:null
		}
	}
	extend(this.config,config);
	this.init();
}

var proto = Wechat.prototype;

proto.init = function() {
	var conf = this.config;
	this.timelineData = extend({},conf.data);
	this.appMessageData = extend({},conf.data); 
	if(conf.timelineData) {
		extend(this.timelineData,conf.timelineData);
	} else {
		this.timelineData.title = conf.data.desc;
	}
	var self = this;
	net.loadScript({
		url:conf.wxURL,
		success:function() {
			self.initShare();
		}
	});
}

proto.initShare = function() {
	var conf=this.config,self=this; 
	net.ajax({
		url:conf.apiURL,
		type:conf.type,
		data:{
			url:conf.url
		},
		jsonp:conf.jsonp,
		success:function(data) {
			self.initData(data);
		}
	});
}

proto.initData = function(data) {
	var conf=this.config,self=this;
	if(wx) {
		wx.config({
			debug:conf.debug, 
			appId:data.appId, 
			timestamp:data.timestamp, 
			nonceStr:data.nonceStr, 
			signature:data.signature,
			jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] 
		});
		wx.ready(function(){
			wx.onMenuShareTimeline(self.timelineData);
			wx.onMenuShareAppMessage(self.appMessageData);
		});
	}
}

proto.shareToTimeline = function(data) {
	var obj = extend(this.timelineData,data);
	wx.onMenuShareTimeline(obj);
}

proto.shareToFriend = function(data) {
	var obj = extend(this.appMessageData,data);
	wx.onMenuShareAppMessage(obj);
}

module.exports = Wechat;
