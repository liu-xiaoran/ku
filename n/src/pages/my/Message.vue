<template>
	<div class="message">
		<div class="weui-navbar">
			<v-touch class="weui-tabs">
				<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__item',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
					<div class="weui-navbar__title" style="overflow:auto">{{item}}</div>
				</v-touch>
				<div class="weui-navbar__slider" id="lineMove" style="left: 0"></div>
			</v-touch>
			<div class="fenlei">
				<v-touch v-show="activeIndex == 0" @tap="changeModel" class="flImg iconfont icon-fenlei"></v-touch>
			</div>
		</div>
		<div class="letters" v-show="activeIndex == 0">
			<Letter :animate="animate" />
		</div>
		<div class="notices" v-show="activeIndex == 1">
			<Notice ref="nots" />
		</div>
	</div>
</template>

<script>
	import Utils from '../../utils/Utils';
	import Letter from '../../components/My/Letter';
	import Notice from '../../components/My/Notice';
	export default {
		name: 'Message',
		components: {
			Letter,
			Notice
		},
		data() {
			return {
				animate: '',
				tabs: ['消息', '公告'],
				activeIndex: 0
			}
		},
		methods: {
			tabClick(id) {
				if(this.animate == 'scaled') {
					this.animate = ''
				}
				if(id == 1) {
					this.$refs.nots.onRefreshs();
				}
				document.getElementById("lineMove").style.transform = `translateX(${Utils.Fmul(id,100)}%)`;
				document.getElementById("lineMove").style.webkitTransform = `translateX(${Utils.Fmul(id,100)}%)`;
				this.activeIndex = id
			},
			changeModels() {
				if(this.animate == 'scaled') {
					this.animate = 'enlarges'
				}
			},
			changeModel() {
				if(!this.animate || this.animate == 'enlarges') {
					this.animate = 'scaled'
				} else {
					this.animate = 'enlarges'
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.message {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.weui-navbar {
		position: relative !important;
		height: 6.5%;
	}
	
	.weui-tabs {
		flex: 1;
		display: flex;
		position: relative;
	}
	
	.fenlei {
		width: 1.08rem;
		height: 0.93rem;
	}
	
	.letters,
	.notices {
		width: 100%;
		height: 93.5%;
		overflow-y: auto;
	}
	
	.weui-navbar__title {
		line-height: 0.5rem;
		.font-dpr(28);
	}
	
	.weui-navbar__item {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.flImg {
		width: 0.44rem;
		height: 0.4rem;
		padding: 0.36rem 0.34rem 0.36rem 0.29rem;
		display: block;
		line-height: 0.4rem;
		color: #7e7e7e;
		.font-dpr(36);
	}
	
	.weui-navbar__slider {
		bottom: 0.01rem;
	}
</style>