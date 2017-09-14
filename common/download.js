import ZYModal from './lib/modal'

class ZYDownload {
  // 构造函数 初始化参数
  constructor (options = {}) {
    this.options = {
      downloadBtn:document.getElementById("ZYDownload"),
      tips:"http://106.14.236.8/h5/libs/imgs/download.png",
      auto:false
    }
    Object.assign(this.options, options)
    
    this.bindEvent();
    this.modal=new ZYModal({tips:this.options.tips});
    this.init();
  }
  init () {
    if(this.options.auto){
      if(this.ua().ios){
        setTimeout(()=>{
          this.onDownload();
        },1000);
      }else{
        this.onDownload();
      }
    }
  }
  ua(){
    var e = navigator.userAgent.toLowerCase();
    return {
      ios: /iphone/.test(e) || /ipad/.test(e),
      android: /android/.test(e),
      winphone: /windows phone/.test(e),
      weixin: /micromessenger/.test(e),
      qqnews: /qqnews/.test(e),
      mqqbrowser: /mqqbrowser/.test(e),
      qq: /\sqq/.test(e),
      mobile:/iphone/.test(e) || /ipad/.test(e) || /android/.test(e)
    }
  }
  bindEvent(){
    this.addEvent(this.options.downloadBtn,(this.ua().mobile?"touchend":"click"),()=>this.onDownload())
  }
  onDownload(){
    if(this.ua().weixin)
      this.modal.show();
    else if(this.ua().ios)
      location.href=this.options.iosLink||this.parseUrlParam().iosLink||this.getCookie("iosLink")||"https://itunes.apple.com/app/id1203692435"
    else 
      location.href=this.options.apkLink||this.parseUrlParam().apkLink||('/app/'+this.toApkLink()+'.apk')
  }
  toApkLink(){
    let chinnelId=this.options.contractId||this.parseUrlParam().contractId||this.getCookie("contractId")||"999920170426200013";
    return chinnelId.substr(0,12)+"4"+chinnelId.substring(13)
  }
  addEvent(el, type, handler){
    if(el.addEventListener){
      el.addEventListener(type,handler,false);
    }else if(el.attachEvent){
      el.attachEvent('on'+type,handler);
    }else{
      el['on'+type]=handler;
    }
  }
  getCookie(name) {
    var str = "; " + document.cookie + "; ",
        index = str.indexOf("; " + name + "=");
    if (index != -1) {
        var tempStr = str.substring(index + name.length + 3, str.length),
            target = tempStr.substring(0, tempStr.indexOf("; "));
        return decodeURIComponent(target);
    }
    return null;
  }
  parseUrlParam (url=location.href) {
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
}
export {ZYDownload,ZYModal}
