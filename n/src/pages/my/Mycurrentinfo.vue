<template>
	<div class="mycurrentinfo">
		<div class="flexs">
			<div class="headerBox">
				<div class="numBox">
					<span class="nums numss">{{message.yesterdayIncome||'0.00'}}</span>
					<span class="texts">昨日收益(元)</span>
				</div>
				<div class="headerTwo">
					<div class="numBox list-cell__bd">
						<span class="nums">{{message.holdAmount||'0.00'}}</span>
						<span class="texts">在投本金(元)</span>
					</div>
					<div class="numBox list-cell__bd">
						<span class="nums">{{message.totalIncome||'0.00'}}</span>
						<span class="texts">累计收益(元)</span>
					</div>
				</div>
			</div>
		</div>
		<div class="btnsBox">
			<v-touch :key="item.id" v-for="(item,index) in list" :class="[index==0?'btn1':'btn2']" @tap="toNext(index)">{{item}}</v-touch>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Tips from '../../utils/Tips';
	export default {
		name: 'Mycurrentinfo',
		data() {
			return {
				message: '',
				list: ['转让', '抢购']
			}
		},
		methods: {
			async myCurrentInfo(holdId) {
				let res = await Http.post({
					url: Api.my.myCurrentInfo,
					data: {
						holdId: holdId
					}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.holdAmount = Utils.formatCurrency(datas.holdAmount)
					datas.yesterdayIncome = Utils.formatCurrency(datas.yesterdayIncome)
					datas.totalIncome = Utils.formatCurrency(datas.totalIncome)
					this.message = datas
				}
			},
			toNext(index) {
				if(index == 0) {
					this.isRedeem()
				} else {
					this.$router.replace({
						path: '/pages/current'
					})
				}
			},
			async isRedeem() {
				let res = await Http.post({
					url: Api.money.redeemPrepose,
					data: {
						productId: this.message.productId
					},
					extendInfo: ['UserBasicInfo']
				})
				if(res.code == 10000) {
					if(res.extendInfo.UserBasicInfo.isBindCard == 1) {
						if(res.data.valid) {
							let datas = res.data
							datas.maxRedeemAmounts = Utils.formatCurrency(datas.maxRedeemAmount)
							datas.maxSingleDayRedeemAmount = Utils.formatCurrency(datas.maxSingleDayRedeemAmount)
//							this.$preload('nextData', datas)
							this.$router.push({
								path: `/redeem?p=${this.message.productId}`
							})
						} else {
							Tips.alert(res.data.validDesc)
						}
					} else {
						this.$router.push({
							path: '/bindcard'
						})
					}
				}
			}
		},
		created() {
			this.myCurrentInfo(this.$route.query.holdId)
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.mycurrentinfo {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.headerBox {
		width: 100%;
		height: 3.92rem;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #e45038;
	}
	
	.numBox {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.headerTwo {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-top: 0.4rem;
	}
	
	.nums {
		.font-dpr(28);
		color: #fff;
	}
	
	.numss {
		.font-dpr(50);
	}
	
	.texts {
		.font-dpr(24);
		color: #ffb88d;
	}
	
	.flexs {
		flex: 1;
	}
	
	.btnsBox {
		width: 100%;
		display: flex;
		.font-dpr(32);
	}
	
	.btn1 {
		flex: 1;
		height: 1.33rem;
		line-height: 1.33rem;
		text-align: center;
		color: #e45038;
		background-color: #fff;
	}
	
	.btn2 {
		flex: 1;
		height: 1.33rem;
		line-height: 1.33rem;
		text-align: center;
		color: #fff;
		background-color: #e45038;
	}
</style>