import ZYModal from './lib/modal'
import device from './lib/device';
import Cookie from './lib/cookie';
import Uri from './lib/uri';
const URI = new Uri(document.location.href)
class ZYDownload {
  // 构造函数 初始化参数
  constructor(options = {}) {
    this.options = {
      downloadBtn: document.getElementById("ZYDownload"),
      tips: "http://106.14.236.8/h5/libs/imgs/download.png",
      wake: -1,// -1:不唤醒 0:唤醒无应用宝 1:唤醒有应用宝
      ...options
    }

    this.bindEvent();
    this.modal = new ZYModal({ tips: this.options.tips });
    this.iosLink=this.options.iosLink || URI.getParam("iosLink") || Cookie.getCookie("iosLink") || "https://itunes.apple.com/app/id1203692435"
    this.apkLink=this.options.apkLink || URI.getParam("apkLink") || Cookie.getCookie("apkLink") || ('/app/' + this.toApkLink() + '.apk')
    this.init();
    
  }
  init() {
    if ((this.options.wake<0)&&this.options.auto) {
      if (device.isIos()) {
        setTimeout(() => {
          this.onDownload();
        }, 1000);
      } else {
        this.onDownload();
      }
    }
  }
  
  bindEvent() {
    this.addEvent(this.options.downloadBtn, ((device.isIos()||device.isAndroid())? "touchend" : "click"), () => this.options.wake>=0 ? this.onWake() : this.onDownload())
  }
  onDownload() {
    if (device.isWeixin())
      this.modal.show();
    else if (device.isIos())
      location.href = this.iosLink
    else
      location.href = this.apkLink
  }
  onWake() {
    try {
      if (device.isIos9()) {
        window.location.href = '/h5/dl/?iosLink='+this.iosLink+'&apkLink='+this.apkLink//need params
      } else if (device.isWeixin()) {
        window.location.href = this.options.wake>0?'http://a.app.qq.com/o/simple.jsp?pkgname=com.wanse.zhangyueapp':'/h5/dl/?iosLink='+this.iosLink+'&apkLink='+this.apkLink
      } else if (device.isIos()||device.isAndroid()) {//ios or android
        window.location.href = "zylcapp://com.wanse.zhangyueapp"
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      this.onDownload();
    }
  }
  toApkLink() {
    let chinnelId = this.options.contractId || URI.getParam("contractId")||Cookie.getCookie("contractId") || "999920171021200000";
    return chinnelId.substr(0, 12) + "4" + chinnelId.substring(13)
  }
  addEvent(el, type, handler) {
    if (el.addEventListener) {
      el.addEventListener(type, handler, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, handler);
    } else {
      el['on' + type] = handler;
    }
  }
  
}
export { ZYDownload, ZYModal }
