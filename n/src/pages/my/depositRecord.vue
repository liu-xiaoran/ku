<template>
<div class="depositRecord">


<div class="timeBoxTop" v-if="!model">
  <div class="kong">{{startTime?startTime:'资金记录'}}{{endTime?(' 至 '+endTime):""}}</div>
  <v-touch @tap="timeSelect"><img src="../../images/x/shaixuanshijian.png" /></v-touch>
  <v-touch class="boxTopLeft" style="padding-bottom:.066667rem /* 5/75 */;" @tap="styleSelect">{{type2.key?type2.value:"交易类型"}}<img src="../../images/x/icon_fenlei.png" class="fenlei" /></v-touch>
</div>
<div class="contentBox">
<van-pull-refresh v-model="isLoading" :headHeight="headHeight" class="content">

<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="40">

  <div class="dataArr" v-for="(value,key) in dataObj" :key="key">
    <div class="timeBox">
      <div v-text="timeFet(key)" class="kongTime"></div>
      <div></div>
      <div></div>
      <!-- <v-touch @tap="timeSelect"><img src="../../images/x/shaixuanshijian.png" /></v-touch>
      <v-touch style="padding-bottom:.066667rem /* 5/75 */;" @tap="styleSelect">交易类型<img src="../../images/x/icon_fenlei.png" class="fenlei" /></v-touch> -->
    </div>
    <div class="record" v-for="(item,index) in value" :key="index">
       <v-touch class="recordCon" @tap='goDetail(item)'>
         <div class="recordConLeft">
            <img :src="iconImgArr[item.type1]">
            <div>
              <div>{{item.type2CH}}</div>
              <div class="recordConTime" v-text="eventTime(item.eventTime)"></div>
            </div>
         </div>
         <div class="recordConRight" :style="{color:colorStyle(item.io)}">
           {{item.io>0?"+":""}}{{item.io<0?"-":""}}{{item.amount}}
         </div>
       </v-touch>
    </div>
  </div>
</div>
<div class="weui-loadmore" v-if="!reachBottom&&!isLoading">
  <div class="weui-loading"></div>
  <div class="weui-loadmore__tips">正在加载</div>
</div>
<!--触底提示-->
<div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-if="dataObj&&Object.keys(this.dataObj).length>0 && reachBottom">
  <div class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多了</div>
</div>
<div class="empty-placeholder row-center" v-if="!dataObj||(dataObj&&Object.keys(this.dataObj).length<=0)">
  <span class="ml20">暂无数据...</span>
</div>
</van-pull-refresh>
</div>
<logBase></logBase>
<v-touch class="model" v-show="model" @tap='styleSelect' >
    <div class="modelCon">
      <div class="modelConTop">
        <span class="iconfont icon-cha"></span>选择交易类型
      </div>
      <v-touch v-for="(item,index) in MoneyType" class="typeBtn" @tap="Selects(item)" :key="index">
        {{item.value}}
      </v-touch>
    </div>
