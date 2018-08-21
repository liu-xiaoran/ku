<template>
	<div class="mycontent">
		<div class="myContent">
			<div class="typeBox">
				<div v-for="(item,index) in tabs" :class="[index!=1?'typeBtn':'line']">
					<v-touch v-if="index!=1" @tap="toNextPage(item.url)" :class="['spanBox',index==0?'greys':'redcon']">{{item.name}}</v-touch>
				</div>
			</div>
			<div class="mylist" style="margin: 0.26rem 0;">
				<v-touch :key="item.id" @tap="href(item.url)" :class="[(product.length!=index+1)?'list-cell newBox':'list-cell']" v-for="(item,index) in product">
					<div :class="['circles',item.color]">{{item.icon}}</div>
					<div class="list-cell__bd">我的{{item.icon=='天'?'掌薪宝':(item.icon+'期')}}</div>
					<div class="list-cell__ft colorRed">{{!isEyes?item.money:'****'}}元</div>
				</v-touch>
			</div>
			<div class="mylist" style="margin-bottom: 0.26rem;">
				<v-touch :key="item.id" @tap="href(item.url||'')" :class="[(list.length!=index+1)?'list-cell newBox':'list-cell']" v-for="(item,index) in list">
					<img class="icons" :src="item.icon" />
					<div class="list-cell__bd">{{item.name}}
						<div class="spot" v-if="item.num"></div>
					</div>
					<div class="list-cell__ft list-cell__ft_in-access">
						<span class="prompt" v-if="item.num&&index==0">{{item.num}}张可用</span>
						<span class="prompt" v-if="item.num&&index==1">{{item.num}}份可领</span>
					</div>
				</v-touch>
			</div>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Tips from '../../utils/Tips';
	import wepy from '../../utils/wepy';
	export default {
		name: 'Mycontent',
		props: ['product', 'tabs', 'list', 'isEyes'],
		data() {
			return {

			}
		},
		methods: {
			href(url) {
				if(!wepy.$instance.globalData['userinfo']) {
					this.$router.push({
						path: '/login'
					});
				} else {
					this.$router.push({
						path: url
					});
				}
			},
			toNextPage(url) {
				this.goRecharge(url)
			},
			async goRecharge(url) {
				let res = await Http.post({
					url: (url == 'recharge') ? Api.money.recharge : Api.money.withdrawals,
					data: {},
					extendInfo: ['UserBasicInfo'],
					dotShowMsg: 1
				})
				if(res.code == 10012) {
					this.$router.push({
						path: '/bindcard'
					});
				} else if(res.code == 10000) {
					if(res.extendInfo&&res.extendInfo.UserBasicInfo&&res.extendInfo.UserBasicInfo.isPayPwd == 1) {
						if(res.data.valid) {
							let datas = res.data
							if(datas.rechargeMin) {
								datas.rechargeMins = Utils.formatCurrency(datas.rechargeMin)
							} else if(datas.withdrawMin) {
								datas.withdrawMins = Utils.formatCurrency(datas.withdrawMin)
							}
							if(datas.withdrawFee) {
								datas.withdrawFees = Utils.formatCurrency(datas.withdrawFee)
							}
							datas.cashBalances = Utils.formatCurrency(datas.cashBalance||0)
//							this.$preload('nextData', datas)
							if(url == 'recharge') {
								this.$router.push({
									path: '/recharge'
								})
							} else {
								this.$router.push({
									path: '/withdrawals'
								})
							}
						} else {
							Tips.alert(res.data.validDesc)
						}
					} else {
						this.$router.push({
							path: '/setpaypwd'
						})
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.mycontent {
		width: 100%;
		animation: fadeIn 1.6s;
	}
	
	.typeBox {
		width: 100%;
		height: 1.33rem;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.typeBtn {
		flex: 1;
		height: 100%;
	}
	
	.typeBtn .spanBox {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.line {
		width: 0.025rem;
		height: 0.69rem;
		background: #dfdfdf;
	}
	
	.greys {
		color: #3b3b3b;
		.font-dpr(32);
	}
	
	.redcon {
		color: #e45038;
		.font-dpr(32);
	}
	
	.circles {
		width: 0.53rem;
		height: 0.53rem;
		line-height: 0.53rem;
		border-radius: 200px;
		text-align: center;
		color: #fff;
		margin-right: 0.2rem;
		.font-dpr(30);
	}
	
	.blue {
		background-color: #5391d7;
	}
	
	.red {
		background-color: #ef6455;
	}
	
	.colorRed {
		color: #e45038;
		.font-dpr(30);
	}
	
	.mylist .list-cell__bd {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
	
	.spot {
		width: 0.17rem;
		height: 0.17rem;
		background: #e45038;
		border-radius: 200px;
		margin: 0.1rem 0 0 0.14rem;
	}
</style>