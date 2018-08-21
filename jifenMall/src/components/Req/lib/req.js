import {platform,browser} from './ua'
let getCookie=function(name) {
  var str = "; " + document.cookie + "; ",
      index = str.indexOf("; " + name + "=");
  if (index != -1) {
      var tempStr = str.substring(index + name.length + 3, str.length),
          target = tempStr.substring(0, tempStr.indexOf("; "));

      return decodeURIComponent(target);
  }
  return null;
}
let parseUrlParam =function(url=location.href) {
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
export default function (options = {}) {
  // options.data={platform:platform,...options.data}
  return {
    "reqTime": (new Date()).getTime(), //请求时间
    "channelId": options.data&&(options.data.contractId||options.data.channelId)||parseUrlParam().channelId||getCookie("channelId")||'',         //渠道号
    "version": "1.0.0",            //请求客户端版本号
    "platform": platform,              //请求客户端类型
    "reqCount": 0,                //客户端接口访问次数(与设备绑定)
    "data": {
      
    },
    //设备信息
    "deviceInfo": browser,
    ...options
  }
  // return Object.assign(_options, options)
}
