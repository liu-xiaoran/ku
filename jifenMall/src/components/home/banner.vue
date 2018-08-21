<template>
<!-- banner已经支持调用后台和轮播，暂时写死为背景图 -->
  <div class="banner homeBanner">
    <van-swipe :autoplay="3000" v-if="bannerRow&&bannerRow.length>0">
			<van-swipe-item v-for="(list, index) in bannerRow" :key="index" class="swiper-slide">
				<a :href=list.linkUrl :style="[bannerImg,{backgroundImage:`url(${list.imageUrl})`}]"></a>
			</van-swipe-item>
		</van-swipe>
  </div>
</template>
<script>
import { Swipe, SwipeItem} from 'vant';
import Vue from 'vue'
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
export default {
  name:'Banner',
  props: ['bannerRow'],
  data () {
    return {
      bannerImg: {
        display:'block',
        width: '100%',
        height: '100%',
        backgroundSize:'cover',
        backgroundPosition:"center"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
@import '../../style/vant-css/swipe.scss';
.van-swipe{ width:100%;height:100%}
.homeBanner {
  width:10rem;
  height:auto;
  min-height: 3rem /* 225/75 */;
  //默认的banner背景图
  // background: url(../../assets/images/default_banner.png) no-repeat;
  // 写死的图片
  background: url(../../assets/images/banner.png) no-repeat;
  background-size: 100% 100%;
  overflow:hidden;
}

.swiper-slide {
  width:100%;
  height:100%;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
}

</style>

