<template>
  <div id="app">
    <div class="rule" @click='ruleTou'></div>
    <div v-show="modelMess" class="ruleCon" @click='closeModel'>
      <div class="contrule" @click.stop>
        <div class="contruleTop">奖励规则</div>
        <div class="contruleCon" v-html="rule"></div>
      </div>
      <div class="linerule"></div>
      <div class="closerule"></div>
    </div>
    <modelrule ref="op" class="model" v-on:modelrules="model=false" v-show="model" :myAwardList='myAwardList'></modelrule>
    <div class="prize">
      <div class="prizeBox" v-for="(item,index) in awardList" :key="index">
        <div class="pic">
          <img :src="item.icon">
        </div>
        <div class="prizeName">
          {{item.awardName}}
        </div>
      </div>
    </div>
    <actBox :times='times'></actBox>
    <gun :winerList='winerList'></gun>
    <div class="btn">
      <a class="btnLeft btncon" @click='btnLeft'></a><a @click='btnRight' class="btnRight btncon"></a>
    </div>
    <div class="prompt" v-show="show">
      {{prompt}}
    </div>
    <div class="spin"><Spinner :size="size" bgcolor="#000" forecolor="transparent" v-show="spin" /></div>
  </div>
</template>

<script>
import actBox from './components/pages/ActBox'
import modelrule from './components/pages/model'
import gun from './components/pages/GunDong'
import { Spinner } from './components/Spinner'
export default {
  name: 'app',
  components:{
    modelrule,
    gun,
    actBox,
    Spinner
  },
  watch: {
    model(newValue, oldValue){
      if(this.model){
        document.addEventListener('touchmove',this.Default);
      }else{
        document.removeEventListener('touchmove',this.Default);
      }
    },
    modelMess(newValue, oldValue){
      if(this.modelMess){
        document.addEventListener('touchmove',this.Default);
      }else{
        document.removeEventListener('touchmove',this.Default);
      }
    }
  },
  data(){
    return{
      model:false,
      prize:"",
      spin:true,
      size: lib.flexible.dpr*20,
      prompt:"",
      show:false,
      isLogin:"",
      modelMess:"",
      myAwardList: "",
      awardList:"",
      winerList:"",
      times:0,
      dataPush:"",
      webkey:"",
      rule:""
    }
  },
  methods:{
    btnRight(){
      setTimeout(function(){
        location.href = '/h5/coin-battle/?webkey=coin-battle'
      },300)
    },
    promptshow(str){
      clearTimeout(t);
      this.prompt = str
      var _this=this;
      this.show=true;
      var t=setTimeout(function() {
        _this.show=false;
      }, 2000)
    },
    closeModel(){
      this.modelMess = false;
    },
    Default(e){
      e.preventDefault()
    },
    ruleTou(){
      this.modelMess = true;
    },
    btnLeft(){
      this.spin = true;
        if(this.isLogin){
        let data = this.dataPush
        this.$http.post('/actives1/AcActivityInfo/index',ZYLIB.req({data:data})).then((responese)=>{
          this.spin = false;
          if(responese.body.code==10000){
            let datas = responese.body.data
            this.isLogin = datas.isLogin;
            this.myAwardList = datas.myAwardList;
            this.$refs.op.openModal();
            this.model=true;
          }else{
            this.promptshow(responese.body.message)
          }
        })

        }else{
          //调用登录
          console.log('调用登录')
          ZYLIB.ZYInteractive.postMessage({ 'key': "login"},'请登录后再来~')
        }
    },
    refurbishGundong(){
      this.winerList = "";
      var $marqueeContent = document.querySelector('.marquee').querySelector('.contents');
      $marqueeContent.innerHTML = "";

      let data = {
        webkey: this.webkey
      }
      this.$http.post('/actives1/AcActivityInfo/index',ZYLIB.req({data:data})).then((responese)=>{

        if(responese.body.code==10000){
          let datas = responese.body.data;
          this.winerList = datas.winerList || [];
        }
    })
    },
  },
  created(){
    function getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    let webkey;
    try {
      webkey = getQueryString("webkey").split('/')[0] || "";
      this.webkey = webkey;
    } catch (error) {
      webkey = "";
    }
    let data = {
      webkey:webkey
    }

    this.dataPush = data
    this.$http.post('/actives1/AcActivityInfo/index',ZYLIB.req({data:data})).then((responese)=>{
      this.spin = false;
      //原有的初次处理数据
      if(responese.body.code==10000){
        let datas = responese.body.data
        this.isLogin = datas.isLogin;
        // this.myAwardList = datas.myAwardList;
        global.activityId = datas.actInfo.actId;
        global.schemeId = datas.webkey.schemeId;

        this.rule = datas.webkey.rule;
        this.awardList = datas.awardList;
        this.winerList = datas.winerList || [];
        this.times = (datas.times==undefined)?1:datas.times;
        if(this.times==0){
          global.vue.$emit('timeNum')
        }

      }else{
        this.promptshow(responese.body.message)
      }

      //增加toast 提示文字
      if(responese.body.data.bigWinner){
        let bigWinner = responese.body.data.bigWinner[0]
        setTimeout(function(){

          ZYLIB.toast({
              text: `<span>${bigWinner.phone}获得了<font color='#fff157'>${bigWinner.awardName}</font></span>`,
              time:2000,
              style:"top:.6rem;left:-2rem;transform:translateY(-50%);text-align:center;",
                innerstyle:'padding:.25rem .333333rem;border-radius:.666rem;background-color: rgba(0, 0, 0, 0.4);font-size: '+(typeof lib!="undefined"?lib.flexible.dpr:1)*13+'px;'
          })

        },3000)

      }

    })
    global.vue.$on('times',()=>{
      this.times--
    })
    global.vue.$on('refurbishGundong',()=>{
      this.refurbishGundong()
    })
  }
}
</script>

