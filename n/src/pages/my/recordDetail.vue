<template>
<div class="recordDetail">
  <div class="recordDetailCon">
    <div class="detailConTop">
      <div class="detailTop" :style="{color:colorStyle(item.io)}">{{item.io>0?"+":""}}{{item.io<0?"-":""}}{{item.amount}}<span>元</span></div>
      <div>交易金额</div>
    </div>
    <ul class="conBottom">
      <li>
        <div>交易类型</div>
        <div>{{item.type2CH}}</div>
      </li>
      <li>
        <div>交易时间</div>
        <div v-text="eventTime(item.eventTime)"></div>
      </li>
      <li v-if="item.cardNo">
        <div>交易卡号</div>
        <div>{{item.cardNo}}</div>
      </li>
      <li v-if="item.productName">
        <div>交易产品</div>
        <div>{{item.productName}}</div>
      </li>
      <li v-if="item.couponName">
        <div>红包类型</div>
        <div>{{item.couponName}}</div>
      </li>
      <li>
        <div>交易流水</div>
        <div>{{item.orderNo}}</div>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Utils from "../../utils/Utils";
import router from "../../router";
export default {
  name:"recordDetail",
  data () {
    return {
      item:{}
    }
  },
  methods: {
    eventTime(time){
      return Utils.formatTimestamp({time:time,showtime:false})
    },
    colorStyle(io){
      if(io==0){
        return '#3b3b3b'
      }
      if(io>=0){
        return '#e45038'
      }
      if(io<=0){
        return '#41933f'
      }
    },
  },
  created () {
    let item = this.$route.query
    this.item = item
  }

}
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.recordDetail{
  height: 100%;
  width: 100%;
  background: #ffffff;
}
.detailConTop{
  height: 4rem /* 300/75 */;
  border-bottom: .013333rem /* 1/75 */ solid #d2d2d2;
  color: #3b3b3b;
  .font-dpr(28);
  display: flex;
  justify-content:center;
  flex-direction: column;
  align-items: center;
}
.detailTop{
  // color: #e45038;
  .font-dpr(66);
  span{
    .font-dpr(28);
    margin-left: .053333rem /* 4/75 */;
  }
  padding-bottom: .266667rem /* 20/75 */;
}
.conBottom{
  padding: .266667rem /* 20/75 */ .533333rem /* 40/75 */ 0;
  li{
    display: flex;
    flex-direction:row;
    justify-content:space-between;
    .font-dpr(28);
    color: #3b3b3b;
    div:first-child{
      color: #a6a6a6;
    }
    height: .8rem /* 60/75 */;
    line-height: .8rem /* 60/75 */;
  }

}
</style>



