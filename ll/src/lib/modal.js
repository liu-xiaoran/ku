export default class ZYModal{
  constructor (options = {}) {
    this.options = {
      ...options
    }
    const style = `
      box-sizing: border-box;
      text-align: center;
      z-index: 99999;
      word-break: break-word;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height:100%;
      opacity: 0;
      transition: all .5s;
      display: none;
      background-image:url(${this.options.tips});
      background-color: rgba(0, 0, 0, 0.7);
      background-size:100%;
      background-repeat:no-repeat;
    `;
    
    this.show = ()=>{
      this.holder = document.createElement('div');
      this.holder.style.cssText = style;
      document.body.appendChild(this.holder);
      this.holder.style.display = 'block';
      setTimeout(() => {
        this.holder.style.opacity = "1";
        this.init();
      }, 10);
    }
    this.hide=()=>{
      this.holder.style.opacity = 0;
      setTimeout(() => {
        this.holder.remove();
      }, 400);
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
  init(){
    this.addEvent(this.holder,(this.ua().mobile?"touchend":"click"),()=>this.hide())
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
  
  

  

  // Show style
  // holder.style.width = options.width + 'px';
  // holder.style.marginLeft = '-' + (options.width / 2) + 'px'
  

}
