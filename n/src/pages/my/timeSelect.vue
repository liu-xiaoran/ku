<template>
<div class="timeSelect">
  <div class="conTop">
    <v-touch class="onCancel" @tap="onCancel">
      取消
    </v-touch>
    <v-touch class="onConfirm" @tap="onConfirm">
      完成
    </v-touch>
  </div>
  <div class="timeTop">
    <v-touch @tap="clickTimes(0)" class="timeBtn" :style="{color:time?'#4986c5':'#a6a6a6'}">{{startTime}}</v-touch>
    <div class="zhi">至</div>
    <v-touch @tap="clickTimes(1)" class="timeBtn" :style="{color:!time?'#4986c5':'#a6a6a6'}">{{endTime}}</v-touch>
  </div>
  <div class="select" v-show="time">
    <van-datetime-picker
    v-model="currentDate"
    type="date"
    :minDate="minDate"
    :maxDate="maxDate"
    @change="onChange"
    />
  </div>
    <div class="select" v-show="!time">
    <van-datetime-picker
    v-model="currentDate2"
    type="date"
    :minDate="minDate2"
    :maxDate="maxDate2"
    @change="onChange2"
    />
  </div>
</div>
</template>
<script>
import DatetimePicker from '../../components/datetime-picker';
import Vue from "vue";
Vue.component(DatetimePicker.name, DatetimePicker);

import Utils from "../../utils/Utils";
import router from "../../router";
import "vant/lib/vant-css/base.css";
export default {
  name: "timeSelect",
  data() {
    return {
      minDate: new Date(2017, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      startTime: "",
      endTime: "结束日期",
      time: true,
      minDate2: new Date(2017,0,1),
      maxDate2: new Date(),
      currentDate2:"",
    };
  },
  methods: {
    onChange(e) {
        this.startTime =
          e.getColumnValue(0) +
          "-" +
          e.getColumnValue(1) +
          "-" +
          e.getColumnValue(2);
      },
    onChange2(e){
      this.endTime =
          e.getColumnValue(0) +
          "-" +
          e.getColumnValue(1) +
          "-" +
          e.getColumnValue(2);
    },
    onCancel() {
      router.replace({
        name:"depositRecord"
      })
    },
    onConfirm(e) {
      router.replace({
        name:"depositRecord",
        query:{
          startTime:this.startTime,
          endTime:this.endTime=="结束日期"?"":this.endTime
        }
      })
    },
    clickTimes(id) {
      if (id) {
        //点击结束时间
        this.time = false;
        if(new Date(this.startTime).getTime()>new Date(this.endTime).getTime()){
          this.endTime = this.startTime
        }
        this.minDate2 = new Date(this.startTime)
        if (this.endTime == "结束日期") {
          this.endTime = this.startTime;
          this.currentDate2 = new Date(this.endTime);
        } else {
          this.currentDate2 = new Date(this.endTime);
        }
      }else{
        //点击开始时间
        this.time = true;
        if (this.endTime != "结束日期") {
          this.maxDate = new Date(this.endTime)
        }
        this.currentDate = new Date(this.startTime);
      }
    },
    removeTouch(e){
      e.preventDefault()
    }
  },
  created () {
    let startTime = this.$route.query.startTime;
    let endTime = this.$route.query.endTime;
    if(startTime){
      console.log(startTime)
      this.startTime = startTime;
      this.currentDate = new Date(this.startTime);
    }
    if(endTime){
      console.log(endTime)
      this.endTime = endTime;
      this.currentDate2 = new Date(this.endTime)
    }else{
      this.endTime = "结束日期";
    }
    //添加监听去除move事件
    document.addEventListener("touchmove",this.removeTouch)
  },
  beforeDestroy () {
    document.removeEventListener("touchmove",this.removeTouch)
  }
};
</script>
<style lang="scss">
@import "../../style/vant-css/picker.scss";
</style>
<style lang="less" scoped>
@import "../../style/utils.less";
.timeSelect {
  height: 100%;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
}
.select {
  width: 80%;
  margin: 0 auto;
}
.timeTop {
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.timeBtn {
  width: 4.16rem;
  border-bottom: 0.013333rem solid #4986c5;
  height: 0.8rem;
  text-align: center;
  line-height: 0.8rem;
  .font-dpr(32);
}
.zhi {
  color: #3b3b3b;
  .font-dpr(32);
}
.conTop {
  height: 1.066667rem;
  color: #e45038;
  .font-dpr(26);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 1.066667rem;
  letter-spacing: 0.026667rem;
}
.onConfirm,
.onCancel {
  width: 1.6rem;
  text-align: center;
}
</style>
