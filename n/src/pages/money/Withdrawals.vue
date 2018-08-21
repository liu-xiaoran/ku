<template>
	<div class="withdrawals">
		<div class="bankBox">
			<img v-if="message.bankLogo" class="bankLogo" :src="message.bankLogo" />
			<div class="bankcon">
				<span class="bankName">{{message.bankName}}</span>
				<span class="bankCardNo">{{message.bankCardNo}}</span>
				<span class="bankMeg">限额:{{message.withdrawOneLimit/10000}}万/笔,{{message.withdrawMoonLimit/10000?(message.withdrawMoonLimit/10000+'万'):'无限额'}}/月,{{message.withdrawDayLimit/10000?(message.withdrawDayLimit/10000+'万'):'无限额'}}/日</span>
			</div>
		</div>
		<div class="tishi">
			<div>当前余额:<span class="cashBalance">{{message.cashBalances}}元</span></div>
		</div>
		<div class="inputBoxs" style="margin-top: 0;">
			<div class="inputs">
				<span class="inputTexts">提现金额</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" v-model="moneys" oninput="value=value.replace(/[^\d\.]/g,'')" type="number" :placeholder="'单笔提现大于'+message.withdrawMins+'元'" id="moneys" />
				</p>
				<v-touch class="eliminate" v-show="moneys" @tap="remove">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<span class="inputText" style="margin-right: 0.4rem;">元</span>
				<button class="getAll" style="margin: 0;" :disabled="(message.cashBalance-0)<=0" @click="getAlls">全部提现</button>
			</div>
		</div>
		<div class="tishi" v-if="message.feeType=='OLD'">
			<span v-if="message.monthlyFreeTimes>message.alreadyWithdrawTimes">每月前{{message.monthlyFreeTimes}}次提现免费,本月已免费{{message.alreadyWithdrawTimes}}次</span>
			<span v-else>提现手续费每笔<span style="color:#e45038;">{{message.withdrawFees}}</span>元</span>
		</div>
		<div class="tishi" v-if="message.feeType=='NEW'">
			<span v-if="message.withdrawFees">本次提现手续费<span style="color:#e45038;">{{message.withdrawFees}}</span>元</span>
			<span v-else>手续费计算中</span>
		</div>
		<div class="regBtn">
			<button class="comBtn" :disabled="!moneys||(moneys-0)<=message.withdrawMin||message.cashBalance<message.withdrawMin||message.cashBalance<moneys||message.withdrawMaxLimit<moneys" @click="toWithdrawals">下一步</button>
		</div>
		<div class="timeTs">最快次日到账,以实际到账时间为准</div>
		<div class="iconVen">
			<div class="icons iconfont icon-anquan"></div>
			<span>账户资金安全由亚太保险提供保障</span>
		</div>
		<div class="cozyBox" v-if="(message.warmPrompts&&message.feeType=='NEW')||(message.maintainInfo&&message.feeType=='OLD')">
			<div class="cozyTitle">温馨提示 :</div>
			<div class="hankBox" v-if="message.maintainInfo&&message.feeType=='OLD'">
				<div class="yhImg iconfont icon-tanhao"></div>
				<span>{{message.maintainInfo}}</span>
			</div>
			<div v-if="warmPrompts&&message.feeType=='NEW'" v-html="message.warmPrompts"></div>
		</div>
		<logBase />
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Tips from '../../utils/Tips';
	import logBase from '../logBase';
	export default {
		name: 'Withdrawals',
		components: {
			logBase
		},
		data() {
			return {
				message: '',
				moneys: ''
			}
		},
		watch: {
			moneys(newValue, oldValue) {
				if(this.message.feeType == 'NEW') {
					this.message.withdrawFees = ''
					this.getFee()
				}
			}
		},
		methods: {
			remove() {
				this.moneys = '';
			},
			getAlls(e) {
				if(!e.srcElement.disabled) {
					this.moneys = this.message.cashBalance
				}
			},
			toWithdrawals(e) {
				if(!e.srcElement.disabled) {
					let withdrawFeecon;
					if(this.message.feeType == 'NEW') {
						withdrawFeecon = this.message.withdrawFee
					} else {
						if(this.message.monthlyFreeTimes > this.message.alreadyWithdrawTimes) {
							withdrawFeecon = 0
						} else {
							withdrawFeecon = this.message.withdrawFee
						}
					}
					this.$router.replace({
						path: `/confirm?m=${this.moneys}&f=${withdrawFeecon}`
					})
				}
			},
			async goRecharge() {
				let res = await Http.post({
					url: Api.money.withdrawals,
					data: {},
					extendInfo: ['UserBasicInfo'],
					dotShowMsg: 1
				})
				if(res.code == 10012) {
					this.$router.push({
						path: '/bindcard'
					});
				} else if(res.code == 10000) {
					if(res.extendInfo.UserBasicInfo.isPayPwd == 1) {
						if(res.data.valid) {
							let datas = res.data
							if(datas.withdrawMin) {
								datas.withdrawMins = Utils.formatCurrency(datas.withdrawMin)
							}
							if(datas.withdrawFee) {
								datas.withdrawFees = Utils.formatCurrency(datas.withdrawFee)
							}
							datas.cashBalances = Utils.formatCurrency(datas.cashBalance||0)
							this.message = datas
						} else {
							Tips.alert(res.data.validDesc)
						}
					} else {
						this.$router.push({
							path: '/setpaypwd'
						})
					}
				}
			},
			async getFee() {
				let res = await Http.postTimeout({
					url: Api.money.withdrawFee,
					data: {
						withdrawAmount: this.moneys || 0
					},
					timeout: 500
				})
				if(res && (res.code == 10000)) {
					this.message.withdrawFee = res.data.withdrawFee
					this.message.withdrawFees = Utils.formatCurrency(res.data.withdrawFee)
				} else {
					this.message.withdrawFee = 0
					this.message.withdrawFees = "0.00"
				}
			}
		},
		created() {
			this.goRecharge()
			if(this.message.feeType == 'NEW') {
				this.getFee()
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.tishi {
		width: 92%;
		height: 1.17rem;
		display: flex;
		justify-content: flex-end;
		padding: 0 4%;
		align-items: center;
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.cozyBox .yhImg {
		width: 0.37rem;
		height: 0.37rem;
		margin-right: 0.13rem;
		margin-bottom: 0;
		line-height: 0.37rem;
		color: #c97171;
		.font-dpr(29);
	}
	
	.whText {
		display: flex;
		align-items: center;
	}
	
	.cashBalance {
		color: #3b3b3b;
	}
	
	.getAll {
		height: 0.69rem;
		line-height: 0.69rem;
		color: #fff;
		background: #72a3e0;
		.font-dpr(28);
		padding: 0 0.26rem;
		border: none;
		outline: none;
		border-radius: 0.1rem;
	}
	
	.getAll[disabled][type="default"],
	.getAll[disabled]:not([type]) {
		background: #72a3e0;
		color: #fff;
	}
	
	.regBtn {
		width: 92%;
		padding: 0 4% 0.53rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.13rem;
	}
	
	.timeTs {
		width: 100%;
		text-align: center;
		.font-dpr(24);
		color: #a6a6a6;
		margin-bottom: 0.26rem;
	}
	
	.iconVen {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #5f6783;
		.font-dpr(24);
	}
	
	.icons {
		height: 0.4rem;
		margin-right: 0.06rem;
		color: #347e44;
		line-height: 0.32rem;
		.font-dpr(32);
	}
	
	.cozyBox {
		margin-top: 0.46rem;
		width: 92%;
		padding: 0 4%;
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.cozyBox p {
		margin-bottom: 0.13rem;
	}
	
	.cozyBox .cozyTitle {
		color: #3b3b3b;
		margin-bottom: 0.26rem;
	}
	
	.hankBox {
		display: flex;
		align-items: center;
	}
</style>
