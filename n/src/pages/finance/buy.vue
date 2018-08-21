<style lang="less">
  @import "../../style/base/mixin/rpx.less";
  @import "../../style/utils.less";
  .buy-top{
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    height:2.4rem;
    color:#fff;
    margin-bottom:0.266667rem;
    background: linear-gradient(to left,#e33c4f,#fc5b57);
    .font-dpr(28);
  }

  .buy-cell{
    padding-top:0.533333rem;

    background-color:#fff;
    height:1.226667rem;
  }
  .buy-cell-con{
    height:0.933333rem;
    margin-left:0.466667rem;
    padding-right:0.466667rem;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    margin-bottom:0.293333rem;
  }
  .all-in {
    height:0.933333rem;
    width:2.0rem;
    min-width:2rem;
    line-height:0.933333rem;
    text-align:center;
    background-color:#e45038;
    color:#fff;
    border-radius:0.066667rem;
    .font-dpr(30);
  }
  .agreeBox{ margin-top:0.4rem;}
  .list-cell__bd{
    justify-content:center;
    align-items:center;
  }
  .icon_daijinquan{
    background-image:url(../../images/x/icon_daijinquan@2x.png);
    background-repeat:no-repeat;
    background-size:100%;
    background-positon:center;
  }
</style>
<template>
  <div>
  <div class="buy-top">
    <div>历史年化收益率{{top1}}</div>
    <div v-if="showtop2">剩余金额:{{remainMoneys}}元</div>
  </div>
  <div class="buy-cell">
    <div class="buy-cell-con ">
      <div style="font-size:0.88rem;color:#3b3b3b;vertical-align:bottom">¥&nbsp;</div>
      <div style="font-size:0.48rem;flex:1;">
        <input maxlength="12" type="digit" style="width:100%" :placeholder="investMinStr" placeholder-style="color:#d4d4d4" id="moneys" v-model="moneys" @input='onInput(moneys,remainMoney)'/>
      </div>
      <span style="font-size:0.32rem;color:#a6a6a6;padding-right:0.333333rem">预计收益:{{expect}}</span>
      <div class="all-in" @click="allIn">全投</div>
    </div>
  </div>
  <div class="mylist" style="margin-bottom:0.266667rem;">
    <div class="list-cell" style="border-top:0.03rem solid #dfdfdf">
      <div class="list-cell__bd">可用余额：{{availableBalances}}元</div>
      <div v-if="rechageTips!=='充值'" style="padding-right:0.133333rem;line-height: 0.373333rem;color: #e45038;font-size: 0.4rem;padding-left: 0;" class="eliminate iconfont icon-tanhao"></div>
      <div @click="goRecharge" class="list-cell__ft list-cell__ft_in-access"><span class="prompt" style="color:#e45038;">{{rechageTips}}</span></div>
    </div>
  </div>
  <div class="mylist" v-if="coupons>0">
      <div @click="goCouponList" class="list-cell" >
        <div class="list-cell__bdx" style="min-width:2.266667rem">使用优惠券</div>
        <div class="list-cell__bd" style="float:left;color:#e45038;font-size:0.32rem">{{choseed?"收益最高":coupons+"张可用"}}</div>
        <div class="list-cell__ft list-cell__ft_in-access">{{choseed?"已选择":"未选择"}}</div>


      </div>
  </div>
  <div class="mylist" v-if="choseed">
      <div @click="goCouponList" class="list-cell" style="padding-right:0.266667rem;border-top:0.006667rem solid #dfdfdf">
        <div class="icons icon_daijinquan" style="width:0.546667rem;height:0.373333rem" ></div>
        <div class="list-cell__ft" style="flex:1;text-align:left">{{choseedTips}}</div>
        <div class="eliminate" @click.stop="closeTicket"><div class="chasBtn iconfont icon-cha3"></div></div>
      </div>
  </div>
  <div class="btn-area">
    <button class="comBtn" :disabled="!moneys||(moneys-investMin<0)||!isChoose" @click="submit">确定</button>
  </div>
  <div class="agreeBox">
    <CheckboxOption value="true" @click="bindAgreeChange">我已阅读并同意</CheckboxOption>
    <a class="agreement" :href="'/actives1/static/protocolDetail?type=fengxian&title=风险揭示书'+'&t='+new Date().getTime()">《风险揭示书》</a>和<a @click="dingxiang" href="javascript:(void)" class="agreement">《定向委托投资协议》</a>
  </div>

  <Paypwdbox :message="toPwdBox" ref="edit" />
  <logBase></logBase>
</div>
</template>

<script>
import Vue from 'vue'
import wepy from '../../utils/wepy';
//import base from '../../mixins/base'
import Utils from '../../utils/Utils'
import Tips from '../../utils/Tips'
import Api from '../../utils/Api'
import Http from '../../utils/Http'
import {CheckboxOption} from '../../components/Checkbox';
// import input from '../../mixins/input'
import Paypwdbox from '../../components/pwdbox/Paypwdbox';
import logBase from '../logBase';

// 全局过滤器
Vue.filter('formatInputMoney', function (value) {
  let cache=value,max=1000;
  if(value.indexOf(".") > -1&&value.split(".")[1].length >= 3) {
    cache=value.substring(0,value.indexOf(".") + 3)
  }
  if(value.indexOf(".") == 0) {
    cache='0' + value
  }
  if(value-max>0){
    cache=max
  }
  if(cache!=value){
    return cache
  }else{
    return value
  }
})
export default {
  
  // mixins : [input,base],
  components : {
    CheckboxOption,
    Paypwdbox,
    logBase
  },

  data() {
    let amon_cache;
    if(window.amon_cache){
      amon_cache=JSON.parse(JSON.stringify(window.amon_cache));
      
    }

    return amon_cache||{
      moneys:"",
      top1:"",
      availableBalance:"",
      investMin:"",
      coupons:0,
      remainMoney:0,
      rechageTips:"充值",
      choseed:"",
      toPwdBox: {
        name: '',
        isMoney: ''
      },
      expect:"0.00元",
      isChoose:true
    }
  },
  methods : {
    onInput(value,max){
      let cache=value;
      if(value.indexOf(".") > -1&&value.split(".")[1].length >= 3) {
        cache=value.substring(0,value.indexOf(".") + 3)
      }
      if(value.indexOf(".") == 0) {
        cache='0' + value
      }
      if(value-max>0){
        cache=max
      }
      if(cache!=value){
        this.moneys=cache
      }else{
        this.moneys=value
      }
    },
    allIn(){

      let m=Math.min(this.remainMoney,this.availableBalance)
      let coupon=this.choseCoupon(m,this.closeAuto)||0
      m=Utils.Fadd(m,coupon);
      this.moneys=Math.min(this.remainMoney,m)
      console.log("allin")
    },
    goCouponList(){
      let coupons=this._investPrepose.coupons;
      let newCoupons=[];

      for (var i = coupons.length - 1; i >= 0; i--) {
        coupons[i].expireTime=Utils.formatTimestamp({time:coupons[i].expireTime})
        if(this.choseed&&(coupons[i].ucId==this.choseed.ucId)){
          console.log("设置为true");
          coupons[i].checked=true
          newCoupons.unshift(coupons[i])
        }else{
          coupons[i].checked=false
          newCoupons.push(coupons[i])
        }
      }

      // this.$preload("coupons&choseed",{coupons:newCoupons});
      window.amon_cache={
        moneys:this.moneys,
        top1:this.top1,
        availableBalance:this.availableBalance,
        investMin:this.investMin,
        coupons:this.coupons,
        remainMoney:this.remainMoney,
        rechageTips:this.rechageTips,
        choseed:this.choseed,
        toPwdBox:this.toPwdBox,
        expect:this.expect,
        isChoose:this.isChoose,
        newCoupons:newCoupons
      }
      window.amon_cache0={
        _investPrepose:this._investPrepose,

        detail:this.detail,
        calcMiddle:this.calcMiddle,
        productType:this.productType,
        productId:this.productId,
        formKey:this.formKey,
        firstEnterPage:this.firstEnterPage,
        calcMiddleA:this.calcMiddleA,
        calcMiddleB:this.calcMiddleB,
        calcMiddleC:this.calcMiddleC
      }
      // if(!this.choseed)
      // window.amon_cache0.closeAuto=false
      console.log("this.choseed",window.amon_cache);
      this.$router.push({path:"/couponlist"})
    },
    submit(){
      this.toPwdBox.isMoney = Utils.formatCurrency(this.moneys)+"元"
      this.toPwdBox.name="购买"+(this.productType=="REGULAR"?"定期":"掌薪宝")
      this.$refs.edit.toggleDialog()

    },
    closeTicket(){
      this.closeAuto=false;
      this.choseed="";
    },
    bindAgreeChange (e) {
      this.isChoose = e;
    },

    dingxiang(){
      location.href=`/actives1/static/protocolDetail?type=${this.showtop2?'regular_dingxiang':'current_dingxiang'}&pid=${this.productId}&orderAmount=${this.moneys||0}&t=${new Date().getTime()}`
    },
    /*
    提示去充值按钮
    */
    async goRecharge(url) {
      if(!Utils.tapHandler()){
        return
      }
      let res = await Http.post({
        url: Api.money.recharge,
        data: {},
        extendInfo: ['UserBasicInfo'],
        login:1,
        localCache:1
      })
      if(res.code == 10012) {
        this.$router.push({
          path:"/bindcard"
        })
      } else if(res.code == 10000 && res.data.valid) {
        let datas = res.data
        if(datas.rechargeMin) {
          datas.rechargeMins = Utils.formatCurrency(datas.rechargeMin)
        }
        this.$preload('nextData',datas)
        this.$router.push({
          path:"/recharge"
        })
      } else {
        Tips.alert(res.data.validDesc)
      }
    },
    /*
    根据金额选择优惠金额最大的优惠券
    */
    choseCoupon(m){

      const coupons=this._investPrepose.coupons||[];
      let choseed="",win=0//优惠金额
      for (var i = coupons.length - 1; i >= 0; i--) {
        if(Number(m)>=coupons[i].limitInvestAmount){
          try{
            const currentWin=coupons[i].couponType=="RATECOUPON"?Utils.Fmul(m,Utils.Fmul(Utils.Fmul(coupons[i].couponAmount,0.01),this.calcMiddleC)):Utils.Fadd(Utils.Fdiv(Math.floor(Utils.Fmul(Utils.Fmul(coupons[i].couponAmount,this.calcMiddleA),100)),100),Utils.Fdiv(Math.floor(Utils.Fmul(Utils.Fmul(coupons[i].couponAmount,this.calcMiddleB),100)),100))//计算优惠金额
            if(currentWin>win){
              choseed={
                couponTypeCh:coupons[i].couponTypeCh,
                couponAmount:coupons[i].couponAmount,
                limitInvestAmount:coupons[i].limitInvestAmount,
                ucId:coupons[i].ucId,
                couponType:coupons[i].couponType
              }
              win=currentWin
            }
          }catch(e){
            console.log(coupons,m+"error_____________________________________error",e);
          }

        }
      }


      // choseed=choseeds.sort(this.compare('couponAmountRes')).reverse()[0]||""

      if(this.choseed!=choseed){
        this.choseed=choseed;
      }
      return choseed.couponType=="RATECOUPON"?0:choseed.couponAmount
    },
    /*
    更新充值状态
    */
    isRecharge(m){
      if(Number(m)>Number(this.availableBalance)+(this.choseed&&this.choseed.couponType=="COUPON"?this.choseed.couponAmount:0)){
        this.rechageTips="余额不足，去充值"
      }else{
        this.rechageTips="充值"
      }
    },
    /*
    初始化产品数据
    */
    renderProduct(res){
      const dm={
        "DAY":"天",
        "MONTH":"月"
      }
      this.detail=res.data.content;
      this.dm={
        "DAY":this.detail.incomeCalcBasis,
        "MONTH":12
      }

      const a=Utils.Fdiv(this.detail.durationPeriodDays,this.dm[this.detail.durationPeriodType])
      const b=Utils.Fmul(this.detail.expAror,0.01)
      this.calcMiddleA=Utils.Fmul(a,b)

      const b1=Utils.Fmul(this.detail.rewardInterest,0.01)
      this.calcMiddleB=Utils.Fmul(a,b1)

      this.calcMiddleC=a


      // this.calcMiddle=Utils.Fadd(c,c1)
      // wx.setNavigationBarTitle({
      //   title: res.data.content.productFullName
      // })
      const rewardInterestStr=res.data.content.rewardInterest-0?("+"+res.data.content.rewardInterest+"%"):""
      this.top1=res.data.content.expAror+"%"+rewardInterestStr+"/"+(this.productType=="REGULAR"?(res.data.content.durationPeriodDays+dm[res.data.content.durationPeriodType]+"/"):"")+res.data.content.paybackName
      this.remainMoney=res.data.content.remainMoney
      this.availableBalance=this._investPrepose.availableBalance
      this.investMin=res.data.content.investMin
      this.coupons=this._investPrepose.coupons?this._investPrepose.coupons.length:0

      // const amon_cache=JSON.parse(JSON.stringify(window.amon_cache||""))
      // window.amon_cache=null;
      // console.log("amon_cache",amon_cache);
      // if(amon_cache){
      //   this.closeAutoFun(amon_cache.checked,amon_cache.coupon)
      // }

    },
    /*
     获取预计收益
    */
    async post() {
      this.formKey=""

      this.formKey=(new Date()).getTime()
      let data={
        "formKey": this.formKey,
        "orderAmount": this.moneys,
        "durationPeriodDays": this.detail.durationPeriodDays||1,
        "durationPeriodType": this.detail.durationPeriodType,
        "incomeCalcBasis": this.detail.incomeCalcBasis,

        "baseRate": this.detail.expAror,
        "rewardRate": this.detail.rewardInterest
      }
      if(this.choseed){
         data.couponAmount=this.choseed.couponAmount
         data.couponType=this.choseed.couponType
      }
      this.expect="计算中"
      let res = await Http.postTimeout({
        url: "/zybusiness/order/invest/getIncome",
        data,
        timeout:500
      })
      if(res&&res.code&&(res.code==10000)){
        if(res.data.formKey==this.formKey){
          this.expect=res.data.income+"元"
        }else{
          this.expect="计算中"
        }
      }else{
        this.expect="0.00元"
      }

    },
    /*
    支付密码回调
    */
    async isSuccessed(pwd){

      let data={
        productId:this.productId,
        orderAmount:this.moneys,
        payPasswd:pwd,
        payAmount:this.moneys,
      }
      if(this.choseed){
        data.payAmount=this.choseed.couponType=="COUPON"?Utils.Fsub(data.orderAmount,this.choseed.couponAmount):data.orderAmount
        data.couponAmount=this.choseed.couponAmount
        data.couponType=this.choseed.couponType
        data.userCouponId=this.choseed.ucId
      }
      let res = await Http.post({
        url: Api.invest,
        data,
        login:1
      })
      if(res.code==10000){
        /*如果使用了优惠券，清理优惠券 清理数据*/
        if(this.choseed){
          this.choseed=""
        }
        this.$preload("result",{router:"buy",productType:this.productType,...res.data});
        // wx.navigateTo({
        //   url: './result'
        // })
        this.$router.push({path:"/result"})
        Object.assign(this, this.def);
      }
      this.$refs.edit.toggleDialog()
    },
    /*
    供优惠券列表调用
    */
    // closeAutoFun(checked,choseed){

    //   this.closeAuto=true
    //   if(checked&&this.choseed!=choseed){//选中优惠券且需要更新当前优惠券
    //     this.choseed=choseed;
    //     this.updateInputMoneys();
    //   }else if(!checked&&this.choseed){//没有选中且当前有选中优惠券
    //     this.choseed=""
    //     this.moneys=Math.min(this.remainMoney,this.availableBalance)
    //   }
    //   this.returnBack()
    // },
    /*
    选择优惠券更新输入框金额大于等于优惠券起投金额
    */
    updateInputMoneys(){
      if(this.choseed.limitInvestAmount>(this.moneys||0)){
        this.moneys=this.choseed.limitInvestAmount
      }
    },
    returnBack(){
      /*回页面的时候刷新*/
      if(this.moneys){
        if(!this.closeAuto)//list页会把closeAuto设置为true
        this.choseCoupon(this.moneys);
        this.isRecharge(this.moneys);
        if(this.detail){
          this.post()
        }
      }
    }
  },
  computed : {
    availableBalances () {
      return Utils.formatCurrency(this.availableBalance);
    },
    remainMoneys () {
      return Utils.formatCurrency(this.remainMoney);
    },
    choseedTips(){
      return this.choseed?this.choseed.couponTypeCh+this.choseed.couponAmount+",满"+this.choseed.limitInvestAmount+"元使用":""
    },
    max(){
      return this.remainMoney
    },
    showtop2(){
      return this.top1.split('/').length>2
    },
    investMinStr(){
      return (this.investMin?Utils.formatCurrency(this.investMin):0)+'元起投'
    }
  },
  watch : {
    moneys(newValue, oldValue) {
      console.log(newValue, oldValue,this.closeAuto);
      if(!this.closeAuto)//list页会把closeAuto设置为true
      this.choseCoupon(newValue);
      this.isRecharge(newValue);
      if(this.detail){
        this.post()
      }
    },
    choseed(newValue, oldValue){
      // console.log("____________________________",newValue, oldValue);
    }
  },

  /*
  初始化数据
  */
  // async mounted () {


  //   this.firstEnterPage=true
  //   this._investPrepose=this.$getPreloadData(this.$route.params.productId+"_investPrepose");
  //   this.productType=this.$route.params.productType
  //   this.closeAuto=false;
  //   if(this.$route.params.money) {
  //     this.moneys = this.$route.params.money
  //   }
  //   if(this.$route.params.productType!=="REGULAR"){
  //     this.closeAuto=true;
  //   }
  //   this.renderProduct(this.$getPreloadData(this.$route.params.productId))
  //   this.productId=this.$route.params.productId

  // },
  created(){
    if(window.amon_cache0){
      let amon_cache0=JSON.parse(JSON.stringify(window.amon_cache0));
      window.amon_cache0=null;
      this._investPrepose=amon_cache0._investPrepose||""
      this.closeAuto=amon_cache0.closeAuto||false
      this.detail=amon_cache0.detail||null
      this.calcMiddle=amon_cache0.calcMiddle||0;
      this.productType=amon_cache0.productType||""
      this.productId=amon_cache0.productId||""
      this.formKey=amon_cache0.formKey||""
      this.firstEnterPage=amon_cache0.firstEnterPage||false
      this.calcMiddleA=amon_cache0.calcMiddleA
      this.calcMiddleB=amon_cache0.calcMiddleB
      this.calcMiddleC=amon_cache0.calcMiddleC
    }

  },
  beforeDestroy(){
    console.log("beforeDestroy")
  },

  /*
  每次回到此页面，刷新数据
  */
  async mounted(){
    console.log("window.amon_cache",window.amon_cache)
    if(window.amon_cache&&window.amon_cache0){
      return
    }
    window.amon_cache=null;
    this.productType=this.$route.params.productType
    this.productId=this.$route.params.productId
    let res = await Http.post({
      url: Api.investPrepose,
      data: {
        productId: this.productId+""
      },
      localCache:1
    })
    if(res.code == 10000 && res.data.valid) {
      this._investPrepose=res.data
      let detail = await Http.post({
        url: this.productType=="CURRENT"?Api.getCurrentDetail:Api.getRegularDetail,
        data: {
          productOid: this.productId+""
        },
        localCache:1
      })
      if(detail.code == 10000) {
        this.renderProduct(detail)

      }
    }
  }


  // compare(property){
  //   return function(a,b){
  //       var value1 = a[property];
  //       var value2 = b[property];
  //       return value1 - value2;
  //   }
  // }


}

</script>
