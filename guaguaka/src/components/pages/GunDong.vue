<template>
  <div class="gun">
    <div class='cont marquee'>
      <transition name="fade">
        <ul class="content" v-show="winerList.length>0">
          <li v-for="(item,index) in winerList" :key="index" class="content-li">
            恭喜{{item.phone}}获得{{item.awardName}}
          </li>
        </ul>
      </transition>
      <div class="contentNull" v-if="winerList.length!=''&&winerList.length==0">
        暂无数据
      </div>
      <ul class="contents" style="display:none">
        <li v-for="(item,index) in winerList" :key="index" class="content-li">
          恭喜{{item.phone}}获得{{item.awardName}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "gun",
  props: ["winerList"],
  data() {
    return {
      show:true
    };
  },
  methods: {
    gundong() {
      //下方滚动事件
      var speed = 30 * lib.flexible.dpr * lib.flexible.dpr; // 速度 -- px每秒
      var $marquee = document.querySelector(".marquee");
      var $marqueeContent = $marquee.querySelector(".content");
      var $marqueeContents = $marquee.querySelector(".contents");
      // 内容复制3份好有连续性
      $marqueeContent.innerHTML = $marqueeContents.innerHTML + $marqueeContents.innerHTML + $marqueeContents.innerHTML;


      var contentWidth = $marqueeContent.getBoundingClientRect().width;
      if (contentWidth <= 0) {
        return;
      }
      // 内容复制了3份，宽度也要除以3
      contentWidth = contentWidth / 3;
      // 计算一次动画应该要花费多少时间
      var onceTime = contentWidth / speed; //s
      $marqueeContent.style.animationDuration = onceTime + "s";
      $marqueeContent.setAttribute(
        "style",
        `
          animation: kf-marque-animation ${onceTime}s infinite linear;
          -webkit-animation: kf-marque-animation ${onceTime}s infinite linear;
        `
      );
    }
  },
  beforeUpdate() {
  },
  updated() {
    this.winerList.length && this.gundong();
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
.gun {
  height: 0.773333rem;
  width: 6.8rem;
  margin: 0.106667rem auto;
  border-radius: 0.24rem;
  overflow: hidden;
}
.cont {
  font-family: "黑体";
  @include font-dpr(14px);
  color: #ffff64;
  height: 0.773333rem;
  line-height: 0.8rem;
  letter-spacing: 0.026667rem;
  white-space: nowrap;
  text-overflow: clip;
  .content-li {
    display: inline-block;
    height: 0.773333rem;
    margin-right: 2rem;
  }
}
// 滚动动画
@keyframes kf-marque-animation {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-33.33%);
  }
}
.marquee {
  position: relative;
}
.marquee .content {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
}
.contentNull {
  font-family: "黑体";
  @include font-dpr(14px);
  color: #ffff64;
  height: 0.773333rem;
  line-height: 0.8rem;
  letter-spacing: 0.026667rem;
  text-align: center;
}
</style>

