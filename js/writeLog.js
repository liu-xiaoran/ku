import wepy from 'wepy';
wepy.getStorageSync("deviceId") || wepy.setStorageSync('deviceId',(new Date()).getTime());

const host = wepy.$instance.globalData["host"] ;
const contractId = wepy.$instance.globalData["contractId"] ;
const deviceId = wepy.getStorageSync("deviceId") ;
const userinfo = wepy.$instance.globalData['userinfo'] || "" ;

if(wepy.$instance.globalData['opcount']&&wepy.$instance.globalData['opcount']!=0){
    wepy.$instance.globalData['opcount']=0
}else{
    wepy.$instance.globalData['opcount']+=1
}

export default {
    req(options = {}) {
        return {
            "deviceId": deviceId,
            'userId' : userinfo, 
            "isLogined" : userinfo ? 1 : 0,
            "opcount" : wepy.$instance.globalData['opcount'], //接口上报次数
            "clientType": 5,
            "clientVer": "1.0.0",
            "contractId": contractId,
            "dt": Date.parse(new Date())/1000,  //请求时间
            "deviceInfo": wx.getSystemInfoSync(), //设备信息
            ...options
        }
      },
    write(params){
        let data={
            url: host + (params.url || "/actives/loger/write"), 
            data: this.req({
                params
            }), 
        }
        wepy.request(data)
    }
}