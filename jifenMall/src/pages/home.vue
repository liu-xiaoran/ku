<template>
<div class="home">
  <div class="wenhao" v-if="wenhaoLink" @click="goWenhao">
    <div class="mark">?</div>
		<span>获得积分</span>
  </div>
  <Banner :bannerRow="bannerRow" />
  <div class="centWarp">
    <div class="cent">
      <div class="centCon">
        <div class="centConTop" style="color:#e45038">{{userPoint.point||0}}</div>
        <div class="centConBot">当前积分</div>
      </div>
      <div class="centCon">
        <div class="centConTop">{{userPoint.totalPoint||0}}</div>
        <div class="centConBot">累计积分</div>
      </div>
      <div class="centCon">
        <div class="centConTop">{{userPoint.usedPoint||0}}</div>
        <div class="centConBot">已使用积分</div>
      </div>
    </div>
  </div>

  <div class="productRow">
    <div class="productRowTop">
      <div class="productRowTopLeft">积分兑换</div>
      <router-link to="record" class="productRowTopRig">兑换记录<img src="../assets/images/icon_hongse.png"></router-link>
    </div>
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400" class="productlist">
      <div v-for="(item,index) in items" :key="index"  class="products">
          <Product :item="item" :point="point" v-on:reload="reload" v-on:prompt="promptshow" v-on:spin="spinSure" />
      </div>
    </div>
    <div class="weui-loadmore" v-if="!reachBottom">
      <div class="weui-loading"></div>
      <div class="weui-loadmore__tips">正在加载</div>
    </div>
    <!--触底提示-->
    <div class="weui-loadmore weui-loadmore_dot" v-if="items&&items.length>4&& reachBottom">
      <div class="weui-loadmore__tips">我是有底线的~</div>
    </div>
    <div class="empty-placeholder" v-if="(!items||(items&&items.length<=0))">
      <span>暂无数据...</span>
    </div>
  </div>

  <div class="prompt" v-show="show">
    {{prompt}}
  </div>
  <div class="spin"><Spinner :size="size" bgcolor="#000" forecolor="transparent" v-show="spin" /></div>
</div>
</template>
<script>
import { Waterfall } from 'vant';
import Banner from '../components/home/banner'
import Product from '../components/home/product'
import { Spinner } from '../components/Spinner'
import router from "../router";
export default {
  name:'home',
  directives:{
    WaterfallLower: Waterfall('lower')
  },
  components: {
    Banner,
    Product,
    Spinner
  },
  data () {
    return {
      bannerRow:"",
      productRow:"",
      items:[],
      disabled: false,
      pageNo: 1,
      pageSize:10,
      reachBottom: false,
      spin:true,
      size: lib.flexible.dpr*20,
      prompt:"",
      show:false,
      userPoint:"",
      point:0,
      wenhaoLink:""
    }
  },
  methods: {
    goWenhao(){
      location.href = this.wenhaoLink
    },
    reload(){
      console.log("ok2")
      this.spin = true;
      this.items = "";
      this.getDate(1)
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
    spinSure(val){
      this.spin = val
    },
    loadMore(){
      this.disabled = true;
      this.getDate()
    },
    async getDate(pageNo){
      if(pageNo) this.pageNo = pageNo
      let data = {
        pageInfo:{
          pageNo: this.pageNo,
          pageSize: this.pageSize
        },
        extendInfo: ["UserPoint","WebLabel"],
        "_extendInfo_webLabel_key": "jifenHelp"
      }
      this.$http.post('/actives1/point/index',ZYLIB.req({data:data})).then((responese)=>{
        this.spin = false;
        let res = responese.body
        if(res.code == 10000){
          if(res.extendInfo){
            this.userPoint = res.extendInfo.UserPoint || "" ;
            this.point = res.extendInfo.UserPoint.point || 0 ;

            this.wenhaoLink = res.extendInfo.WebLabel.jifenHelp.value || "";

          }
          if(res.data.list&&res.data.list.length>0){
            if(this.pageNo >= res.data.pageInfo.totalPage) {
              this.reachBottom = true;
              this.disabled = true; //禁用上拉加载更多
            } else {
              this.reachBottom = false;
              this.disabled = false; //禁用上拉加载更多
            }
          }else{
              this.reachBottom = true;
              this.disabled = true; //禁用上拉加载更多
          }
            this.pageNo++;
            this.items = (pageNo==undefined)?this.items.concat(res.data.list):res.data.list;
        }else if(res.code == 10001){
          this.reachBottom = true;
          ZYLIB.ZYInteractive.postMessage({ 'key': "login"},'请登录后再来~')
        }else{
          this.promptshow(res.message)
        }
      })
    }
  },
  // created () {
  //   // this.getDate(1)
  // }
}
</script>
<style lang="scss" scoped>
@import "../style/utils.scss";
.home{
  width: 10rem;
  margin: 0 auto;
}
.centWarp{
  width: 100%;
  background: #ffffff;
  border-bottom: .253333rem /* 19/75 */ solid #f0f0f0;
}
.cent{
  width: 10rem;
  margin: 0 auto;
  height: 1.786667rem /* 134/75 */;
  overflow: hidden;
}
.centCon{
  margin-top: .413333rem /* 31/75 */;
  width: 3.28rem /* 249/75 */;
  border-right: 1px solid #dfdfdf;
  float: left;
  text-align: center;
  @include font-dpr(12px);
  color: #3b3b3b;
}
.centCon:last-child{
  border: none;
}
.centConTop{
  height: .426667rem /* 32/75 */;
  line-height: .426667rem /* 32/75 */;
  @include font-dpr(15px);
}
.centConBot{
  height: .346667rem /* 26/75 */;
  line-height: .346667rem /* 26/75 */;
  margin-top: .186667rem /* 14/75 */;
}
.productRowTop{
  width: 100%;
  height: 1.053333rem /* 79/75 */;
  overflow: hidden;
  border-bottom:1px solid #dfdfdf;
  .productRowTopLeft{
    margin-left: .32rem /* 24/75 */;
    line-height: 1.066667rem /* 80/75 */;
    @include font-dpr(13px);
    color: #3b3b3b;
    float: left;
  }
  .productRowTopRig{
    margin-right: .346667rem /* 26/75 */;
    line-height: 1.066667rem /* 80/75 */;
    color: #3b3b3b;
    @include font-dpr(12px);
    float: right;
    img{
      display: inline-block;
      width: .12rem /* 9/75 */;
      height: .2rem /* 15/75 */;
      margin-left: .066667rem /* 5/75 */;
    }
  }
}
.productlist{
  font-size: 0;
}
.products{
  width: 50%;
  box-sizing: border-box;
  display: inline-block;
  border-bottom: 1px solid #dfdfdf;
  border-right: 1px solid #dfdfdf;
  height: 6.053333rem /* 454/75 */;
  overflow: hidden;
}
.products:nth-child(2n){
  border-right:1px solid #ffffff;
}
.wenhao{
  position: absolute;
  top:.2rem /* 15/75 */;
  right:.2rem /* 15/75 */;
  color: #ffffff;
  @include font-dpr(12px);
}
.mark {
  display: inline-block;
  background: #fff;
  color: #583fc0;
  width: 0.4rem;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  border-radius: 200px;
}
.weui-loadmore__tips{
   @include font-dpr(13px);
}
</style>
