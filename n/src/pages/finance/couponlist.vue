<style lang="less">
  @import "../../style/base/mixin/rpx.less";
  #couponLists {
    width: 94%;
    padding: 0.266667rem 3% 0;
  }
</style>
<style lang="scss">
@import '../../style/vant-css/checkbox.scss';

</style>
<template>
  <div id="couponLists">
    <div v-for="(item, index) in list" >
      <div style="border-radius: 0.2rem;" @click="couponClick(item.ucId)">
        <Coupon :item="item" ><van-checkbox v-model="item.checked"></van-checkbox></Coupon>
      </div>
      <!-- <div :class="['coupon-box',(!item.type||item.type=='NOTUSED')?'coupon-box-'+item.couponType:'coupon-box-gray']">
        <div class="coupon-box-t"></div>
        <div class="coupon-title">
          <div class="coupon-title-1">
            <span class="coupon-title-name">{{item.name}}</span>
            <div class="coupon-type">{{item.couponTypeCh}}</div>
          </div>
          <div class="coupon-title-2" v-if="item.couponType=='RATECOUPON'">
            <span class="rmb">+ </span><span class="num">{{item.couponAmount}}%</span>
          </div>
          <div class="coupon-title-2" wx:else>
            <span class="rmb">¥ </span><span class="num">{{item.couponAmount}}</span>
          </div>
        </div>
        <div class="coupon-content">
          <div>仅限投资{{item.limitLabels}}</div>
          <div class="coupon-content-two">满{{item.limitInvestAmount}}元使用</div>
          <div class="coupon-btnbox">
            <span class="grey">有效期至:{{item.expireTime}}</span>
            <div class="weui-cell__hd weui-check__hd_in-checkbox" @click="couponClick(item.ucId)">
              <icon color="#fb9558" type="circle" size="23" v-if="!item.checked"></icon>
              <icon color="#fb9558" type="success" size="23" v-if="item.checked"></icon>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <logBase></logBase>
  </div>
</template>

<script>
import wepy from '../../utils/wepy';
import Coupon from '../../components/My/Coupon';

import Vue from 'vue'
import { Checkbox } from 'vant';

Vue.component(Checkbox.name, Checkbox);

import logBase from '../logBase';

export default {
  
  components : {
    Coupon,
    logBase
  },
  data() {
    return {
      list:[]
    };
  },
  methods : {
    closeAutoFun(checked,choseed){
      
      window.amon_cache0.closeAuto=checked
      if(checked&&window.amon_cache.choseed!=choseed){//选中优惠券且需要更新当前优惠券
        window.amon_cache.choseed=choseed;
        this.updateInputMoneys();
      }else if(!checked&&window.amon_cache.choseed){//没有选中且当前有选中优惠券
        window.amon_cache.choseed=""
        // window.amon_cache.moneys=Math.min(window.amon_cache.remainMoney,window.amon_cache.availableBalance)
      }
      // this.returnBack()
    },
    /*
    选择优惠券更新输入框金额大于等于优惠券起投金额
    */
    updateInputMoneys(){
      if(window.amon_cache.choseed.limitInvestAmount>(window.amon_cache.moneys||0)){
        window.amon_cache.moneys=window.amon_cache.choseed.limitInvestAmount
      }
    },
    couponClick(id) {
      var checkboxItems = this.list,idx
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        if(checkboxItems[i].ucId === id){
          idx=i;
          checkboxItems[i].checked = !checkboxItems[i].checked;
        }else{
          checkboxItems[i].checked = false;
        }
      }
      // window.amon_cache.checked=checkboxItems[idx].checked
      // window.amon_cache.coupon={
      //   couponTypeCh:checkboxItems[idx].couponTypeCh,
      //   couponAmount:checkboxItems[idx].couponAmount,
      //   limitInvestAmount:checkboxItems[idx].limitInvestAmount,
      //   ucId:checkboxItems[idx].ucId,
      //   couponType:checkboxItems[idx].couponType
      // }
      this.closeAutoFun(checkboxItems[idx].checked,{
        couponTypeCh:checkboxItems[idx].couponTypeCh,
        couponAmount:checkboxItems[idx].couponAmount,
        limitInvestAmount:checkboxItems[idx].limitInvestAmount,
        ucId:checkboxItems[idx].ucId,
        couponType:checkboxItems[idx].couponType
      });
      setTimeout(()=>{
        console.log("window.amon_cache.moneys",window.amon_cache)
        this.$router.go(-1)
      },0)
      
    }
  },

  // onReady(){
  //   const currentPages=getCurrentPages()
  //   this.prePage=currentPages[currentPages.length-2]
  // },
  async mounted () {
    if(!window.amon_cache){
      location.href=location.origin+location.pathname;
    }
    this.list=window.amon_cache.newCoupons//this.$getPreloadData("coupons&choseed").coupons;
  }
}
</script>
