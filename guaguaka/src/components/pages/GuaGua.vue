<template>
  <div class="guagua" id="cBox">
    <!-- 无刮刮卡 -->
    <div class="act" v-if="timeNum==0">
      <div class="title">获取刮刮卡</div>
      <div class="detil">
        <div class="detilCon" @click='goTnList'>投资后惊喜</div>
        <a href="/h5/jifenMall/" class="detilCon">积分兑换</a>
      </div>
    </div>
    <div v-else>
    <canvas id="c1" class="canvas"></canvas>
    <div class="act clickTop" @click='getAward' v-if="clickTops">
        点我刮奖
    </div>
      <!-- 获奖 -->
      <div class="act" v-if="awardName">
        <div class="onAward">恭喜您！获得<span>{{awardName}}</span></div>
      </div>
      <!-- 未获奖 -->
      <div class="act" v-else>
        <div class="title">很遗憾，未中奖</div>
        <div class="detil">&nbsp别灰心，再刮一次吧！</div>
      </div>
    </div>
    <div class="prompt" v-show="show">
      {{prompt}}
    </div>
    <div class="spin"><Spinner :size="size" bgcolor="#000" forecolor="transparent" v-show="spin" /></div>
  </div>
</template>
<script>
var tup,c1, ctx, ismousedown,fontem,lockRefurbishGundong = true;
import { Spinner } from '../Spinner'
export default {
  name: "guagua",
  props:['timeNum'],
  components:{
    Spinner
  },
  data() {
    return {
      pic: require("../../assets/images/guatop.png"),
      awardName: "",
      clickTops: true,
      spin:false,
      size: lib.flexible.dpr*20,
      prompt:"",
      show:false,
    };
  },
  methods: {
    goTnList(){
      if(this.ue().iphone==true){
        //跳转到IOS定期列表
        ZYLIB.ZYInteractive.postMessage({ 'key':"ZYFixedViewController"},'请至APP进行相关投资~')
      }else if(this.ue().android==true){
        //跳转到安卓定期列表
        ZYLIB.ZYInteractive.postMessage({ 'key': "to_activity",'id':11},'请至APP进行相关投资~')
      }else{
        this.promptshow('请至APP进行相关投资~')
      }
    },
    ue(){
      var e = navigator.userAgent.toLowerCase();
      return {
        iphone: /iphone/.test(e),
        android: /android/.test(e),
        winphone: /windows phone/.test(e),
        weixin: /micromessenger/.test(e),
        qqnews: /qqnews/.test(e),
        mqqbrowser: /mqqbrowser/.test(e),
        qq: /\sqq/.test(e)
      }
    },
    getAward(){
      this.spin = true;
      let data = {
        actId: global.activityId,
        schemeId: global.schemeId
      }
      this.$http.post('/actives1/AcActivity/userReward',ZYLIB.req({data:data})).then((responese)=>{
        this.spin = false;
        if(responese.body.code==10000){
          let datas = responese.body.data;
          this.awardName = datas.awardType=='NONE'?"":datas.awardName;
          global.vue.$emit('times');
          this.clickTops =false;
        }else if(responese.body.code==10001){
          console.log("登录")
          ZYLIB.ZYInteractive.postMessage({ 'key': "login"},'请登录后再来~')
        }else{
          this.promptshow(responese.body.message)
        }
      })
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
    initCanvas() {
      this.clickTops =true;
      //解开刮完调用接口锁定
      lockRefurbishGundong = true;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(tup, 0, 0, c1.width, c1.height);
      ctx.globalCompositeOperation = "destination-out";
    },
    loadCanvas() {
      if(this.timeNum==0){
        return false
      }
      c1 = document.getElementById("c1");

      //获取宽高设置为canvas宽高
      c1.width = c1.clientWidth;
      c1.height = c1.clientHeight;
      ctx = c1.getContext("2d");
      //暂只考虑移动端
      c1.addEventListener("touchstart", eventDown, false);
      c1.addEventListener("touchend", eventUp, false);
      c1.addEventListener("touchmove", eventMove, false);
      //初始化
      this.initCanvas();
      //按下
      function eventDown(e) {
        e.preventDefault();
        ismousedown = true;
      }
      //结束
      function eventUp(e) {
        half();
        e.preventDefault();
        ismousedown = false;
      }
      //进行中
      function eventMove(e) {
        e.preventDefault();
        if (ismousedown) {
          if (e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
          }
          var cBox = document.getElementById("cBox");
          var oX = cBox.offsetLeft,
            oY = cBox.offsetTop;
          var x = (e.clientX + document.body.scrollLeft || e.pageX) - oX || 0,
            y = (e.clientY + document.body.scrollTop || e.pageY) - oY || 0;
          ctx.beginPath();
          //刮圆
          ctx.arc(x, y, fontem, 0, Math.PI * 2);

          //修复部分手机不支持 destination-out，原理暂不明
          c1.style.display = "none";
          c1.offsetHeight;
          c1.style.display = "inherit";
          ctx.fill();
        }

      }
      //被刮开一半时开始处理结果
      function half() {
        var a = ctx.getImageData(0, 0, c1.width, c1.height);
        var j = 0;
        for (var i = 3; i < a.data.length; i += 4) {
          if (a.data[i] == 0) j++;
        }
        //一半时
        if (j >= a.data.length / 8) {

          ctx.fillRect(0, 0, c1.clientWidth, c1.clientHeight);
          ctx.fill();

          if(lockRefurbishGundong){
            //发生监听通知刷新下方滚动，刷新函数在APP.VUE
            global.vue.$emit('refurbishGundong');
            // 刮完之后锁定，防止空刮掉接口
            lockRefurbishGundong = false;
          }
        }
      }
    }
  },
  // 刮刮卡代码
  mounted() {
    var that = this
    // 刮动的图片
    tup = new Image();
    tup.src = this.pic;
    fontem = parseInt(document.getElementById("html").style["font-size"]) / 2;
    window.onload = function() {
      ZYLIB.ZYInteractive.postMessage( {"key":"header-right-button","text":" ","target-data":""} ,"");
      (function () {
        that.loadCanvas()
        //下方滚动事件
        var speed = 30*lib.flexible.dpr*lib.flexible.dpr; // 速度 -- px每秒
        var $marquee = document.querySelector('.marquee');
        var $marqueeContent = $marquee.querySelector('.content');
        // 内容复制3份好有连续性
        $marqueeContent.innerHTML = $marqueeContent.innerHTML + $marqueeContent.innerHTML + $marqueeContent.innerHTML
        var contentWidth = $marqueeContent.getBoundingClientRect().width;
        if (contentWidth <= 0) {
          return;
        }
        // 内容复制了3份，宽度也要除以3
        contentWidth = contentWidth / 3
        // 计算一次动画应该要花费多少时间
        var onceTime = contentWidth / speed; //s
        $marqueeContent.style.animationDuration = onceTime + "s"
        $marqueeContent.setAttribute('style',`
          animation: kf-marque-animation ${onceTime}s infinite linear;
          -webkit-animation: kf-marque-animation ${onceTime}s infinite linear;
        `)
      })()
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
.guagua {
  width: 100%;
  height: 100%;
  position: relative;
}
.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
}

.act {
  width: 100%;
  height: 100%;
  position: absolute;
}
// 无次数
.title {
  font-family: "黑体";
  text-align: center;
  @include font-dpr(20px);
  height: 0.733333rem;
  line-height: 0.733333rem;
  padding-top: 0.586667rem;
  color: #000;
}
.detil {
  margin-top: .133333rem /* 10/75 */;
  font-family: "黑体";
  height: 0.746667rem;
  line-height: 0.746667rem;
  text-align: center;
  @include font-dpr(16px);
  color: #e74c4a;
  .detilCon {
    color: #e74c4a;
    display: inline-block;
    width: 48%;
    text-align: center;
  }
}
// 中奖
.onAward {
  font-family: "黑体";
  @include font-dpr(18px);
  text-align: center;
  line-height: 2.666667rem;
  letter-spacing: 0.026667rem;
  span {
    color: #e74c4a;
  }
}
.clickTop{
  z-index: 200;
  color: #e74c4a;
  text-align: center;
  line-height: 2.666667rem;
  letter-spacing: .053333rem /* 4/75 */;
  @include font-dpr(26px);
  background: url('../../assets/images/guatop.png') center no-repeat;
  background-size: 100% 100%;
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
  z-index: 499;
}
</style>

