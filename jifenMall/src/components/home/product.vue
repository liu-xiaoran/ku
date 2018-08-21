<template>
<div class="product">
  <div class="top">
    <div v-if="item.price">{{item.price}}积分</div>
  </div>
  <div class="pic">
    <img :src="item.icon">
  </div>
  <div class="title" v-html="item.title">
  </div>
  <div class="desc" v-html="item.desc">
  </div>
  <div class="gain">
      <span v-if="point>=item.price&&(item.times>0||item.times==-1)" style="background:#e45038;" @click="gain">立即兑换</span>
      <span v-if="point<item.price&&(item.times>0||item.times==-1)" style="background:#cccccc;" @click="cannotGain(1)">积分不足</span>
      <span v-if="item.times==0" style="background:#cccccc;" @click="cannotGain(2)">次数不足</span>
  </div>

  <div class="model" v-if="model">
    <div class="modelCon">
      <div class="modelTitle">{{modelBody?('兑换'+item.title):'兑换成功'}}</div>
      <div class="modelBody1" v-if="modelBody">
        <div class="modelBody1Des">
          您将花费<span style="color:#e45038">{{item.price}}</span>积分换取“{{item.title}}”
        </div>
        <div class="modelBody1Times">
          <div v-if="item.times>0">
            <span style="color:#e45038">*</span>{{timeUnit(item.participation)}}您还可以兑换{{item.times}}次“{{item.title}}”
          </div>
        </div>
        <div class="modelBodyBtn">
          <div class="cancel" @click="closeModel">取消</div>
          <div class="sure" @click="sure">确认</div>
        </div>
      </div>
      <div class="modelBody2" v-else>
        <div class="modelBody2Des">
          您成功使用{{item.price}}积分兑换了一张{{item.title}}
        </div>
        <div class="modelBodyBtn">
          <div class="goPrizes" @click="goPrizes(item.jumpType)">{{goPrizesText(item.jumpType)}}</div>
          <div class="callback" @click="callback">返回</div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<script>
