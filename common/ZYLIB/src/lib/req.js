import Cookie from './cookie';
import {platform,browser} from './ua'
import Uri from './uri';
const URI = new Uri(document.location.href)
export default function (options = {}) {
  if(options.data&&options.data.contractId)
  options.contractId=options.data.contractId
  return {
    "reqTime": (new Date()).getTime(), //请求时间
    "contractId": options.data&&options.data.contractId||URI.getParam("contractId")||Cookie.getCookie("contractId")||'',         //渠道号
    "version": "1.0.0",            //请求客户端版本号
    "platform": platform,              //请求客户端类型
    "reqCount": 0,                //客户端接口访问次数(与设备绑定)
    "data": {
      
    },
    //设备信息
    "deviceInfo":{browser,...{userAgent:navigator.userAgent}},
    ...options
  }
}
