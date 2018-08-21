<template>
	<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
		<div class="my">
			<Myheader v-on:changeShow="changeShow" :message="message" :userinfo="userinfo" :isEyes="isEyes" />
			<Mycontent :product="product" :tabs="tabs" :list="list" :isEyes="isEyes" />
		</div>
		<logBase></logBase>
	</van-pull-refresh>
</template>

<script>
	import Vue from 'vue'
	import { PullRefresh } from 'vant';
	Vue.component(PullRefresh.name, PullRefresh);
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import wepy from '../../utils/wepy';
	import Myheader from '../../components/My/Myheader';
	import Mycontent from '../../components/My/Mycontent';
	import logBase from '../logBase';
	export default {
		name: 'My',
		components: {
			Myheader,
			Mycontent,
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
				tabs: [{
					name: '提现',
					url: 'withdrawals'
				}, {}, {
					name: '充值',
					url: 'recharge'
				}],
				product: [{
					icon: '天',
					color: 'red',
					url: '/mycurrent',
					money: '0.00'
				}, {
					icon: '定',
					color: 'blue',
					url: '/myregular',
					money: '0.00'
				}],
				list: [{
					icon: require('../../images/x/youhuijuan.png'),
					name: '优惠券',
					url: '/mycouponlist',
					num: 0
				}, {
					icon: require('../../images/x/touzijingxi.png'),
					name: '投资惊喜',
					url: '/mysurprised',
					num: 0
				}, {
					icon: require('../../images/x/jilu.png'),
					name: '资金记录',
					url: '/depositRecord'
				}, {
					icon: require('../../images/x/icon_bangzhu.png'),
					name: '帮助中心',
					url: '/help'
				}, {
					icon: require('../../images/x/shezhi.png'),
					name: '设置',
					url: '/setting'
				}],
				message: '',
				isEyes: false,
				userinfo: false
			}
		},
		methods: {
			changeShow() {
				if(wepy.getStorageSync('isEye') == 'true' || eval(wepy.getStorageSync('isEye'))) {
					wepy.removeStorage({
						key: 'isEye'
					})
					this.isEyes = false
				} else {
					wepy.setStorage({
						key: 'isEye',
						data: true
					})
					this.isEyes = true
				}
			},
			onRefresh() {
				this.myDatas()
			},
			async myDatas() {
				let res = await Http.post({
					url: Api.my.myAsset,
					data: {},
					extendInfo: ['NewLetter','UserBasicInfo']
				})
				this.isLoading = false
				if(res.code == 10000) {
					let datas = res.data
					datas.totalAsset = Utils.formatCurrency(datas.totalAsset)
					datas.cashBalances = Utils.formatCurrency(datas.cashBalance)
					datas.frozenBalances = Utils.formatCurrency(datas.frozenBalance)
					datas.accumulativeIncome = Utils.formatCurrency(datas.accumulativeIncome)
					datas.currentAssets = Utils.formatCurrency(datas.currentAsset)
					datas.regularAssets = Utils.formatCurrency(datas.regularAsset)
					this.message = {
						totalAsset: datas.totalAsset,
						cashBalance: datas.cashBalances,
						frozenBalance: datas.frozenBalances,
						accumulativeIncome: datas.accumulativeIncome,
						newLetter: res.extendInfo?res.extendInfo.NewLetter||0:0
					}
					this.product[0].money = datas.currentAssets
					this.product[1].money = datas.regularAssets
					this.list[0].num = datas.availableRedenvelope
					this.list[1].num = res.extendInfo?res.extendInfo.UserBasicInfo?res.extendInfo.UserBasicInfo.rewardNum||0:0:0
				} else {
					this.product[0].money = '0.00'
					this.product[1].money = '0.00'
					this.list[0].num = 0
					this.list[1].num = 0
					this.message = ''
					if(!wepy.$instance.globalData['userinfo']) {
						this.userinfo = null
					}
				}
			}
		},
		created() {
			if(wepy.$instance.globalData['userinfo']) {
				if(wepy.getStorageSync('isEye') == 'true' || eval(wepy.getStorageSync('isEye'))) {
					this.isEyes = true
				}
				this.userinfo = wepy.$instance.globalData['userinfo'];
				this.myDatas();
			}
		}
	}
</script>

<style scoped>
	.van-pull-refresh {
		height: 100%;
	}
</style>