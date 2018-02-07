<template>
  <div class="warp">
    <div class="actBox">
      <guagua ref="dl" :timeNum='timeNum' :isLogin='isLogin'></guagua>
    </div>
    <div class="awardNum">你还有<span class="num">{{times>=0?times:'无限次'}}</span>次刮奖机会 &nbsp| &nbsp<span @click='moreTime' class="moreTime">再刮一次</span></div>
  </div>
</template>
<script>
import guagua from './GuaGua'

export default {
  name:'actBox',
  props:['times','isLogin'],
  data () {
    return {
      timeNum:1,
    }
  },
  methods: {
    moreTime(){
      this.timeNum = this.times;
      if(this.timeNum==0){
        return
      }
      this.$refs.dl.initCanvas();
    }
  },
  components: {
    guagua
  },
  mounted () {
    global.vue.$on('timeNum',()=>{
      this.timeNum = 0
    })
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
.warp{
  height:4.946667rem /* 371/75 */;
  margin-top: .186667rem /* 14/75 */;
  overflow: hidden;
}
.actBox{
  width:7.36rem /* 552/75 */;
  height: 2.666667rem /* 200/75 */;
  margin:.626667rem /* 47/75 */ auto 0;
}
.awardNum{
  font-family: '黑体';
  @include font-dpr(13px);
  letter-spacing:.026667rem /* 2/75 */;
  margin-top:.666667rem /* 50/75 */;
  height: 1rem /* 75/75 */;
  line-height: 1rem;
  text-align: center;
  color: #ffffff;
  .moreTime{
    font-weight: bold;
  }
  .num{
    @include font-dpr(15px);
    color: #e74c4a;
  }
}
</style>

