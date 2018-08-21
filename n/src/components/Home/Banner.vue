<template>
	<div class="banner homeBanner">
		<!-- <swiper :options="swiperOption" ref="mySwiper" v-if="bannerRow&&bannerRow.length>0">
			<swiper-slide v-for="(list,index) in bannerRow" key="index">
				<a :href=list.linkUrl><img :src="list.imageUrl" /></a>
			</swiper-slide>
			<div class="swiper-pagination" id="swiper-pagination" slot="pagination"></div>
		</swiper> -->
		<van-swipe :autoplay="3000" v-if="bannerRow&&bannerRow.length>0">
			<van-swipe-item v-for="(list, index) in bannerRow" :key="index" class="swiper-slide">
				<a :href=list.linkUrl :style="[bannerImg,{backgroundImage:`url(${list.imageUrl})`}]"></a>
			</van-swipe-item>
		</van-swipe>
	</div>
</template>

<script>
	import { Swipe, SwipeItem } from 'vant';
	import Vue from 'vue'
	Vue.component(Swipe.name, Swipe);
	Vue.component(SwipeItem.name, SwipeItem);
	// import 'swiper/dist/css/swiper.css';
	// import { swiper, swiperSlide } from 'vue-awesome-swiper';
	export default {
		name: 'Banner',
		props: ['bannerRow'],
		components: {
			// swiper,
			// swiperSlide
		},
		data() {
			return {
				bannerImg: {
					display:'block',
					width: '100%',
					height: '100%',
					backgroundSize:'cover',
					backgroundPosition:"center"
			    }
				// swiperOption: {
				// 	autoplay: 4000,
				// 	autoplayDisableOnInteraction: false,
				// 	pagination: '.swiper-pagination',
				// 	paginationClickable: true,
				// 	loop: true,
				// 	initialSlide: 1,
				// 	direction:'horizontal'
				// }
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../style/vant-css/swipe.scss';
	.van-swipe{ width:100%;height:100%}
	.homeBanner {
		width: 100%;
		height: 5.17rem;
		background: url(../../images/x/default_banner.png) no-repeat;
		background-size: 100% 100%;
		overflow:hidden
	}
	
	.swiper-slide {
		width: 100%;
		height: 5.17rem;
	}
	
	.swiper-slide img {
		height: 100%;
	}
	
</style>