<template>
	<div class="confirm">
		<div class="box">
			<img class="resultIcon" src="../../images/x/icon_tixian.png" />
			<span class="resultText">本次提现金额为</span>
			<span class="resultMoney">{{message.moneys}}<span style="font-size: 34rpx;">元</span></span>
			<span class="tsText">--继续投资将获得更多收益哦--</span>
			<span class="procedures">本次提现手续费{{message.fees}}元 , 实际到账金额<span style="color: #e45038;">{{message.actual}}</span>元</span>
		</div>
		<div class="btnBoxs">
			<button class="btn1" @click="toNext">确认提现</button>
			<button class="btn1 btn2" @click="toBuy">赚取收益</button>
		</div>
		<Paypwdbox :message="toPwdBox" ref="edit" />
    <logBase></logBase>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
  import Paypwdbox from '../../components/pwdbox/Paypwdbox.vue';
  import logBase from '../logBase';
	export default {
		name: 'Confirm',
		components: {
      Paypwdbox,
      logBase
		},
		data() {
			return {
				message: '',
				toPwdBox: {
					name: '提现',
					isMoney: ''
				}
			}
		},
		methods: {
			toNext() {
				this.toPwdBox.isMoney = this.message.moneys
				this.$refs.edit.toggleDialog()
			},
			async toBuy() {
				let res = await Http.post({
					url: Api.getCurrentDetail,
					data: {}
				})
				if(res.code == 10000) {
					Utils.goBuyCheck({productOid:res.data.content.oid,productType:'CURRENT'}, this)
				}
			},
			async isSuccessed(pwd) {
				if(!Utils.tapHandler()) {
					return
				}
				let res = await Http.post({
					url: Api.money.goWithdrawals,
					data: {
						password: pwd,
						withdrawAmount: this.message.money,
						fee: this.message.fee
					}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.applyDate = Utils.formatTimestamp({
						time: datas.applyDate,
						showtime: true
					})
					datas.bankTradeDate = Utils.formatTimestamp({
						time: datas.bankTradeDate,
						showtime: true
					})
					datas.estimateCompleteDate = Utils.formatTimestamp({
						time: datas.estimateCompleteDate,
						showtime: true
					})
					datas.money = this.message.moneys
					datas.fees = this.message.fees
					datas.actual = this.message.actual
					this.$preload('withdrawalsResult', datas)
					this.$router.replace({
						path: '/results'
					})
				} else {
					this.$refs.edit.toggleDialog()
				}
			}
		},
		created() {
			this.message = {
				money: this.$route.query.m,
				moneys: Utils.formatCurrency(this.$route.query.m),
				fee: this.$route.query.f,
				fees: Utils.formatCurrency(this.$route.query.f),
				actual: Utils.formatCurrency(Utils.Fsub(this.$route.query.m, this.$route.query.f))
			}
			console.log(this.message)
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	button {
		border: none;
		outline: none;
	}

	.confirm {
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.box {
		width: 100%;
		height: 77%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.resultIcon {
		width: 2.52rem;
		height: 2.18rem;
		margin: 1.41rem 0 0.66rem;
	}

	.resultText {
		color: #3b3b3b;
		.font-dpr(37);
	}

	.resultMoney {
		color: #e45038;
		.font-dpr(64);
	}

	.tsText {
		.font-dpr(26);
		color: #e45038;
		margin: 0.13rem 0 0.66rem;
	}

	.procedures {
		color: #a6a6a6;
		.font-dpr(24);
	}

	.btnBoxs {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.btn1 {
		width: 45%;
		height: 1.17rem;
		line-height: 1.17rem;
		color: #fff;
		.font-dpr(30);
		background: #e45038;
		margin: 0;
		padding: 0;
		border-radius: 0.06rem;
	}

	.btn2 {
		box-sizing: border-box;
		border: 0.05rem solid #e45038;
		background: #fff;
		color: #e45038;
		margin-top: 0.69rem;
	}
</style>
