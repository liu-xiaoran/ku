<template>
<div class="current">
<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
  <div class="warp">
      <div class="conent">
        <div class="banner">
          <div class="productName">{{datas.productName}}</div>
          <div class="bannerIcon">
            <div class="bannerIcons">
              <!-- 图标的循环，要放在前面 -->
              <div v-for="(item,index) in datas.labelList" :key="index">
                <img class="iconimg" src="../../images/x/icon_chuizi.png" @touchstart="tishistart(2)" @touchmove="tishiend" @touchend="tishiend" v-if="item.labelType=='extend'&&item.labelNo=='Q'" />
                <img class="iconimg" src="../../images/x/icon_yiminjingren.png" @touchstart="tishistart(3)" @touchmove="tishiend" @touchend="tishiend" v-if="item.labelType=='extend'&&item.labelNo=='R'" />
                <img class="iconimg" src="../../images/x/icon_touzijinxi.png" @touchstart="tishistart(4)" @touchmove="tishiend" @touchend="tishiend" v-if="item.labelType=='extend'&&item.labelNo=='A5'" />
              </div>
              <!-- 基础标签，放在后面 -->
              <div v-for="(item,index) in datas.labelList" :key="index">
                <span v-if="item.labelType=='extend'&&item.labelNo!='Q'&&item.labelNo!='R'&&item.labelNo!='A5'">{{item.labelName}}</span>
              </div>
            </div>
          </div>
          <div class="bannerMain"><span class="num">{{datas.expAror||'0.00'}}</span><span class="nump">%</span><span v-if="datas.rewardInterest&&datas.rewardInterest!='0.00'"><span class="numPlus">+</span><span class="num">{{datas.rewardInterest||'0.00'}}</span><span class="nump">%</span></span></div>
          <div class="bannerTishi">历史年化收益率<img @touchstart="tishistart(1)"  @touchmove="tishiend" @touchend="tishiend" src="../../images/x/nianhuashuoming@2x.png" /></div>
          <div class="bannerMin"><span>{{datas.investMin||'0.00'}}元起投</span><span>{{datas.durationPeriodDays}}{{datas.durationPeriodType=="DAY"?"天":"个月"}}期限</span></div>
          <v-touch class="bannerTishiModel" v-if="tishiModel" @tap="clickModel">
             <div class="bannerTishiCon" :style="{top:topTishi}">{{bannerTishiCon}}</div>
          </v-touch>
        </div>
        <div class="wanfen">
              <div class="lines">
                <div class='linesCon' :style="{width:widths+'%'}"></div>
              </div>
              <div class="linestext">
                <span>已售{{datas.percent}}%</span><span>剩余可投{{datas.remainMoney}}元</span>
              </div>
        </div>
        <div class="proDt">
          <div class="proDtConwarp">
          <div class="proDtCon">
            <span>每万元投资历史收益</span>
            <span class="proDtCon1">{{datas.tenThousandIncome}}元</span>
          </div>
          <!-- <div class="proDtCon">
            <span>产品总额</span>
            <span class="proDtCon2">{{datas.raisedTotalNumber}}元</span>
          </div> -->
          <div class="proDtCon">
            <span>募集期</span>
            <span class="proDtCon2">{{datas.raisePeriodDays}}天</span>
          </div>
          <div class="proDtCon">
            <span>还款方式</span>
            <span class="proDtCon2">{{datas.paybackName}}</span>
          </div>

          <!-- 新增时间线 -->
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
              <span>{{datas.state!='RAISING'?'已售罄':datas.investTime}}</span>
              <span>{{datas.durationBegTime}}</span>
              <span>{{datas.payBackDate}}</span>
            </div>
          </div>
          </div>
          <v-touch class="goDt" @tap="goDt()">点击查看详情 &gt;</v-touch>
        </div>

    </div>
    <div class="btnBottom">
      <v-touch :class="btnBottomCon=='购买'?'btnBottomCon':'btnBottomCons'" @tap="buy">
        {{btnBottomCon}}
      </v-touch>
    </div>
    <logBase></logBase>
  </div>
