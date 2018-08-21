<template>
  <van-pull-refresh v-model="isLoading" :headHeight="headHeight">
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400">
      <div v-for="(item, index) in items" class="products-item" @click="toProductDeatils(item.productOid,item.state)">
        <div class="tnContent">
          <div class="productname">
            <span class="name">{{item.name}}</span>
            <div v-for="(items, index) in item.labelList">
              <img class="iconImg" src="../../images/x/icon_chuizi.png" v-if="items.labelType=='extend'&&items.labelNo=='Q'" />
              <img class="iconImg" src="../../images/x/icon_yiminjingren.png" v-if="items.labelType=='extend'&&items.labelNo=='R'" />
              <img class="iconImg" src="../../images/x/icon_touzijinxi.png" v-if="items.labelType=='extend'&&items.labelNo=='A5'" />
            </div>
            <div v-for="(items, index) in item.labelList">
              <span class="labeTexts" v-if="items.labelNo!='R'&&items.labelNo!='Q'&&items.labelNo!='A5'&&(item.state!='RAISING')&&(items.labelType=='extend')">{{items.labelName}}</span>
              <span class="labeText" v-if="items.labelNo!='R'&&items.labelNo!='Q'&&items.labelNo!='A5'&&(item.state=='RAISING')&&(items.labelType=='extend')">{{items.labelName}}</span>
            </div>
          </div>
          <div class="productContent">
            <div class="content1">
              <div class="shouyi">
                <span v-bind:class="[item.state ? 'RAISING' : 'greys', 'bfb','syl']">{{item.expArrorDisp}}<span class="add">%</span>
                <span v-if="item.rewardInterest"><span class="add">+</span>{{item.rewardInterest}}<span class="add">%</span></span>
                </span>
                <span v-bind:class="[item.state ? 'RAISING' : 'greys', 'datas','tz']">{{item.durationPeriodDays}}<span class="add">{{item.durationPeriodType=='DAY'?'天':'月'}}</span></span>
              </div>
              <div class="shouyis">
                <span class="ys syl">历史年化收益率</span>
                <span class="ys tz">投资期限</span>
              </div>
            </div>
            <div class="content2">
              <div v-if="item.state=='RAISING'" class="cir">
                  <ring :canvasId="'canvas'+item.productOid"
                          :type="canvasData.type"
                          :width="canvasData.width"
                          :height="canvasData.height"
                          :data="[{ name: 'a', value: item.percent },{ name: 'b', value:100-item.percent }]"
                          :options="canvasData.options"
                  ></ring>
                  <!-- <ve-ring :data="{columns:['b','percent'],rows:[{'a':'1','percent':item.percent},{'a':'1','percent':100-item.percent}]}" :settings="chartSettings" :legend-visible="false" :colors="['#e45038','#dfdfdf']"></ve-ring> -->
                <div class="cc">{{item.percent}}<span class="bf">%</span></div>
              </div>
              <img class="shouqin" src="../../images/x/shouqin.png" v-else />
            </div>
          </div>
        </div>
        <div class="tnFooter">
          <span class="ys">{{item.investMin||0}}元起投</span>
          <span class="ys" v-if="item.state=='RAISING'">剩余{{item.remainMoneys}}元</span>
        </div>
      </div>
    </div>
    <div class="weui-loadmore" v-if="!this.reachBottom">
      <div class="weui-loading"></div>
      <div class="weui-loadmore__tips">正在加载</div>
    </div>
    <!--触底提示-->
    <div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-if="this.items&&this.items.length>0 && this.reachBottom">
      <div class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多了</div>
    </div>
    <div class="empty-placeholder row-center" v-if="(!this.items||(this.items&&this.items.length<=0))">
      <span class="ml20">暂无数据...</span>
    </div>
    <logBase></logBase>
  </van-pull-refresh>
