<template>
<van-pull-refresh v-model="isLoading" :headHeight="headHeight" class="current">
  <div class="warp">
      <div class="conent">
        <div class="banner">
          <div class="productName">{{datas.productName}}</div>
          <div class="bannerIcon" v-if="datas.labelList&&datas.labelList!=0">
            <div class="bannerIcons" v-for="(item,index) in datas.labelList" :key="index">
              <span>{{item.labelName}}</span>
            </div>
          </div>
          <div class="bannerMain"><span class="num">{{datas.expAror||'0.00'}}</span><span class="nump">%</span><span v-if="datas.rewardInterest&&datas.rewardInterest!='0.00'"><span class="numPlus">+</span><span class="num">{{datas.rewardInterest||'0.00'}}</span><span class="nump">%</span></span></div>
          <div class="bannerTishi">历史年化收益率<img @touchstart="tishistart()" @touchend="tishiend()" @touchmove="tishiend()" src="../../images/x/nianhuashuoming@2x.png" /></div>
          <div class="bannerMin"><span>{{datas.investMin||'0.00'}}元起投</span><span>{{datas.paybackName}}</span></div>
          <v-touch class="bannerTishiModel" v-if="tishiModel" @tap="clickModel">
             <div class="bannerTishiCon">历史年化收益率（不代表真实收益率）<span></span></div>
          </v-touch>
        </div>
        <div class="wanfen">
              <span>每万元投资历史收益<span class="wanfenmoney">{{datas.tenThousandIncome||'0.00'}}元</span></span>
        </div>
        <div class="timeline">
          <div>
            <div class="line"></div>
            <div class="cir">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="cir timespan">
              <span>今日申购</span>
              <span>收益计算</span>
              <span>收益发放</span>
            </div>
            <div class="cir times">
              <span>{{datas.investTime}}</span>
              <span>{{datas.interestsFirstDate}}</span>
              <span>{{datas.interestsPayBackDate}}</span>
            </div>
          </div>
          <v-touch class="goDt" @tap="goDt">点击查看详情 &gt;</v-touch>
        </div>
    </div>
    <div class="btnBottom">
      <div class="btnBottomCon">
        <v-touch class="btnBottomLeft" @tap="redeem">转让</v-touch>
        <v-touch class="btnBottomRight" @tap="buy">抢购</v-touch>
      </div>
    </div>
  </div>
  <logBase></logBase>
</van-pull-refresh>
</template>

