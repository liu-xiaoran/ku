<template>
	<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
		<div class="home">
			<Banner :bannerRow="bannerRow" />
			<div class="content">
				<img class="banners" src="../../images/xx/zhucebeijing.png" />
				<div class="banners contentCon">
					<div class="textBox" v-show="!userinfo">
						<span class="text1">688元新人红包</span>
						<span class="text2">注册立即领取</span>
					</div>
					<div class="textBox" v-show="userinfo">
						<span class="text1">每日签到领红包</span>
						<span class="text2">累计签到有惊喜</span>
					</div>
					<v-touch class="qiandaoBtn" @tap="toNextPage">
						<img v-show="!userinfo" class="banners" src="../../images/xx/zhuce.png" />
						<img v-show="userinfo" class="banners" src="../../images/xx/qiandao.png" />
					</v-touch>
				</div>
			</div>
			<Homelist :productRow="productRow" />
		</div>
		<logBase />
	</van-pull-refresh>
</template>

<script>
	import { PullRefresh } from 'vant';
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Banner from '../../components/Home/Banner';
	import Homelist from '../../components/Home/Homelist';
	import logBase from '../logBase';
	import wepy from '../../utils/wepy';
	export default {
		name: 'Home',
		components: {
			Banner,
			Homelist,
			logBase
		},
		watch: {
			isLoading() {
				if(this.isLoading) {
					this.onRefresh()
				}
			}
		},
		data() {
			return {
				isLoading: false,
				headHeight: lib.flexible.rem2px(1.3),
				bannerRow: '',
				productRow: '',
				userinfo: false
			}
		},
		methods: {
			toNextPage() {
				if(!wepy.$instance.globalData['userinfo']) {
					this.$router.push({path:'/register'});
				} else {
					this.$router.push({path:'/sign'});
				}
			},
			onRefresh() {
				this.userinfo = wepy.$instance.globalData['userinfo']
				this.onHome()
			},
			async onHome() {
				let res = await Http.post({
					url: Api.home,
					data: {
						getBanner: true,
						getProductList: true
					},
					extendInfo: ['UserBasicInfo']
				})
				if(res.code != 10000) {
					return
				}
				this.isLoading = false
				let rows = res.data.product.rows
				if(rows) {
					for(let value of rows) {
						value.expArrorDisp = Utils.formatCurrency(value.expArrorDisp)
						value.rewardInterest = value.rewardInterest ? Utils.formatCurrency(value.rewardInterest) : value.rewardInterest
						value.investMin = Utils.formatCurrency(value.investMin)
					}
				}
				this.bannerRow = res.data.banner.rows
				this.productRow = rows
			}
		},
		created() {
			this.userinfo = wepy.$instance.globalData['userinfo']
			this.onHome()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.home {
		position: relative;
	}
	.content {
		width: 94%;
		height: 2.34rem;
		padding: 0 3%;
		
		transform:translate3d(0px, -0.25rem, 0px)
	}
	
	.banners {
		width: 100%;
		height: 100%;
	}
	
	.contentCon {
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.textBox {
		display: flex;
		flex-direction: column;
		margin-left: 0.8rem;
	}
	
	.text1 {
		color: #e84a30;
		.font-dpr(36);
		font-weight: 600;
	}
	
	.text2 {
		color: #3b3b3b;
		.font-dpr(30);
	}
	
	.qiandaoBtn {
		width: 2.02rem;
		height: 1.58rem;
		margin-right: 1.14rem;
	}
	
	.van-pull-refresh {
		height: 100%;
	}
</style>
