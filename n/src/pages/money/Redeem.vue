<template>
	<div class="redeem">
		<div class="productName">
			<span>{{message.productName}}</span>
		</div>
		<div class="inputBox">
			<div class="yuan">￥</div>
			<p class="list-cell__bd">
				<input class="list-cell__bd_inputs inputs" v-model="moneys" oninput="value=value.replace(/[^\d\.]/g,'')" type="number" data-max="message.maxRedeemAmount" :placeholder="'可转让金额:'+message.maxRedeemAmounts" id="moneys" />
			</p>
			<v-touch class="eliminate" v-if="moneys" @tap="remove">
				<div class="chasBtn iconfont icon-cha3"></div>
			</v-touch>
			<v-touch class="all-in" @tap="allIn">全部转让</v-touch>
		</div>
		<div class="feeBox">
			<span>{{expect}}</span>
		</div>
		<div class="btnBox">
			<button class="comBtn" :disabled="!moneys||moneys<=0" @click="toRedeem">确定</button>
			<div class="tsBox">
				<span v-for="(item,index) in list" :class="[index==0?'tsTitle':'']">{{item}}</span>
			</div>
		</div>
		<Paypwdbox :message="toPwdBox" ref="edit" />
		<logBase></logBase>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Tips from '../../utils/Tips';
	import Paypwdbox from '../../components/pwdbox/Paypwdbox.vue';
	import logBase from '../logBase';
	export default {
		name: 'Redeem',
		components: {
			Paypwdbox,
			logBase
		},
		data() {
			return {
				message: '',
				moneys: '',
				fee: 0,
				expect: '本次转让手续费0.00元 , 实际到账金额0.00元',
				list: [],
				toPwdBox: {
					name: '转让',
					isMoney: ''
				}
			}
		},
		watch: {
			moneys(newValue, oldValue) {
				this.posts()
			}
		},
		methods: {
			remove() {
				this.moneys = '';
			},
			allIn() {
				this.moneys = this.message.maxRedeemAmount
			},
			toRedeem(e) {
				if(!e.srcElement.disabled) {
					this.toPwdBox.isMoney = Utils.formatCurrency(this.moneys)
					this.$refs.edit.toggleDialog()
				}
			},
			async posts() {
				let formKey = ''
				formKey = (new Date()).getTime()
				this.expect = '手续费计算中'
				let res = await Http.postTimeout({
					url: Api.money.redeemFee,
					data: {
						formKey: formKey,
						orderAmount: this.moneys || 0,
						feeType: this.message.feeType,
						feeAmount: this.message.feeAmount,
						minFee: this.message.minFee,
						freeAmount: this.message.freeAmount,
						principal: this.message.principal,
						holdAmount: this.message.holdAmount
					},
					timeout: 500
				})
				if(res && res.code && (res.code == 10000)) {
					if(res.data.formKey == formKey) {
						this.expect = `本次转让手续费${Utils.formatCurrency(res.data.fee)}元 , 实际到账金额${Utils.formatCurrency(Utils.Fsub(this.moneys||0,res.data.fee||0))}元`
						this.fee = res.data.fee
					} else {
						this.expect = '手续费计算中'
						this.fee = 0
					}
				} else {
					this.expect = '本次转让手续费0.00元 , 实际到账金额0.00元'
					this.fee = 0
				}
			},
			onDatas(data) {
				this.message = data
				this.list = [
					'温馨提示',
					`1、单笔最低转让金额 : ${data.minSingleRedeemAmount}元`,
					`2、单人单日转让上限 : ${data.maxSingleDayRedeemAmount}元`,
					// `3、自T日起T+${data.limitDay}（T日指投资人申购掌薪宝的有效日期，T日为工作日，如非工作日投资，则应当自动顺延至下一个工作日）的转让交易需收取${data.feeAmount}%的手续费,最低收取${data.minSingleRedeemAmount}元;T+${data.limitDay}日后的转让交易，不收取手续费。`
					`3、债权转让时间由债权转让交易撮合情况而定，具体请以实际到账时间为准`
				]
			},
			async isRedeem() {
				let res = await Http.post({
					url: Api.money.redeemPrepose,
					data: {
						productId: this.$route.query.p
					},
					extendInfo: ['UserBasicInfo']
				})
				if(res.code == 10000) {
					if(res.extendInfo.UserBasicInfo.isBindCard == 1) {
						if(res.data.valid) {
							let datas = res.data
							datas.maxRedeemAmounts = Utils.formatCurrency(datas.maxRedeemAmount)
							datas.maxSingleDayRedeemAmount = Utils.formatCurrency(datas.maxSingleDayRedeemAmount)
							this.onDatas(datas)
						} else {
							Tips.alert(res.data.validDesc)
						}
					} else {
						this.$router.push({
							path: '/bindcard'
						})
					}
				}
			},
			async isSuccessed(pwd) {
				if(!Utils.tapHandler()) {
					return
				}
				let res = await Http.post({
					url: Api.money.redeem,
					data: {
						productId: this.message.productId,
						orderAmount: this.moneys || 0,
						redeemType: 'FASTREDEEM', //快赎
						fee: this.fee,
						payPasswd: pwd
					}
				})
				if(res.code == 10000) {
					this.moneys = ''
					this.$preload("result", res.data)
					this.$router.push({
						path: '/result'
					})
				}
				this.$refs.edit.toggleDialog()
			}
		},
		created() {
			this.isRedeem()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.productName {
		width: 94%;
		height: 1.68rem;
		margin: 0.26rem 3%;
		border-radius: 0.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		.font-dpr(40);
		background: linear-gradient(left, #fc5b57, #e33c4f);
		background: -moz-linear-gradient(left, #fc5b57, #e33c4f);
		background: -webkit-linear-gradient(left, #fc5b57, #e33c4f);
		background: -o-linear-gradient(left, #fc5b57, #e33c4f);
	}
	
	.inputBox {
		width: 100%;
		height: 1.76rem;
		display: flex;
		align-items: center;
		background-color: #fff;
	}
	
	.yuan {
		.font-dpr(66);
		color: #3b3b3b;
		margin: 0 0.3rem 0 0.4rem;
	}
	
	.inputs {
		.font-dpr(36);
		padding: 0;
		line-height: 1rem;
	}
	
	.all-in {
		.font-dpr(36);
		font-weight: 600;
		color: #e45038;
		padding: 0 0.53rem 0 0.26rem;
	}
	
	.feeBox {
		width: 92%;
		height: 1.17rem;
		padding: 0 4%;
		display: flex;
		align-items: center;
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.btnBox {
		width: 92%;
		padding: 0 4%;
	}
	
	.tsBox {
		width: 100%;
		.font-dpr(24);
		color: #a6a6a6;
		line-height: 0.56rem;
		display: flex;
		flex-direction: column;
	}
	
	.tsTitle {
		color: #3b3b3b;
		line-height: 0.37rem;
		margin: 0.37rem 0 0.44rem;
	}
</style>