<script>
import { PullRefresh } from 'vant';
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Tips from "../../utils/Tips";
import Utils from "../../utils/Utils";
import router from "../../router";
import logBase from '../logBase';
export default {
  name: "Current",
  components: {
    logBase
  },
  data() {
    return {
      isLoading: false,
      headHeight: lib.flexible.rem2px(1.3),
      tishiModel: false,
      datas: {}
    };
  },
  watch: {
    isLoading() {
      if(this.isLoading) {
        this.onRefresh()
      }
    }
  },
  methods: {
    onRefresh() {
      this.getDetail()
    },
    tishistart() {
      this.tishiModel = true;
    },
    tishiend() {
      this.tishiModel = false;
    },
    clickModel(){
      this.tishiModel =false;
    },
    goDt() {
      let _this = this;
      if (!Utils.tapHandler()) {
        return;
      }
      router.push({ name: "productDetail",query:{productId:_this.datas.oid,productType:'CURRENT'}});
    },
    redeem() {
      if (!Utils.tapHandler()) {
        return;
      }
      this.isRedeem();
    },
    buy() {
      if (!Utils.tapHandler()) {
        return;
      }
      this.goBuy({
        productOid: this.datas.oid,
        productType: "CURRENT"
      });
    },
    async goBuy(itemName) {
      Utils.goBuyCheck(itemName, this);
    },
    async isRedeem() {
      let res = await Http.post({
        url: Api.money.redeemPrepose,
        data: {
          productId: this.datas.oid
        },
        login: 1,
        extendInfo: ["UserBasicInfo"]
      });
      if (res.code == 10000) {
        if (res.extendInfo.UserBasicInfo.isBindCard == 1) {
          if (!res.data.valid && res.data.validDesc) {
            Tips.alert(res.data.validDesc);
          } else if (res.data.holdAmount <= 0) {
            Tips.toast("您暂未持有该产品");
          } else {
            let datas = res.data;
            datas.maxRedeemAmounts = Utils.formatCurrency(
              datas.maxRedeemAmount
            );
            datas.maxSingleDayRedeemAmount = Utils.formatCurrency(
              datas.maxSingleDayRedeemAmount
            );
            router.push({name:"Redeem",query:{
              p:this.datas.oid
            }}); //跳转到转让页面
          }
        } else {
          router.push({name:"bindcard"}); //跳转到绑卡页面
        }
      }
    },
    doDetail(datas) {
      let data = datas.data.content;
      if (data) {
        data.expAror = Utils.formatCurrency(data.expAror);
        data.rewardInterest = data.rewardInterest?Utils.formatCurrency(data.rewardInterest): data.rewardInterest;
        data.investMin = Utils.formatCurrency(data.investMin);
        data.tenThousandIncome = Utils.formatCurrency(data.tenThousandIncome);
      }
      this.datas = {
        expAror: data.expAror,
        rewardInterest: data.rewardInterest,
        investMin: data.investMin,
        tenThousandIncome: data.tenThousandIncome,
        labelList: data.labelList,
        paybackName: data.paybackName,
        interestsFirstDate: data.interestsFirstDate,
        investTime: data.investTime,
        interestsPayBackDate: data.interestsPayBackDate,
        oid: data.oid,
        productName: data.productName
      };
    },
    async getDetail() {
      let res = await Http.post({
        url: Api.getCurrentDetail
      });
      if (res.code == 10000) {
        this.doDetail(res);
        this.isLoading = false
      }
    }
  },
  created(){
    this.getDetail()
  }
};
</script>