<style lang="scss">
@import "/style/utils.scss";
html,body,div,header,section,footer,img,a,p,form,input,span,ul,li,h2 {
  margin: 0;
  padding: 0;
}
a,input,button{ outline:none;}
html{
  background: #1eadc7;
}
body {
	width: 100%;
  font-family: "微软雅黑";
  background: #1eadc7;
}
header,section,footer,img {
  display: block;
}
a {
  text-decoration: none;
}
ul,li {
  list-style: none;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
color: #c5c5c5;
}
input:-moz-placeholder, textarea:-moz-placeholder {
color: #c5c5c5;
}
input::-moz-placeholder, textarea::-moz-placeholder {
color: #c5c5c5;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
color: #c5c5c5;
}
input {
  color: #000;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -moz-tap-highlight-color: rgba(0,0,0,0);
  -o-tap-highlight-color: rgba(0,0,0,0);
}
img {
  border: none;
}
#app {
	width: 10rem;
	margin: 0 auto;
  font-family: '微软雅黑';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   /* 设置全部页面用统一的背景图片 */
  height: 16.226667rem /* 1217/75 */;
  background: url('assets/images/bg.png') center no-repeat;
  background-size: 100% auto;
}
.ovfHiden {
  overflow-y: hidden;
  height: 100%;
}

