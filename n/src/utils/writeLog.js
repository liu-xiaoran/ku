import wepy from './wepy';
import Vue from 'vue'
wepy.getStorageSync("deviceId") || wepy.setStorageSync({
  key:"deviceId",
  data:new Date().getTime()
});

const host = wepy.$instance.globalData["host"] ;
const contractId = wepy.$instance.globalData["contractId"] ;
const deviceId = wepy.getStorageSync("deviceId") ;
const userinfo = wepy.getStorageSync('userinfo')=="false"? "" : wepy.getStorageSync('userinfo') ;
let opcounts=wepy.getsessionStorageSync('opcount')

export default {
    req(options = {}) {
        return {
            "deviceId": deviceId,
            'userId' : userinfo,
            "isLogined" : userinfo ? 1 : 0,
            "opcount" : opcounts, //接口上报次数
            "clientType": 5,
            "clientVer": "1.0.0",
            "contractId": contractId,
            "dt": Date.parse(new Date())/1000,  //请求时间
            "deviceInfo": navigator.userAgent, //设备信息
            ...options
        }
      },
    write(params){

      if(isNaN(opcounts)&&opcounts!=0){
          wepy.setsessionStorageSync({
            key:'opcount',
            data:0
          })
      }else{
          opcounts++
          wepy.setsessionStorageSync({
            key:'opcount',
            data:opcounts
          })
      }
      Vue.http.post((params.url || "/actives1/loger/write"),this.req(params))
    }
}
