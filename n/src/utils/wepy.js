import Http from './Http'
import Api from './Api'
import Tips from './Tips';
export default {
  $instance:{
    globalData:{
      // host:"http://106.14.236.8",
      // host:"http://106.14.236.168",
       // "host" : 'http://test.zhangyuelicai.com',
      host: location.origin,
      // "contractId" : "100720170310300000"
      contractId:"999920171122234668"
    }
  },
  getStorageSync(arg){
    const ls=localStorage.getItem(arg)
    try{
      let lsObj=JSON.parse(ls)
      if(lsObj._timestamp&&((new Date()).getTime()-lsObj._timestamp>=5000)){
        localStorage.removeItem(arg)
        return null
      }
    }catch(e){
    	return ls
    }
    return ls
  },
  setStorage(arg){
  	localStorage.setItem(arg.key,arg.data)
  },
  setStorageSync(arg){
    localStorage.setItem(arg.key,arg.data)
  },
  getsessionStorageSync(arg){
    return sessionStorage.getItem(arg)
  },
  setsessionStorageSync(arg){
    sessionStorage.setItem(arg.key,arg.data)
  },
  removeStorage(arg){
    localStorage.removeItem(arg.key);
  },
  stopPullDownRefresh(){
    Tips.loaded()
  }
}
