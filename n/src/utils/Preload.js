import Vue from 'vue'
let preloadData = {};
export default {
  install(Vue) {
    Vue.prototype.$preloadData={}
    Vue.prototype.$preload = function(key, value) {
      // Vue.prototype.$preloadData[key]=
      preloadData[key] = value
      sessionStorage.setItem('$preloadData'+key,JSON.stringify({key:value}))
    };
    Vue.prototype.$getPreloadData = function(key,dotGoIndex=false) {
      setTimeout(()=>{
        preloadData[key]=null
      },100)

      if(preloadData[key])
        return preloadData[key]
      try{
        let ss=sessionStorage.getItem('$preloadData'+key)
        return JSON.parse(ss).key
      }catch(e){//出错 可能是隐私模式或则没有存入
        if(!dotGoIndex)
        location.href=location.origin+location.pathname;
        return false;
      }
      
      
    };
    Vue.prototype.$delPreloadData = function(key) {
      preloadData[key]=null
      sessionStorage.removeItem('$preloadData'+key)
    };
  }
}
