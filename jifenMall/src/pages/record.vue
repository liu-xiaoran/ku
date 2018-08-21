<template>
<div class="recordBox">
<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="40">

  <div class="dataArr" v-for="(value,key) in dataObj" :key="key">
    <div class="timeBox">
      <div v-text="timeFet(key)"></div>
    </div>
    <div class="record">
    <div class="recordCon" v-for="(item,index) in value" :key="index">
        <div class="recordConTil">{{item.title}}</div>
        <div class="recordConTime" v-text="formatTimestamp({time:item.createTime,showtime:false})"></div>
    </div>
    </div>
  </div>
</div>
<div class="weui-loadmore" v-if="!reachBottom">
  <div class="weui-loading"></div>
  <div class="weui-loadmore__tips">正在加载</div>
</div>
<!--触底提示-->
<div class="weui-loadmore weui-loadmore_dot" v-if="dataObj&&Object.keys(this.dataObj).length>0 && reachBottom">
  <div class="weui-loadmore__tips">已经全部加载完毕</div>
</div>
<div class="empty-placeholder row-center" v-if="!dataObj||(dataObj&&Object.keys(this.dataObj).length<=0)">
  <span>暂无数据...</span>
</div>

<div class="prompt" v-show="show">
  {{prompt}}
</div>
<div class="spin"><Spinner :size="size" bgcolor="#000" forecolor="transparent" v-show="spin" /></div>
</div>
</template>
<script>
import { Waterfall } from "vant";
import router from "../router";
import { Spinner } from '../components/Spinner'
export default {
  name: "record",
  directives: {
    WaterfallLower: Waterfall("lower")
  },
  components: {
    Spinner,
    Waterfall
  },
  data() {
    return {
      pageInfo: {
        //分页数据
        pageNo: 1,
        pageSize: 10
      },
      disabled: false, //下拉锁定
      reachBottom: false, //触底时修改
      dataObj: {},
      spin:true,
      size: lib.flexible.dpr*20,
      prompt:"",
      show:false,
    };
  },
  methods: {
    loadMore() {
      //上拉加载后的函数
      this.disabled = true;
      this.getRecord();
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
    formatTimestamp(param) {
      var d = new Date();
      // d.setTime(param && param.time || d);
      var timeNum=param && param.time || d.getTime();
      timeNum=parseInt(timeNum);
      if(d.getTimezoneOffset()!=null)
      timeNum=timeNum+d.getTimezoneOffset()*60000+480*60000
      d.setTime(timeNum);
      var datetime = null;
      var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
      var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

      if (!param.showtime) {
          datetime = x + y;
      } else {
          datetime = x;
      }
      return datetime;
    },
    async getRecord(pageNo) {
      if (pageNo) this.pageInfo.pageNo = pageNo;
      let data = {
        pageInfo:this.pageInfo
      }
      this.$http.post("/actives1/point/myRecords",ZYLIB.req({data:data})).then((responese)=>{
        this.spin = false;
        let res = responese.body

        if(res.code == 10000){
          let datass = res.data.list;
          if (pageNo) this.dataObj = {};
          if (datass && datass.length > 0) {
            this.clusterDate(datass);
          } else {
            this.disabled = true; //禁用上拉加载更多
            this.reachBottom = true;
            return false
          }
          this.disabled = false; //恢复上拉
          if (this.pageInfo.pageNo >= res.data.pageInfo.totalPage) {
            this.reachBottom = true;
            this.disabled = true; //禁用上拉加载更多
          }
          this.pageInfo.pageNo++;
        }else{
          this.promptshow(res.message)
        }

      })

    },
    clusterDate(data) {
      let datas = JSON.parse(JSON.stringify(this.dataObj));
      for (let i in data) {
        let time = new Date(data[i].createTime-0);
        let yeas = time.getFullYear(),
          month = time.getMonth()+1;
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
  },
  created() {
    this.getRecord(1);
  },
};
</script>
<style lang="scss" scoped>
@import "../style/utils.scss";
.recordBox {
  width: 100%;
  overflow: hidden;
  letter-spacing: 1px;
  border-top: 1px solid #dfdfdf;
  background: #ffffff;
}
.timeBox {
  height:1.066667rem /* 80/75 */;
  background: #f0f0f0;
  color: #ababab;
  @include font-dpr(13px);
  line-height:1.066667rem /* 80/75 */;
  div{
    width: 10rem;
    padding-left:.333333rem /* 25/75 */;
  }
}
.record{
  width: 10rem;
  margin-left:.333333rem /* 25/75 */;
  .recordCon{
    border-top: 1px solid #dfdfdf;
    height: 1.76rem /* 132/75 */;
  }
  .recordCon:first-child{
    border-top: none;
  }
  .recordConTil{
    height: .8rem /* 60/75 */;
    padding-top: .16rem /* 12/75 */;
    line-height: .8rem /* 60/75 */;
    @include font-dpr(13px);
    color: #3b3b3b;
  }
  .recordConTime{
    height: .533333rem /* 40/75 */;
    line-height: .533333rem /* 40/75 */;
    @include font-dpr(10px);
    color: #a6a6a6;
  }
}
</style>

