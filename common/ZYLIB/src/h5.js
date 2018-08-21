import toast from './lib/toast'
import req from './lib/req'
import {platform} from './lib/ua'
import Cookie from './lib/cookie';
import Ajax from './lib/ajax';
import Uri from './lib/uri';
const URI = new Uri(document.location.href)
import {ZYDownload,ZYModal} from './download'
var ZYWechat = require('./lib/wechat');
class ZYReg {
  // 构造函数 初始化参数
  constructor (options = {}) {
    this.options = {
      sendsmsApi:"/platform1/Userpub/sendsms",
      regApi:"/platform1/Userpub/login",
      fakeloginApi:"/platform1/Userpub/fakelogin",
      mobile:document.getElementById("ZYReg-mobile"),
      // vcode:document.getElementById("ZYReg-vcode"),
      // pwd:document.getElementById("ZYReg-pwd"),
      // inviteCode:document.getElementById("ZYReg-invitecode"),
      // getVCodeBtn:document.getElementById("ZYReg-getvcode"),
      regBtn:document.getElementById("ZYReg-regbtn"),
      second:120,
      // check:document.getElementById("ZYReg-check"),
      success (el) { // 

      },
      error (el) { //

      },
      toast(msg){
        toast(msg)
      },
      ...options
    }
    // 深拷贝 如果都有 则右面的值 option.position会覆盖this.options.position
    // options.position = Object.assign({}, this.options.position, options.position)
    // Object.assign(this.options, options)
    this.init();
    this.bindEvent();
    this.contractId=this.options.contractId||URI.getParam("contractId")||Cookie.getCookie("contractId")||"999920170426200013"
  }
  init () {
    // this.time = sessionStorage.getItem('time') ? sessionStorage.getItem('time') : 0;
    // if (this.time > 0) {
    //   this.timer();
    // }
  }
  bindEvent(){
    this.options.getVCodeBtn&&this.addEvent(this.options.getVCodeBtn,(platform=="H5"?"touchend":"click"),()=>this.onGetVCode())
    this.addEvent(this.options.regBtn,(platform=="H5"?"touchend":"click"),()=>this.onRegBtn())
  }
  onToast(msg){
    this.options.toast&&this.options.toast(msg);
  }
  onReg(){
    try{
      if(!this.options.mobile.value){
        this.onToast('手机号不能为空!');
        return
      }
      if(this.options.mobile.value.length!=11){
        this.onToast('手机号只能11位!');
        return
      }
      if(!this.options.vcode||!this.options.vcode.value){
        this.onToast('验证码不能为空!');
        return
      }
      if(this.options.pwd&&!this.options.pwd.value){
        this.onToast('密码不能为空!');
        return
      }
      if(this.options.check&&!this.options.check.checked){
        this.onToast('请勾选协议!');
        return
      }
    }catch(error){
      this.onToast('缺少必要配置');
    }
    
    this.stop();//停止倒计时
    
    let data=req({
      data:{
        phone:this.options.mobile.value,
        veriCode:this.options.vcode.value,
        // userPwd:this.options.pwd?this.options.pwd.value:"",
        platform:this.options.platform||platform,
        inviteCode:this.options.inviteCode?this.options.inviteCode.value:"",
        contractId:this.contractId,
        otherArgs:encodeURIComponent(location.search.substring(1))
      }
    });
    // if(this.options.platform){
    //   data.data.platform=this.options.platform
    // }
    if(this.options.pwd&&this.options.pwd.value){
      data.data.userPwd=this.options.pwd.value
    }
    if(this.options.wechatOpenid){
      data.data.wechatOpenid=this.options.wechatOpenid
    }
    this.ajax({
      url:this.options.regApi,
      data,
      success:(res)=>{
        if(res.code=='10000'){
          this.options.success&&this.options.success(res);
        }else{
          this.onToast(res.message||'注册失败!');
          this.options.error&&this.options.error();
        }
      }
    });
  }
  onFake(){
    try{
      if(!this.options.mobile.value){
        this.onToast('手机号不能为空!');
        return
      }
      if(this.options.mobile.value.length!=11){
        this.onToast('手机号只能11位!');
        return
      }
      if(this.options.pwd&&!this.options.pwd.value){
        this.onToast('密码不能为空!');
        return
      }
    }catch(error){
      this.onToast('缺少必要配置');
    }
    
    let data=req({
      data:{
        phone:this.options.mobile.value,
        platform:this.options.platform||platform,
        contractId:this.contractId,
        otherArgs:encodeURIComponent(location.search.substring(1))
      }
    });
    
    if(this.options.wechatOpenid){
      data.data.wechatOpenid=this.options.wechatOpenid
    }
    
    this.ajax({
      url:this.options.fakeloginApi,
      data,
      success:(res)=>{
        if(res.code=='10000'){
          this.options.success&&this.options.success(res);
        }else{
          this.onToast(res.message||'注册失败!');
          this.options.error&&this.options.error();
        }
      }
    });
  }
  onLogin(){
    try{
      if(!this.options.mobile.value){
        this.onToast('手机号不能为空!');
        return
      }
      if(this.options.mobile.value.length!=11){
        this.onToast('手机号只能11位!');
        return
      }
      if(this.options.check&&!this.options.check.checked){
        this.onToast('请勾选协议!');
        return
      }
    }catch(error){
      this.onToast('缺少必要配置');
    }
    let data=req({
      data:{
        phone:this.options.mobile.value,
        userPwd:this.options.pwd?this.options.pwd.value:"",
        platform:this.options.platform||platform,
        contractId:this.contractId,
        otherArgs:encodeURIComponent(location.search.substring(1))
      }
    });
    
    if(this.options.wechatOpenid){
      data.data.wechatOpenid=this.options.wechatOpenid
    }
    this.ajax({
      url:this.options.regApi,
      data,
      success:(res)=>{
        if(res.code=='10000'){
          this.options.success&&this.options.success(res);
        }else{
          this.onToast(res.message||'登录失败!');
          this.options.error&&this.options.error();
        }
      }
    });
  }
  onRegBtn(){
    if(!this.options.vcode&&!this.options.pwd){//假注册
      this.onFake();
    }else if(!this.options.vcode&&this.options.pwd){//登录
      this.onLogin();
    }else{
      this.onReg();
    }
  }
  onGetVCode(){

    if (this.time > 0) {
      return
    }

    if(!this.options.mobile.value){
      this.onToast('手机号不能为空!');
      return
    }
    if(this.options.mobile.value.length!=11){
      this.onToast('手机号只能11位!');
      return
    }
    
    let data=req({
      data:{
        phone:this.options.mobile.value,
        smsType:this.options.smsType||(this.options.pwd?"regist":"appLogin")
      }
    });
    
    this.ajax({
      url:this.options.sendsmsApi,
      data,
      success:(res)=>{
        if(res.code=='10000'){
          this.run();
        }else if(res.code=='99995'){
          this.onToast(res.message);
          this.run(res.data.ttl);
        }else{
          this.onToast(res.message||'发送失败!');
        }
      }
    });
  }
  run(ttl='') {
    this.time = ttl||this.options.second;
    // sessionStorage.setItem('time', this.time);
    this.timer()
  }
  timer() {
    let text=this.time > 0 ? this.time+'s后重发' : '获取验证码';
    this.options.getVCodeBtn.value=text;
    this.options.getVCodeBtn.innerHTML=text;
    if (this.time > 0) {
      this.options.getVCodeBtn.setAttribute("disabled","disabled");
      this.time--;
      // sessionStorage.setItem('time', this.time);
      setTimeout(()=>this.timer(), 1000);
    }else{
      this.options.getVCodeBtn.removeAttribute("disabled");
    }
  }
  stop(){
    this.time = 0;
    // sessionStorage.setItem('time', this.time);
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
  ajax(options={}){
    let ajax = new Ajax();
    return ajax.request({
      url: options.url,
      type: 'post',
      dataType: 'json',
      ContentType:"application/json",
      params: options.data,
      success: (response)=>{
        if (typeof options.success === 'function') {
          options.success(response);
        }
      },
      error: (msg) => {
        toast(msg)
      }
    });
    // let fetchResponse = fetch(options.url, {
    //     method: 'post',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(options.data)
    // });
    // fetchResponse.then((res) => res.json()).then((res)=>{options.success(res)})
  }
  param(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace('%20', '+')
  }
  
}
export {ZYReg,toast,req,ZYWechat,ZYDownload}
