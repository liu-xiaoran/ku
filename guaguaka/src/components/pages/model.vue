<template>
  <div class="modelrule">
    <div class="conts">
      <h2 class="title">中奖记录</h2>
      <div class="record" id="record">
        <div class="recordCon" v-if="myAwardList">
          <div v-for="(item,index) in myAwardList" :key="index" class="recordCont">
              <div class="recordTop">{{item.awardName}}</div>
              <div class="recordBom">领取时间：{{formatTimestamp({time:item.createTime,showtime:false})}}</div>
          </div>
        </div>
        <div class="recordCont recordNull" v-else>暂无数据</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="close" @click='closeModel'></div>
  </div>
</template>
<script>
var myScroll,loadscript;
export default {
  name:'model',
  props:['myAwardList'],
  data () {
    return {
    }
  },
  methods: {
    closeModel(){
      this.$emit('modelrules')
    },
    loadScript(url, callback) {
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        script.type = "text/javascript";
        script.charset = "utf-8";
        if (script.readyState) {
            script.onreadystatechange = function() {
                if ("loaded" == script.readyState || "complete" == script.readyState) {
                    script.onreadystatechange = null;
                    callback.call(this);
                }
            };
        } else {
            script.onload = function() {
                callback.call(this);
            };
            script.onerror = function() {
                console.log("Script Load Error! Please Refresh!");
            };
        }
        script.src = url;
        head.appendChild(script);
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
    openModal(){
      console.log("点击左键")
      if(loadscript){
          console.log("刷新模态")
          setTimeout(function () {
            myScroll.refresh();
            myScroll.options.snap = true;
          }, 0);

          return
      }
      this.loadScript("static/iscroll-lite.js",function(){
      loadscript=true;
      myScroll = new IScroll('#record', {
          hScrollbar: false,
          vScrollbar: true,
          topOffset: 50,
          snap: true
      })
      })
    }
  },
  mounted(){
    this.openModal()
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
.modelrule{
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .65);
  top:0;
  left: 0;
  overflow: hidden;
  z-index: 1000;
}
.line{
  height: 1.093333rem /* 82/75 */;
  width: 2px;
  margin: 0 auto;
  background: #ffffff;
}
.close{
  width: .866667rem /* 65/75 */;
  height: .866667rem /* 65/75 */;
  background: url("../../assets/images/close.png") center no-repeat;
  background-size:auto 100%;
  margin: 0 auto;
}
//我的获奖记录
.conts{
  width: 8.426667rem /* 632/75 */;
  max-height: 11.146667rem /* 836/75 */;
  background: #ffffff;
  margin:1.44rem /* 108/75 */ auto 0;
  border-radius: .186667rem /* 14/75 */;
  padding-bottom: .56rem /* 42/75 */;
  .title{
    padding-top: .266667rem /* 20/75 */;
    text-align: center;
    height: 1.093333rem /* 82/75 */;
    line-height: 1.093333rem /* 82/75 */;
    @include font-dpr(17px);
    font-weight: bolder;
  }
}
.record{
  width: 7.053333rem /* 529/75 */;
  margin: 0 auto;
  height: 9.2rem /* 690/75 */;
  overflow: hidden;
}
.recordCon{
  min-height: 1.493333rem /* 112/75 */;
}
.recordCont{
  width: 100%;
  height: 1.506667rem /* 113/75 */;
  border-bottom: .02rem /* 1/75 */ solid #c1c1c1;
}
.recordTop{
  font-family: '黑体';
  @include font-dpr(14px);
  padding-top: .146667rem /* 11/75 */;
  height: .68rem /* 51/75 */;
  color: #000;
  line-height: .68rem /* 51/75 */;
}
.recordBom{
  font-family: '黑体';
  @include font-dpr(11px);
  height: .44rem /* 33/75 */;
  color: #282828;
  line-height: .44rem /* 33/75 */;
}
.recordNull{
  color: #666;
  text-align: center;
  line-height: 1.506667rem /* 113/75 */;
}
</style>

