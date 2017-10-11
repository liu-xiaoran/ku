// HTTP工具类

import wepy from 'wepy';
import Tips from './Tips';

import writeLog from './writeLog';
// 域名放在了 app.wpy 底部
const host = wepy.$instance.globalData["host"] ;
const contractId = wepy.$instance.globalData["contractId"] ;

export default {
  host: host,
  req(options = {}) {
    if (options.data && options.data.contractId)
      options.contractId = options.data.contractId
    return {
      "reqTime": (new Date()).getTime(), //请求时间
      "contractId": options.data && options.data.contractId || contractId, //渠道号
      "version": "1.0.0", //请求客户端版本号
      "platform": "wx", //请求客户端类型
      "reqCount": 0, //客户端接口访问次数(与设备绑定)
      "data": {},
      //设备信息
      "deviceInfo": wepy.getSystemInfoSync(),
      ...options
    }
  },
  async post(params) {
    return new Promise((resolve, reject) => {
      let data={ 
        url: host + params.url, 
        data: this.req({ data: params.data || {}, 
        extendInfo: params.extendInfo || [] }), 
        method: "POST",
        header: { 'content-type': 'application/json' }
      }
      if(wepy.$instance.globalData['session_id']){
        data.header={ 'content-type': 'application/json', 'Cookie': wepy.$instance.globalData['session_id'] }
      }
      wepy.request(data)
        .then((d) => {
          if (d.header["Set-Cookie"]) {  
            wepy.setStorage({key: 'session_id', data: d.header["Set-Cookie"]});
            wepy.$instance.globalData['session_id'] = d.header["Set-Cookie"];
          }  
          if (d.statusCode == 200) {
            if(d.data.code==10001){
              
              if(wepy.$instance.globalData['userinfo']){
                wepy.setStorage({key: 'userinfo', data: false});
                wepy.$instance.globalData['userinfo'] = false;
              }
              if(params.login){
                wx.navigateTo({
                  url: '../../pages/user/login'
                })
                reject(d)
              }
            }
            // else if(!wepy.$instance.globalData['userinfo']&&d.data.extendInfo&&d.data.extendInfo.UserBasicInfo){
            //   wepy.setStorage({key: 'userinfo', data: true});
            //   wepy.$instance.globalData['userinfo'] = true;
            // }
            if(d.data.code!=10000){
              resolve(d.data);
              if(d.data.code!=10001)Tips.error(d.data.message);
            }else{
              resolve(d.data);
            }
            // 添加接口繁忙报警
            if(d.data.code==99999&&data.url!=host+'/actives1/Loger/sendWarningLog'){
              writeLog.write({
                url:"/actives1/Loger/sendWarningLog",
                data:{
                  "type":"WX",
                  "content":{
                    "errorApi":data.url,
                    "errorMsg":d.data.code
                  }
                }
              })
            }
          } else {
            Tips.error('地址问题');
            // Event.emit(Event.GLOBAL_TOAST,{msg:'地址问题'});
            reject(d)
          }
        }, (d) => {
          Tips.offline('网络开小差了');
          // Event.emit(Event.GLOBAL_TOAST,{msg:'服务器问题'});
          reject(d)
        });
    });

  },
  async get(params){
    let res=await wepy.request({
        url: host+params.url,
        header: {
          "Content-Type": "json"
        },
        data: params.data,
        method:"GET"
    })
    return res
  }
}