</template>
<script>
import Vue from 'vue'
import wepy from '../../utils/wepy';
import { PullRefresh, Waterfall } from 'vant';
Vue.component(PullRefresh.name, PullRefresh);
// import VeRing from 'v-charts/lib/ring'
// Vue.component(VeRing.name, VeRing)
import Ring from '../../components/Ring.vue'
import Api from '../../utils/Api';
import Tips from '../../utils/Tips';
import Utils from '../../utils/Utils';
import Http from '../../utils/Http';
import logBase from '../logBase';
export default {
  directives: {
    WaterfallLower: Waterfall('lower')
    // WaterfallUpper: Waterfall('upper')
  },
  components: {
    logBase,
    Ring
  },
  data() {
    return {
      count: 0,
      isLoading: false,
      items: [],
      disabled: false,
      pageNo: 1,
      pageSize: 10,
      reachBottom: false,
      headHeight:lib.flexible.rem2px(1.3),
      canvasData: {
        type: 'ring',
        width: lib.flexible.rem2px(1.742),
        height: lib.flexible.rem2px(1.742),
        options: {
          bgColor: '#fff',             // 默认背景颜色 #e3e3e3
          titlePosition: 'top',           // 图表标题位置: top / bottom
          colorList: ['#e45038', '#dfdfdf'],    // 环形图颜色列表
          radius: parseInt(lib.flexible.rem2px(1.7*0.5)),                    // 环形图外圆半径
          innerRadius: lib.flexible.rem2px(0.6)                // 环形图内圆半径
        }
      }  
    }
  },

  watch: {
    isLoading() {
      if (this.isLoading) {
        // setTimeout(() => {
        //   // Toast('刷新成功');
        //   this.isLoading = false;
        //   this.count++;
        // }, 500);
        this.onRefresh()
      }
    }
  },
  created(){
    this.chartSettings = {
      radius: [lib.flexible.rem2px(1.742*0.5), lib.flexible.rem2px(0.6)],
      offsetY: lib.flexible.rem2px(1.742*0.5),
      label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: false,
                textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            }
        }
    }
  },
  mounted() {
    this.getData(1)
    this.top = 1
    this.bottom = 20
  },
  methods: {
    onRefresh() {
      this.getData(1)
    },
    loadMore() {
      this.disabled = true;
      console.log("loadMore")
      this.getData()
    },
    async getData(pageNo) {
      if(pageNo)this.pageNo=pageNo
      let res = await Http.post({
        url: Api.getRegularProductList,
        data: {
          pageInfo: {
            pageNo: this.pageNo,
            pageSize: this.pageSize
          },
          channelOid: wepy.$instance.globalData["contractId"]
        }
      })
      this.isLoading = false; //结束下拉刷新
      this.disabled = false;//结束上拉
      if (this.pageNo >= res.data.totalPages) {
        this.reachBottom = true;
        this.disabled = true; //禁用上拉加载更多
      }else{
        this.reachBottom = false;
      }

      if (res.code != 10000) {
        return
      }
      let rows = res.data.content
      if (rows) {
        for (let value of rows) {
          value.expArrorDisp = Utils.formatCurrency(value.expArrorDisp)
          value.rewardInterest = value.rewardInterest ? Utils.formatCurrency(value.rewardInterest) : value.rewardInterest
          value.investMin = Utils.formatCurrency(value.investMin)
          value.percent = Math.round(value.percent)
          value.remainMoneys = Utils.formatCurrency(value.remainMoney)
        }
      }
      this.pageNo++;
      this.items = pageNo?rows:this.items.concat(rows)
    },
    toProductDeatils(productOid,state){
      if(state == 'RAISING') {
        this.$router.push({
          name:"productTn",
          query:{
            productId:productOid,
            state
          }
        })
      } else {
        this.invest(productOid,state)
      }
      
    },
    async invest(productOid,state) {
      let res = await Http.post({
        url: Api.my.checkInvest,
        data: {
          productId: productOid
        }
      })
      if(res.code==10000) {
        if(res.data.hasInvest) {
          this.$router.push({
            name:"productTn",
            query:{
              productId:productOid,
              state
            }
          })
        } else {
          Tips.alert('产品详情仅对本产品投资人公开')
        }
      }
    }

  }
};

</script>
<style lang="less" scoped>
@import "../../style/utils.less";
#finance {
  animation: fadeIn 1.6s;
}

.products-item {
  background: #fff;
  margin-bottom: 20*0.013rem;
  padding: 0 30*0.013rem;
}

.tnContent {
  height: 224*0.013rem;
  overflow: hidden;
  border-bottom: 1*0.013rem dashed #c7c7c7;
}

.iconImg {
  width: 40*0.013rem;
  margin-left: 20*0.013rem;
}

.labeTexts {
  color: #d4d4d4;
  border: 0.03rem solid #d4d4d4;
  .font-dpr(24);
  height: 32*0.013rem;
  line-height: 32*0.013rem;
  padding: 0 10*0.013rem;
  border-radius: 200px;
  margin-left: 20*0.013rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.newlabeText {
  color: #9c4cd1;
  border: 0.03rem solid #9c4cd1;
  .font-dpr(24);
  height: 32*0.013rem;
  line-height: 32*0.013rem;
  padding: 0 10*0.013rem;
  border-radius: 200px;
  margin-left: 20*0.013rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.labeText {
  color: #ed7d2b;
  border: 0.03rem solid #ed7d2b;
  .font-dpr(24);
  height: 32*0.013rem;
  line-height: 32*0.013rem;
  padding: 0 10*0.013rem;
  border-radius: 200px;
  margin-left: 20*0.013rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.productname {
  display: flex;
  align-items: center;
  margin-top: 20*0.013rem;
}

.name {
  font-size: 32*0.013rem;
  color: #3b3b3b;
}

.productContent {
  display: flex;
  flex-direction: row;
  text-align: left;
}

.bfb {
  font-size: 40*0.013rem;
  color: #e45038;
}

.datas {
  font-size: 40*0.013rem;
  color: #3b3b3b;
}

.add {
  font-size: 28*0.013rem;
}

.ys {
  color: #a6a6a6;
  font-size: 24*0.013rem;
}

.shouyi {
  margin: 20*0.013rem 0 15*0.013rem;
}

.cir {
  width: 134*0.013rem;
  height: 134*0.013rem;
}

.shouqin {
  width: 134*0.013rem;
  height: 134*0.013rem;
}

.content1 {
  flex: 1;
}

.shouyi,
.shouyis {
  display: flex;
}

.syl {
  flex: 1.2;
}

.tz {
  flex: 1;
}

.content2 {
  position: relative;
}

.cc {
  width: 134*0.013rem;
  height: 134*0.013rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index:99;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e45038;
  font-size: 40*0.013rem;
}

.bf {
  font-size: 24*0.013rem;
}

.tnFooter {
  height: 68*0.013rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.loading-tip {
  width: 100%;
  height: 80*0.013rem;
  line-height: 80*0.013rem;
  text-align: center;
  color: #ccc;
}

.greys {
  color: #a6a6a6;
}

.demo-pull-refresh {
  p {
    margin: 10px 0 0 15px;
  }
}

</style>