</van-pull-refresh>
</div>
</template>
<script>
import { PullRefresh } from "vant";
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Tips from "../../utils/Tips";
import Utils from "../../utils/Utils";
import router from "../../router";
import logBase from '../logBase';
export default {
  name: "productTn",
  components: {
    logBase
  },
  data() {
    return {
      isLoading: false,
      headHeight: lib.flexible.rem2px(1.3),
      tishiModel: false,
      datas: {},
      widths: "0",
      bannerTishiCon: "",
      topTishi: "2.106667rem /* 158/75 */",
      btnBottomCon: "购买"
    };
  },
  watch: {
    isLoading() {
      if (this.isLoading) {
        this.onRefresh();
      }
    }
  },
  methods: {
    onRefresh() {
      this.getDetail();
    },
    tishistart(num) {
      switch (num) {
        case 1:
          this.bannerTishiCon = "历史年化收益率（不代表真实收益率）";
          break;
        case 2:
          this.bannerTishiCon = "此产品满标者可获惊喜红包";
          break;
        case 3:
          this.bannerTishiCon = "此项目单笔投资最高者可获惊喜红包";
          break;
        case 4:
          this.bannerTishiCon = "此产品成功投资有机会获得惊喜礼包";
          break;
        default:
          this.bannerTishiCon = "";
          break;
      }
      this.tishiModel = true;
    },
    tishiend() {
      this.tishiModel = false;
      this.bannerTishiCon = "";
    },
    clickModel(){
      this.tishiModel =false;
    },
    goDt() {
      if (!Utils.tapHandler()) {
        return;
      }
      router.push({
        name: "productDetail",
        query: { productId: this.datas.oid, productType: "REGULAR",state:this.datas.state}
      });
    },
    buy() {
      if (!Utils.tapHandler()) {
        return;
      }
      if(this.btnBottomCon!="购买"){
        Tips.alert("已售罄")
        return
      }
      Utils.goBuyCheck(
        {
          productOid: this.datas.oid,
          productType: "REGULAR"
        },
        this
      );
    },
    doDetail(datas) {
      let data = datas.data.content;
      if (data) {
        data.expAror = Utils.formatCurrency(data.expAror);
        data.rewardInterest = data.rewardInterest
          ? Utils.formatCurrency(data.rewardInterest)
          : data.rewardInterest;
        data.investMin = Utils.formatCurrency(data.investMin);
        data.tenThousandIncome = Utils.formatCurrency(data.tenThousandIncome);
        data.remainMoney = Utils.formatCurrency(data.remainMoney);
        data.tenThousandIncome = Utils.formatCurrency(data.tenThousandIncome);
        // data.raisedTotalNumber = Utils.formatCurrency(data.raisedTotalNumber);
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
        productName: data.productName,
        remainMoney: data.remainMoney,
        // raisedTotalNumber: data.raisedTotalNumber,
        durationPeriodType: data.durationPeriodType,
        durationPeriodDays: data.durationPeriodDays,
        raisePeriodDays: data.raisePeriodDays,
        percent: data.percent,
        durationBegTime: data.durationBegTime,
        payBackDate: data.payBackDate,
        state:data.state
      };
      this.widths = data.percent; // + "%"
    },
    async getDetail() {
      let res = await Http.post({
        url: Api.getRegularDetail,
        data: {
          productOid: this.datas.oid
        },
        localCache:1
      });
      if (res.code == 10000) {
        this.doDetail(res);
        this.isLoading = false;
      }
    }
  },
  created() {
    this.datas.oid = this.$route.query.productId;
    if (this.$route.query.state == "RAISING") {
      this.btnBottomCon = "购买";
    } else {
      this.btnBottomCon = "已售罄";
    }

    this.getDetail();
  }
};
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.current {
  width: 100%;
  height: 100%;
}
.warp {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height:17.786667rem;
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
  height: 0.426667rem;
  margin-top: 0.346667rem;
  padding-right: 6%;
}
.bannerIcons {
  display: flex;
  flex-direction: row;
  height: 0.426667rem;
  line-height: 0.426667rem;
  .iconimg {
    position: relative;
    display: inline-block;
    width: 0.426667rem;
    height: 0.426667rem;
    margin: 0 0.106667rem;
  }
  span {
    display: inline-block;
    height: 0.426667rem;
    line-height: 0.476667rem;
    color: #ffffff;
    border:.02rem /* 2/75 */ solid #ffffff;
    border-radius: 0.266667rem;
    .font-dpr(24);
    padding: 0 0.133333rem;
    margin: 0 0.106667rem;
  }
}
.bannerMain {
  height: 2.106667rem;
  margin-top: 0.093333rem;
  line-height: 2.106667rem;
  color: #ffffff;
  text-align: center;
  .num {
    .font-dpr(100);
  }
  .nump {
    .font-dpr(32);
  }
  .numPlus {
    .font-dpr(60);
  }
}
.bannerTishi {
  text-align: center;
  color: #ff8b8b;
  .font-dpr(26);
  line-height: 0.386667rem;
  height: 0.386667rem;
  img {
    width: 0.386667rem;
    height: 0.386667rem;
    margin-left: 0.226667rem;
    vertical-align: sub;
    position: relative;
  }
}
.bannerMin {
  height: 1.693333rem;
  margin-top: 0.626667rem;
  line-height: 1.693333rem;
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
  width: 5.066667rem;
  padding: 0.266667rem;
  background: #ffffff;
  left: 3.6rem;
  top: 2.533333rem;
  span {
    border: 0.186667rem solid #ffffff;
    transform: rotate(45deg);
    position: absolute;
  }
}
.wanfen {
  height: 1.866667rem;
  color: #3b3b3b;
  background: #ffffff;
  line-height: 1.866667rem;
  text-align: center;
  .font-dpr(30);
}
.lines {
  width: 9.333333rem;
  height: 0.186667rem;
  background: #e0e0e0;
  border-radius: 0.186667rem;
  margin: 0 auto;
  position: relative;
  top: 0.56rem;
  overflow: hidden;
  .linesCon {
    height: 0.186667rem;
    background: #ffa163;
    margin: 0 auto;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.linestext {
  display: flex;
  width: 9.333333rem;
  margin: 0 auto;
  justify-content: space-between;
  .font-dpr(24);
  color: #a6a6a6;
}
.wanfenmoney {
  color: #e45038;
}
.proDt {
  flex-grow: 1;
  margin-top: 0.266667rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
}
.proDtConwarp {
  width: 100%;
  background: #ffffff;
}
.proDtCon {
  height: 1.173333rem;
  border-bottom: 0.013333rem solid #efefef;
  width: 9.333333rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #a6a6a6;
  .font-dpr(28);
  line-height: 1.173333rem;
  margin: 0 auto;
}
.proDtCon1 {
  color: #df3318;
}
.proDtCon2 {
  color: #3b3b3b;
}
.goDt {
  padding-bottom: 0.4rem;
  .font-dpr(26);
  color: #6289b8;
  text-align: center;
  padding-top: 0.4rem;
}
.line {
  width: 9.066667rem;
  height: 0.64rem;
  margin: 0 auto;
  border-bottom: 0.03rem solid #d2d2d2;
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
.timeText {
  .font-dpr(24);
  color: #a6a6a6;
  margin-top: 0.133333rem;
}
.timespan {
  .font-dpr(24);
  color: #a6a6a6;
  margin-top: .133333rem /* 10/75 */;
}
.times {
  .font-dpr(24);
  color: #3b3b3b;
  margin-top: 0.133333rem;
  height: .533333rem /* 40/75 */;
}
.btnBottom {
  height: 1.226667rem;
  width: 100%;
  .btnBottomCon {
    background: #e45038;
    .font-dpr(32);
    height: 100%;
    color: #ffffff;
    text-align: center;
    line-height: 1.12rem;
  }
  .btnBottomCons {
    background: #dcdcdc;
    .font-dpr(32);
    height: 100%;
    color: #656565;
    text-align: center;
    line-height: 1.12rem;
  }
}
.productName{
  color: #ffffff;
  .font-dpr(36);
  text-align: center;
  height: 1.173333rem /* 88/75 */;
  line-height: 1.173333rem /* 88/75 */;
}
.van-pull-refresh {
	height: 100%;
}
</style>

