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
		apiURL:'/jsapiTicket',
		wxURL:'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
		url:encodeURIComponent(location.href.split('#')[0]),
		debug:false,
		type:'post',
		jsonp:false,
		...config
	}
	this.config.data={
		link:location.href,
		title:'',
		desc:'',
		imgUrl:location.origin+'/h5/share/shareicon.png',
		success:null,
		cancel:null,
		...config.data
	}
	this.config.timelineData={
		link:location.href,
		title:'',
		imgUrl:location.origin+'/h5/share/shareicon.png',
		success:null,
		cancel:null,
		...config.timelineData
	}
	// extend(this.config,config);
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
			appId:data.data.appId, 
			timestamp:data.data.timestamp, 
			nonceStr:data.data.nonceStr, 
			signature:data.data.signature,
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