</v-touch>
</div>
</template>
<script>
import { PullRefresh, Waterfall } from "vant";
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Utils from "../../utils/Utils";
import router from "../../router";
import logBase from "../logBase";
export default {
  name: "depositRecord",
  directives: {
    WaterfallLower: Waterfall("lower")
    // WaterfallUpper: Waterfall('upper')
  },
  components: {
    logBase
  },
  watch: {
    isLoading() {
      if (this.isLoading) {
        this.onRefresh();
      }
    }
  },
  data() {
    return {
      isLoading: false,
      // loading:false,
      headHeight: lib.flexible.rem2px(1.3),
      pageInfo: {
        //分页数据
        pageNo: 1,
        pageSize: 10
      },
      disabled: false, //下拉锁定
      reachBottom: false, //触底时修改
      dataObj: {},
      iconImgArr: {
        FREE: require("../../images/x/dong.png"),
        RED: require("../../images/x/xian.png"),
        WITH: require("../../images/x/ti.png"),
        RECH: require("../../images/x/chong.png"),
        DING: require("../../images/x/ding.png"),
        HUO: require("../../images/x/zhang.png")
      },
      MoneyType: [],
      startTime: "",
      endTime: "",
      type2: {
        key: "",
        value: ""
      },
      model: false
    };
  },
  methods: {
    onRefresh() {
      this.dataObj = {};
      this.getRecord(1);
    },
    loadMore() {
      //上拉加载后的函数
      this.disabled = true;
      // this.loading = true;
      this.getRecord();
    },
    async getRecord(pageNo) {
      if (pageNo) this.pageInfo.pageNo = pageNo;
      let res = await Http.post({
        url: Api.my.moneyRecord,
        data: {
          pageInfo: this.pageInfo,
          startTime: this.startTime,
          endTime: this.endTime,
          type2: this.type2.key,
          extend: 1
        },
        login: 1,
        extendInfo: ["MoneyType"]
      });
      // this.loading = false;
      if (res.code == 10000) {
        this.isLoading = false;
        let datass = res.data.list;
        if (pageNo) this.dataObj = {};
        if (datass && datass.length > 0) {
          for (let value of datass) {
            value.amount = Utils.formatCurrency(value.amount);
          }
          this.clusterDate(datass);
        } else {
          this.disabled = true; //禁用上拉加载更多
          this.reachBottom = true;
        }

        if (res.extendInfo.MoneyType) {
          this.MoneyType = res.extendInfo.MoneyType;
        }
        this.disabled = false; //结束上拉
        if (this.pageInfo.pageNo >= res.data.pageInfo.totalPage) {
          this.reachBottom = true;
          this.disabled = true; //禁用上拉加载更多
        }
        this.pageInfo.pageNo++;
      }
    },
    clusterDate(data) {
      let datas = JSON.parse(JSON.stringify(this.dataObj));
      for (let i in data) {
        let time = new Date(data[i].eventTime);
        let yeas = time.getFullYear(),
          month = time.getMonth();
        let key = yeas * 100 + month + "_date";
        if (!datas[key]) {
          datas[key] = [];
        }
        datas[key].push(data[i]);
      }
      this.dataObj = JSON.parse(JSON.stringify(datas));
    },
    timeFet(time) {
      time = time + "";
      let yeas = time.substring(0, 4) - 0;
      let month = time.substring(4, 6) - 0;
      return yeas + "年" + month + "月";
    },
    eventTime(time) {
      return Utils.formatTimestamp({ time: time, showtime: false });
    },
    colorStyle(io) {
      if (io == 0) {
        return "#3b3b3b";
      }
      if (io >= 0) {
        return "#e45038";
      }
      if (io <= 0) {
        return "#41933f";
      }
    },
    timeSelect() {
      router.replace({
        name: "timeSelect",
        query: {
          startTime: this.startTime || "",
          endTime: this.endTime || ""
        }
      });
    },
    Selects(item) {
      this.type2 = item;
      this.dataObj = {};
      this.getRecord(1);
    },
    styleSelect() {
      let that = this;
      setTimeout(function() {
        that.model = !that.model;
      }, 100);
    },
    goDetail(item) {
      let data = {
        io: item.io,
        amount: item.amount,
        type2CH: item.type2CH,
        eventTime: item.eventTime,
        cardNo: item.eventTime,
        productName: item.productName,
        couponName: item.couponName,
        orderNo: item.orderNo
      };
      router.push({
        name: "recordDetail",
        query: {
          ...data
        }
      });
    }
  },
  created() {
    this.startTime = this.$route.query.startTime || "";
    this.endTime = (this.$route.query.endTime==this.startTime?"":this.$route.query.endTime) || "";
    this.getRecord(1);
  }
};
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.depositRecord {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.timeBoxTop {
  height: 6%;
  background: #ffffff;
  color: #a6a6a6;
  .font-dpr(28);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.333333rem;
  .kong {
    .font-dpr(26);
    width: 5.5rem;
    text-align: left;
  }
  img {
    width: 0.426667rem;
    vertical-align: middle;
    padding-right: 0.5rem;
    padding-bottom: .066667rem /* 5/75 */;
  }
  .fenlei {
    margin-left: 0.266667rem;
    margin-top: -0.126667rem;
  }
  .boxTopLeft {
    width: 3.5rem;
    text-align: right;
    img{
      padding: 0;
    }
  }
}
.timeBox {
  height: 1.173333rem;
  background: #f0f0f0;
  color: #a6a6a6;
  .font-dpr(28);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.333333rem;
  img {
    width: 0.426667rem;
    vertical-align: middle;
  }
  .fenlei {
    vertical-align: text-top;
    margin-left: 0.266667rem;
  }
}
.record {
  background: #ffffff;
}
.recordCon {
  height: 1.76rem;
  padding: 0 0 0 0.32rem;
  color: #3b3b3b;
  border-bottom: 0.013333rem solid #dfdfdf;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.record .recordCon:last-child {
  border-bottom: none;
}
.recordConLeft {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 0.826667rem;
    height: 0.826667rem;
    margin-right: 0.213333rem;
  }
}
.recordConRight {
  display: flex;
  align-items: center;
  margin-right: 0.32rem;
  .font-dpr(32);
}
.recordConTime {
  margin-top: 0.08rem;
  .font-dpr(24);
}
.model {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row-reverse;
  height: 100%;
  overflow: hidden;
}
.modelCon {
  width: 5.08rem;
  padding-left: 0.32rem;
  background: #ffffff;
  animation: fadeout 0.1s;
  overflow: auto;
}
.modelConTop {
  height: 1.92rem;
  line-height: 1.92rem;
  .font-dpr(36);
  span {
    display: inline-block;
    width: 0.346667rem;
    margin-right: 0.533333rem;
    .font-dpr(38);
    color: #a9a9a9;
  }
}
.ml20 {
  .font-dpr(30);
}
.typeBtn {
  width: 100%;
  height: 1.253333rem;
  line-height: 1.253333rem;
  border-top: 0.013333rem solid #dfdfdf;
}
.contentBox{
  overflow-y:scroll;
  flex: 1;
}
.content {
	height: 98%;
}
</style>