/* 页面相关的样式 */
.rule{
  width: 1.2rem /* 90/75 */;
  height: 1.466667rem /* 110/75 */;
  margin-left: 8.133333rem /* 610/75 */;
  // border: 1px solid red ;
}
.prize{
  height:2.373333rem /* 178/75 */;
  width:8.40rem /* 630/75 */;
  margin:4.293333rem /* 322/75 */ auto 0;
  overflow: hidden;
}
.prize .prizeBox{
  width:1.84rem /* 138/75 */;
  height:2.373333rem /* 178/75 */;
  display: inline-block;
  margin-left:.25rem;
  overflow: hidden;
}
.prize .prizeBox:first-child{
  margin-left:0.17333rem;
}
.prize .pic{
  width:1.84rem /* 138/75 */;
  height:1.84rem /* 138/75 */;
  position: relative;
}
.prizeName{
  font-family: '黑体';
  width:1.84rem /* 138/75 */;
  @include font-dpr(10px);
  line-height: .56rem /* 42/75 */;
  color: #2e2e2e;
  text-align: center;
  white-space:nowrap;
  /* overflow: hidden;
  text-overflow: ellipsis; */
}
.pic img{
  max-height: 1.466667rem /* 110/75 */;
  max-width: 1.466667rem /* 110/75 */;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
//按钮
.btn{
  width: 100%;
  height: 1.68rem /* 126/75 */;
  margin-top:.4rem /* 30/75 */;
  position: relative;
  z-index: 10;
}
.btncon{
  display: inline-block;
  width: 3.893333rem /* 292/75 */;
  height: 1.133333rem /* 85/75 */;
  border-radius:1.133333rem /* 85/75 */;
  position: relative;
}
.btncon::before{
  content: "";
  background-color: rgba(0, 0, 0, .45);
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  padding-left: .093333rem /* 7/75 */;
  padding-right: .093333rem /* 7/75 */;
  padding-bottom: .133333rem /* 10/75 */;
  left: -.093333rem /* 7/75 */;
  top: .146667rem /* 11/75 */;
  z-index: -1;
  border-radius: 1.266667rem /* 95/75 */;
  box-shadow:0 .02rem /* 1/75 */ 0 rgba(0, 0, 0, .45);
}
.btnLeft{
  margin-left: .68rem /* 51/75 */;
  background: #e74c4a url("assets/images/btnText1.png") no-repeat center;
  background-size: auto .506667rem /* 38/75 */;
  box-shadow:0 .133333rem /* 10/75 */ 0 #931c24;
}
.btnRight{
  margin-left: .853333rem /* 64/75 */;
  background: #49ac73 url("assets/images/btnText2.png") no-repeat center;
  background-size: auto .506667rem /* 38/75 */;
  box-shadow:0 .133333rem /* 10/75 */ 0 #2a7346;
}
.btncon:active{
  box-shadow:inset 0 -.026667rem /* 2/75 */ 0 rgba(0, 0, 0, .45);
  top: .173333rem /* 13/75 */;
}
.btncon:active::before{
  top: -.026667rem /* 2/75 */;
}
//友好提示
.prompt{
  position: absolute;
  text-align: center;
  background: rgba(0,0,0,.5);
  color: #FFFFFF;
  width: 84%;
  height: 1.2rem;
  line-height:1.2rem;
  top: 55%;
  left: 8%;
  @include font-dpr(15px);
  z-index: 500;
}
.spin{
  position: absolute;
  width: .88rem /* 66/75 */;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}
// 模态
.ruleCon{
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .65);
  top:0;
  left: 0;
  overflow: hidden;
  z-index: 1000;
}
//规则内容
.contrule{
  background: #ffffff;
  min-height:8.68rem /* 701/75 */;
  width:8.16rem /* 632/75 */;
  background-size: 100% auto;
  border-radius: .133333rem /* 10/75 */;
  margin: 1.773333rem /* 133/75 */ auto 0;
  color: #000;
  .contruleTop{
    height: .76rem /* 57/75 */;
    padding-top: .346667rem /* 26/75 */;
    text-align: center;
    @include font-dpr(18px);
    font-weight: bold;
  }
  .contruleCon{
    width:7.013333rem /* 526/75 */;
    margin: 0 auto;
    padding-bottom: 0.88rem;
    @include font-dpr(14px);
    p{
      margin-top: .133333rem /* 10/75 */;
      line-height: .746667rem /* 56/75 */;
      letter-spacing: -0.0133rem;
    }
  }
}
.linerule{
  height: 1.093333rem /* 82/75 */;
  width: 2px;
  margin: 0 auto;
  background: #ffffff;
}
.closerule{
  width: .866667rem /* 65/75 */;
  height: .866667rem /* 65/75 */;
  background: url("assets/images/close.png") center no-repeat;
  background-size:auto 100%;
  margin: 0 auto;
}
</style>