<style scoped lang="less">
@import "../../style/utils.less";
.current{
  width: 100%;
  height: 100%;
}
.warp {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: stretch;
  justify-content: space-between;
}
.conent {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.banner {
  width: 100%;
  background: linear-gradient(to top, #e43c4f, #f85656);
  overflow: hidden;
}
.bannerIcon {
  display: flex;
  flex-direction: row-reverse;
  height: .426667rem /* 32/75 */;
  margin-top: .346667rem /* 26/75 */;
  padding-right: 6%;
}
.bannerIcons {
  display: flex;
  flex-direction: row;
  height: .426667rem /* 32/75 */;
  line-height: .426667rem /* 32/75 */;
  .iconimg {
    display: inline-block;
    width: .426667rem /* 32/75 */;
    height: .426667rem /* 32/75 */;
    margin: 0 .106667rem /* 8/75 */;
  }
  span {
    display: inline-block;
    height: .426667rem /* 32/75 */;
    line-height: 0.476667rem;
    color: #ffffff;
    border:.026667rem /* 2/75 */ solid #ffffff;
    border-radius: .266667rem /* 20/75 */;
    font-size: .32rem /* 24/75 */;
    padding: 0 .133333rem /* 10/75 */;
    margin: 0 .106667rem /* 8/75 */;
  }
}
.bannerMain {
  height: 2.106667rem /* 158/75 */;
  margin-top: .093333rem /* 7/75 */;
  line-height:2.106667rem /* 158/75 */;
  color: #ffffff;
  text-align: center;
  .num {
    .font-dpr(100)
  }
  .nump {
    .font-dpr(32)
  }
  .numPlus {
    .font-dpr(60)
  }
}
.bannerTishi {
  text-align: center;
  color: #ff8b8b;
  .font-dpr(32);
  line-height:.386667rem /* 29/75 */;
  height:.386667rem /* 29/75 */;
  img {
    width: .386667rem /* 29/75 */;
    height: .386667rem /* 29/75 */;
    margin-left:.226667rem /* 17/75 */;
    vertical-align: bottom;
    position: relative;
  }
}
.bannerMin {
  height: 1.693333rem /* 127/75 */;
  // margin-top: .626667rem /* 47/75 */;
  line-height:1.693333rem /* 127/75 */;
  color: #ffffff;
  .font-dpr(28);
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.bannerTishiModel {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
}
.bannerTishiCon {
  position: absolute;
  z-index: 10;
  color: #a6a6a6;
  .font-dpr(26);
  width: 5.066667rem /* 380/75 */;
  padding: .266667rem /* 20/75 */;
  background: #ffffff;
  top: 2.106667rem /* 158/75 */;
  left: 4.133333rem /* 310/75 */;
  span {
    border:.186667rem /* 14/75 */ solid #ffffff;
    transform: rotate(45deg);
    position: absolute;
    bottom: -.16rem /* 12/75 */;
    left: 2.533333rem /* 190/75 */;
  }
}
.wanfen {
  height:1.866667rem /* 140/75 */;
  color: #3b3b3b;
  background: #ffffff;
  line-height: 1.866667rem /* 140/75 */;
  text-align: center;
  .font-dpr(30);
}
.wanfenmoney {
  color: #e45038;
}
.wanfen::before {
  content: "";
  display: inline-block;
  position: relative;
  bottom: .08rem /* 6/75 */;
  left: -.48rem /* 36/75 */;
  height: .013333rem /* 1/75 */;
  width: 1.52rem /* 114/75 */;
  background: #d2d2d2;
}
.wanfen::after {
  content: "";
  display: inline-block;
  position: relative;
  bottom:.08rem /* 6/75 */;
  left: .48rem /* 36/75 */;
  height:.013333rem /* 1/75 */;
  width: 1.52rem /* 114/75 */;
  background: #d2d2d2;
}
.timeline {
  flex-grow: 1;
  margin-top: .266667rem /* 20/75 */;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goDt {
  padding-bottom: .4rem /* 30/75 */;
  .font-dpr(26);
  color: #6289b8;
  text-align: center;
  padding-top: .4rem /* 30/75 */;
}
.line {
  width: 9.066667rem /* 680/75 */;
  height: .88rem /* 66/75 */;
  margin: 0 auto;
  border-bottom:.04rem /* 3/75 */ solid #d2d2d2;
}
.cir {
  width: 9.306667rem /* 698/75 */;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cir div {
  position: relative;
  background: #ffffff;
  width: .186667rem /* 14/75 */;
  height: .186667rem /* 14/75 */;
  border:.026667rem /* 2/75 */ solid #5d7cb3;
  border-radius: 50%;
  bottom: .12rem ;
}
.timespan {
  .font-dpr(24);
  color: #a6a6a6;
  margin-top: .133333rem /* 10/75 */;
}
.times {
  .font-dpr(24);
  font-size: .32rem /* 24/75 */;
  color: #3b3b3b;
  margin-top: .133333rem /* 10/75 */;
}
.btnBottom {
  height: 1.226667rem /* 92/75 */;
  width: 100%;
  .btnBottomCon {
    border:.053333rem /* 4/75 */ solid #e45038;
    font-size:.426667rem /* 32/75 */;
    height:1.12rem /* 84/75 */;
    display: flex;
    flex-direction: row;
    div {
      width: 50%;
      height: 100%;
      text-align: center;
      line-height:1.12rem /* 84/75 */;
    }
  }
  .btnBottomLeft {
    color: #e45038;
    background: #ffffff;
  }
  .btnBottomRight {
    color: #ffffff;
    background: #e45038;
  }
}
.productName{
  color: #ffffff;
  .font-dpr(36);
  text-align: center;
  height: 1.173333rem /* 88/75 */;
  line-height: 1.173333rem /* 88/75 */;
}
</style>