export default {
  name:"product",
  props: ['item','point'],
  data () {
    return {
      model:false,
      modelBody:true,
      orderId:""
    }
  },
  methods: {
    Default(e){
      e.preventDefault()
    },
    timeUnit(participation){
      if(participation==1){
        return '本日'
      }else if(participation==2){
        return "本周"
      }else{
        return ""
      }
    },
    goPrizesText(jumpType){
      if(jumpType=="GGK"){
        return "去刮奖"
      }else if(jumpType=="YPGF"){
        return "去参与"
      }else{
        return "去查看"
      }
    },
    cannotGain(num){
      if(num==1){
        this.$emit('prompt','哎呀，积分不足~，快去赚取')
      }else if(num==2){
        this.$emit('prompt','哎呀，次数不足~，下次再来')
      }
    },
    goPrizes(jumpType){
      if(jumpType=="GGK"){
        location.href = '/h5/guaguaka/?webkey=ggk'
      }else if(jumpType=="YPGF"){
        location.href = '/h5/beboldinheights/'
      }else{
        this.goList()
      }
    },
    goList(){
      if(this.ue().iphone==true){
        //跳转到IOS优惠券列表
        ZYLIB.ZYInteractive.postMessage({ 'key':"ZYGetCouponViewController"},'请至APP优惠券列表查看~')
      }else if(this.ue().android==true){
        //跳转到安卓优惠券列表
        ZYLIB.ZYInteractive.postMessage({ 'key': "to_activity",'id':201},'请至APP优惠券列表查看~')
      }else{
        this.$emit('prompt','请至APP优惠券列表查看~')
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
    closeModel(){
      document.removeEventListener('touchmove',this.Default);
      this.model = false;
    },
    callback(){
      this.closeModel()
      this.$emit('reload')
    },
    sure(){
      this.$emit('spin',true)
      //兑换积分
      let data = {
        orderId: this.orderId
      }
      this.$http.post('/actives1/point/exchange',ZYLIB.req({data:data})).then((responese)=>{
        this.$emit('spin',false)
        let res = responese.body
        if(res.code == 10000){
          this.modelBody = false;
        }else{
          this.modelBody = false;
          this.closeModel()
          this.$emit('prompt',res.message)
        }
      })
    },
    gain(){
      this.model = true;
      this.$emit('spin',true)
      document.addEventListener('touchmove',this.Default);
      this.modelBody = true;
      //调取前置
      let data = {
        giftId: this.item.id,
        num:1
      }
      this.$http.post('/actives1/point/exchangePre',ZYLIB.req({data:data})).then((responese)=>{
        this.$emit('spin',false)
        let res = responese.body
        if(res.code == 10000){
          this.orderId = res.data.orderId
        }else if(res.code == 10001){
          this.closeModel()
          ZYLIB.ZYInteractive.postMessage({ 'key': "login"},'请登录后再来~')
        }else{
          this.closeModel()
          this.$emit('prompt',res.message)
        }
      })

    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
.product{
  width: 100%;
  height: 100%;
}
.top{
  height: .426667rem /* 32/75 */;
  font-size: 0;
  div{
    display: inline-block;
    padding: 0 .2rem;
    min-width:1.8rem;
    height: 100%;
    background: #ffa955;
    @include font-dpr(13px);
    color: #ffffff;
    text-align: center;
    line-height: .426667rem /* 32/75 */;
    border-bottom-right-radius:.2rem /* 15/75 */;
  }
}
.pic{
  width: 4.693333rem /* 352/75 */;
  height: 2.346667rem /* 176/75 */;
  position: relative;
  overflow: hidden;
}
.pic img{
  max-height:2.4rem /* 180/75 */;
  max-width:2.4rem /* 180/75 */;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.title{
  width: 100%;
  text-align: center;
  @include font-dpr(13px);
  font-weight: bold;
  color: #3b3b3b;
}
.desc{
  height: 1.333333rem /* 100/75 */;
  width: 4.133333rem /* 310/75 */;
  margin: 0 auto;
  line-height: .466667rem /* 35/75 */;
  margin-top: .066667rem /* 5/75 */;
  overflow: hidden;
  @include font-dpr(12px);
}
.gain{
  width: 4.693333rem /* 352/75 */;
  height: 1.226667rem /* 92/75 */;
  text-align: center;
  line-height: 1.226667rem /* 92/75 */;
  span{
    // display: inline-block;
    @include font-dpr(13px);
    color: #ffffff;
    padding:.133333rem /* 10/75 */ .36rem /* 27/75 */;
    border-radius:.613333rem /* 46/75 */;
  }
}
//模态框
.model{
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .65);
  top:0;
  left: 0;
  overflow: hidden;
  z-index: 20;
}
.modelCon{
  width: 8rem /* 600/75 */;
  height: 5.373333rem /* 403/75 */;
  background: #ffffff;
  border-radius: .053333rem /* 4/75 */;
  margin:3.466667rem /* 260/75 */ auto 0;
  color: #3b3b3b;
}
.modelTitle{
   width: 100%;
   height: 1.4rem /* 105/75 */;
   border-bottom: 1px solid #a6a6a6;
   line-height: 1.4rem;
   @include font-dpr(16px);
   text-align: center;
   font-weight: bold;
   letter-spacing: .026667rem /* 2/75 */;
}
.modelBody1Des{
    @include font-dpr(13px);
    height: 1.493333rem /* 112/75 */;
    // margin-left: .4rem /* 30/75 */;
    text-align: center;
    line-height: 1.93333rem;
}
.modelBody1Times{
    @include font-dpr(13px);
    // margin-left: .4rem /* 30/75 */;
    text-align: center;
    height:1.133333rem /* 85/75 */;
    line-height: 1.033333rem;
}
.modelBody2Des{
    @include font-dpr(13px);
    width: 100%;
    height: 2.613333rem /* 196/75 */;
    line-height: 2.613333rem /* 196/75 */;
    text-align: center;
}
.modelBodyBtn{
    @include font-dpr(14px);
    height: .866667rem /* 65/75 */;
    width: 100%;
    // overflow: hidden;
    text-align: center;
    line-height: .866667rem /* 65/75 */;
    div{
      width: 3.173333rem /* 238/75 */;
      height: .84rem /* 63/75 */;
      border-radius: .04rem /* 3/75 */;
    }
}
.cancel{
    color: #3b3b3b;
    border: 1px solid #a7a7a7;
    float: left;
    margin-left: .533333rem /* 40/75 */;
}
.sure{
    color: #ffffff;
    background: #e45038;
    float: left;
    margin-left: .56rem /* 42/75 */;
}
.goPrizes{
    color: #ffffff;
    background: #e45038;
    float: left;
    margin-left: .533333rem /* 40/75 */;
}
.callback{
    color: #ffffff;
    background: #e45038;
    float: left;
    margin-left: .56rem /* 42/75 */;
}
</style>

