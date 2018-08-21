// HTTP工具类
import wepy from './wepy';
import Tips from './Tips';
import router from '../router'
import Vue from 'vue';
// import WxParse from '../plugins/wxParse/wxParse'
import writeLog from './writeLog';
// 域名放在了 app.wpy 底部
const contractId = wepy.$instance.globalData["contractId"];
let timer, requestTask, goLoginTimer
export default {
	req(options = {}) {
    if(options.data && options.data.contractId)
      options.contractId = options.data.contractId
    return {
      "reqTime": (new Date()).getTime(), //请求时间
      "contractId": options.data && options.data.contractId || contractId, //渠道号
      "version": "1.0.0", //请求客户端版本号
      "platform": "H5", //请求客户端类型
      "reqCount": 0, //客户端接口访问次数(与设备绑定)
      "data": {},
      //设备信息
      "deviceInfo": navigator.userAgent,
      ...options
    }
  },
  async post(params) {
    return new Promise((resolve, reject) => {
      let data = this.req({
        data: params.data || {},
        extendInfo: params.extendInfo || []
      })
      //从ls读取缓存内容
      if(params.localCache && wepy.getStorageSync(params.url+JSON.stringify(data.data))) {
        resolve(JSON.parse(wepy.getStorageSync(params.url+JSON.stringify(data.data))));
        return
      }
      Vue.http.post(params.url, data)
        .then((d) => {
          if(d.status == 200) {
            if(!d.data.code) {
              Tips.error('未知错误');
              reject(d)
            }
            if(d.data.code == 10001) {
              if(wepy.$instance.globalData['userinfo']) {
                wepy.setStorage({
                  key: 'userinfo',
                  data: false
                });
                wepy.$instance.globalData['userinfo'] = false;
              }
//            const currentPages = getCurrentPages()
              if((wepy.$instance.globalData.currentPage && wepy.$instance.globalData.currentPage != 'logining') || !wepy.$instance.globalData.currentPage) {
//              if(currentPages.length > 1 && currentPages[currentPages.length - 2].route != 'pages/user/login') {
//                wx.redirectTo({
//                  url: '/login'
//                })
//              } else if(!params.dotGoLogin) {
//                wx.navigateTo({
//                  url: '/login'
//                })
//              }
                router.push({path:"/login"})
                setTimeout(() => {
                  wepy.$instance.globalData.currentPage = null
                }, 1000);
              }
              wepy.$instance.globalData.currentPage = 'logining'
              resolve(d)
            }
            /*更新userinfo*/
            if(d.data.extendInfo && d.data.extendInfo.UserBasicInfo) {
              if(d.data.extendInfo.UserBasicInfo.login == 0) {
                wepy.setStorage({
                  key: 'userinfo',
                  data: false
                });
                wepy.$instance.globalData['userinfo'] = false;
              } else {
                wepy.setStorage({
                  key: 'userinfo',
                  data: d.data.extendInfo.UserBasicInfo.phone
                });
                wepy.$instance.globalData['userinfo'] = d.data.extendInfo.UserBasicInfo.phone;
              }
            }
            if(d.data.code != 10000 && !params.dotShowMsg) {
              if(d.data.code != 10001) Tips.toast(d.data.message);
            }
            // 添加接口繁忙报警
            if(d.data.code == 99999 && data.url != location.origin + '/actives1/Loger/sendWarningLog') {
              writeLog.write({
                url: "/actives1/Loger/sendWarningLog",
                data: {
                  "type": "H5",
                  "content": {
                    "errorApi": data.url,
                    "errorMsg": d
                  }
                }
              })
            }
            wepy.stopPullDownRefresh();
            console.log("params.localCache"+params.localCache,params.url+JSON.stringify(data.data));
            if(params.localCache) {
              d.data._timestamp=(new Date()).getTime()
              wepy.setStorage({
                key: params.url+JSON.stringify(data.data),
                data: JSON.stringify(d.data)
              });
            }
            resolve(d.data);
          } else {
            wepy.stopPullDownRefresh();
            Tips.loaded()
            Tips.offline('请稍后再试');
            if(params.localCache && wepy.getStorageSync(params.url+JSON.stringify(data.data))) {
              resolve(JSON.parse(wepy.getStorageSync(params.url+JSON.stringify(data.data))));
            } else {
              reject(d)
            }
          }
        }, (d) => {
          wepy.stopPullDownRefresh();
          Tips.loaded()
          Tips.offline('网络开小差了');
          if(params.localCache && wepy.getStorageSync(params.url+JSON.stringify(data.data))) {
            resolve(JSON.parse(wepy.getStorageSync(params.url+JSON.stringify(data.data))));
          } else {
            reject(d)
          }
        });
    });
  },

  async postTimeout(params) {
    return new Promise((resolve, reject) => {
      if(timer)
        clearTimeout(timer);
      // if(requestTask)
      //   requestTask.abort()
      timer = setTimeout(() => {
        if(!params.data.orderAmount) {
          resolve()
          return
        }
        requestTask = Vue.http.post(params.url, this.req({
          data: params.data || {},
          extendInfo: params.extendInfo || []
        })).then((d) => {
          if(d.data.code != 10000) {
            Tips.error(d.data.message);
          }
          resolve(d.data);
        }, (err) => {
          reject(err)
        })
      }, params.timeout);
    });
  },
  getBody(content) {
    var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
    var result = REG_BODY.exec(content);
    if(result && result.length === 2)
      return result[1];
    return content;
  },
  async get(params) {
    let res = await Vue.http.get(params.url, {params:params.data})
    return res
  }
}
