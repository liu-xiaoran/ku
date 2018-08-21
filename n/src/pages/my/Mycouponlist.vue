<template>
	<div class="mycouponlist">
		<div class="weui-tab weui-navbars">
			<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__items',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
				<div class="weui-navbar__title">{{item}}</div>
			</v-touch>
		</div>
		<Couponlist1 type="NOTUSED" ref="edit0" v-show="activeIndex == 0"></Couponlist1>
		<Couponlist2 type="USED" ref="edit1" v-show="activeIndex == 1"></Couponlist2>
		<Couponlist3 type="EXPIRED" ref="edit2" v-show="activeIndex == 2"></Couponlist3>
		<div :class="['zan-dialog',showDialog ? 'zan-dialog--show' : '']" @touchmove.prevent v-show="activeIndex == 0">
			<div :class="['zan-dialog__mask',open ? 'weui-animate-fade-in' : 'weui-animate-fade-out']">
				<div :animation="animationData" class="zan-dialog__container">
					<div class="redCouponBox">
						<span>恭喜 , 红包已放入您的账户余额 !</span>
						<v-touch class="btns" @tap="showRedCouponBox">确定</v-touch>
					</div>
				</div>
			</div>
		</div>
		<logBase></logBase>
	</div>
</template>

<script>
	import Couponlist from '../../components/My/Couponlist';
	import logBase from '../logBase';
	let tab0 = '可使用(0)';
	let tab1 = '已使用(0)';
	let tab2 = '已过期(0)';
	export default {
		name: 'Mycouponlist',
		components: {
			Couponlist1: Couponlist,
			Couponlist2: Couponlist,
			Couponlist3: Couponlist,
			logBase
		},
		data() {
			return {
				showDialog: false,
				open: false,
				animationData: {
					duration: 200,
					timingFunction: 'ease'
				},
				tabs: ['可使用(0)', '已使用(0)', '已过期(0)'],
				activeIndex: 0
			}
		},
		methods: {
			showRedCouponBox() {
				this.toggleDialog()
				this.updated()
			},
			toggleDialog() {
				this.open = !this.open
				if(this.showDialog) {
					let time = setTimeout(() => {
						this.showDialog = !this.showDialog
						clearTimeout(time)
					}, 500);
				} else {
					this.showDialog = !this.showDialog
				}
			},
			tabClick(id) {
				this.activeIndex = id
			},
			showTips(data) {
				if(data.notUsed) {
					tab0 = `可使用(${data.notUsed})`
				} else if(data.used) {
					tab1 = `已使用(${data.used})`
				} else if(data.expired) {
					tab2 = `已过期(${data.expired})`
				}
				this.tabs = [tab0, tab1, tab2]
			},
			updated() {
				this.$refs.edit0.creates();
				this.$refs.edit1.creates();
			}
		},
		created() {
			global.vue.$on('changeOverd', () => {
				this.toggleDialog()
			})
		},
		mounted() {
			this.updated();
			this.$refs.edit2.creates();
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	@import "../../style/widget/weui-animate/weui-animate.less";
	.mycouponlist {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.weui-navbars {
		display: flex;
		width: 100%;
		height: 6%;
		background: #fff;
	}
	
	.weui-navbar__items {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.weui-navbar__title {
		flex: 1;
		text-align: center;
		.font-dpr(28);
		color: #3b3b3b;
	}
	
	.weui-navbars .weui-navbar__items:nth-child(2) .weui-navbar__title {
		border-left: 0.02rem solid #dfdfdf;
		border-right: 0.02rem solid #dfdfdf;
		box-sizing: border-box;
	}
	
	.weui-bar__item_on .weui-navbar__title {
		color: #e45038;
	}
	
	.weui-tab__panel {
		margin-top: 1.46rem;
		padding: 0 0.34rem;
	}
	
	.redCouponBox {
		width: 80%;
		height: 3.68rem;
		background: #fff;
		border-radius: 0.1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #3a3a3a;
		.font-dpr(30);
	}
	
	.btns {
		width: 40%;
		height: 0.96rem;
		line-height: 0.96rem;
		border-radius: 0.1rem;
		background: #e45038;
		color: #fff;
		text-align: center;
		margin-top: 0.53rem;
	}
	
	.zan-dialog {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		display: none;
		&.zan-dialog--show {
			display: block;
		}
	}
	
	.zan-dialog__mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		background: rgba(0, 0, 0, 0.4);
	}
	
	.zan-dialog__container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.zan-dialog--show .display__none {
		display: block;
	}
</style>