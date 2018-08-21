<template>
	<div class="results">
		<ul class="box" v-if="message.orderStatus">
			<li v-if="message.orderStatus == 'SUCCESS'">
				<div class="resultIconImg iconfont icon-gou1"></div>
				<span class="resultText">恭喜您成功充值</span>
				<span class="resultMoney">{{orderAmount}}<span class="succMoneys">元</span></span>
			</li>
			<li v-if="message.orderStatus == 'FAILED'">
				<div class="resultIconImg iconfont icon-cha2"></div>
				<span class="resultText">充值失败</span>
				<span class="resultReason">{{message.orderDesc}}</span>
			</li>
			<li v-if="message.orderStatus == 'INIT' || message.orderStatus == 'PROCESSING'">
				<div v-if="texts.time>0" class="resultIconImg iconfont icon-time"></div>
				<img v-else class="resultIcon" src="../../images/x/zhengzaichuli.png" />
				<span class="resultText">{{texts.bigtxt}}</span>
				<span class="resultReason">{{texts.time>0?texts.time:''}}{{texts.smalltxt}}</span>
			</li>
		</ul>
		<div class="box" v-else>
			<img class="resultIcon resultIcons" src="../../images/x/icon_tixianchengong.png" />
			<span class="resultText">提现成功</span>
			<div class="bankList">
				<div class="bankCon">
					<span>提现到</span>
					<span class="grays" v-if="bank">{{bank.bankName+bank.bankCardNo+bank.realName}}</span>
				</div>
				<div class="bankCon">
					<span>提现金额</span>
					<span class="grays">{{message.money}}元</span>
				</div>
			</div>
			<div class="timeList" style="margin-bottom: 0.36rem;">
				<div class="iconCons">
					<div class="iconBens iconfont icon-qian" style="color: #4a88bc;"></div>
				</div>
				<div class="line linecon">
					<p style="width: 100%;border-radius: 200px;"></p>
				</div>
				<div class="iconCons">
					<div class="iconBens iconfont icon-shijian" style="color: #4a88bc;"></div>
				</div>
				<div class="line linecon">
					<p style="width: 50%;"></p>
				</div>
				<div class="iconCons">
					<div class="iconBens iconfont icon-gou2" style="color: #d4d4d4;"></div>
				</div>
			</div>
			<div class="timeList" style="margin-bottom: 0.3rem;">
				<div class="iconCons">
					<span class="iconText">提现成功</span>
				</div>
				<div class="line"></div>
				<div class="iconCons">
					<span class="iconText">银行处理中</span>
				</div>
				<div class="line"></div>
				<div class="iconCons">
					<span class="iconText">到账成功</span>
				</div>
			</div>
			<div class="timeList" style="margin-bottom: 0.66rem;">
				<div class="iconCons">
					<span class="iconTexts">{{message.applyDate}}</span>
				</div>
				<div class="line"></div>
				<div class="iconCons">
					<span class="iconTexts">{{message.bankTradeDate}}</span>
				</div>
				<div class="line"></div>
				<div class="iconCons">
					<span class="iconTexts">{{message.estimateCompleteDate}}</span>
				</div>
			</div>
			<span class="feeBox">本次提现手续费{{message.fees}}元 , 实际到账金额<span class="reds">{{message.actual}}</span>元</span>
		</div>
		<div class="btnBoxs">
			<button class="btn1" @click="changeBtns">{{btnText}}</button>
			<button class="btn1 btn2" @click="toRecharges" v-if="message.orderStatus == 'SUCCESS'">继续充值</button>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	export default {
		name: 'Results',
		data() {
			return {
				timer: null,
				message: '',
				bank: '',
				orderAmount: 0,
				btnText: '',
				texts: {
					time: 5,
					bigtxt: '充值受理中...',
					smalltxt: '秒后查看到账情况'
				}
			}
		},
		methods: {
			changeBtns() {
				if(this.message.orderStatus) {
					if(this.message.orderStatus == 'FAILED') {
						this.$router.go(-1);
					} else {
						this.$router.replace({
							path: '/pages/my'
						})
					}
				} else {
					this.$router.replace({
						path: '/depositRecord'
					})
				}
			},
			toRecharges() {
				this.$router.go(-1);
			},
			async getBank() {
				let res = await Http.post({
					url: Api.my.myBankcard,
					data: {}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.bankCardNo = ` ( ${datas.bankCardNo.slice(-4)} ) `
					this.bank = res.data
				}
			},
			async goRecharge(code) {
				let res = await Http.post({
					url: Api.money.goRecharge,
					data: {
						securityCode: code.orderAmount,
						password: code.pwd,
						orderNo: code.orderNo
					}
				})
				if(res.code == 10000) {
					this.message = res.data
					this.changeTxt()
				}
			},
			changeTxt() {
				if(this.message.orderStatus == 'SUCCESS') {
					this.orderAmount = Utils.formatCurrency(this.message.orderAmount)
					this.btnText = '完成'
				} else if(this.message.orderStatus == 'INIT' || this.message.orderStatus == 'PROCESSING') {
					this.btnText = '确定'
				} else if(this.message.orderStatus == 'FAILED') {
					this.btnText = '重新充值'
				}
			}
		},
		created() {
			if(this.$getPreloadData('rechargeResult',true)) {
				this.message = this.$getPreloadData('rechargeResult')

				this.changeTxt()
				if(this.message.orderStatus == 'INIT' || this.message.orderStatus == 'PROCESSING') {
					this.timer = setInterval(() => {
						if(this.texts.time > 0) {
							this.goRecharge({
								orderAmount: this.$getPreloadData('rechargeResult').orderAmount,
								pwd: this.$route.query.pwd,
								orderNo: this.$getPreloadData('rechargeResult').orderNo
							})
						}
						if(this.texts.time > 1) {
							this.texts.time--
						} else {
							clearInterval(this.timer)
							this.texts = {
								time: 0,
								bigtxt: '充值正在处理',
								smalltxt: '充值成功将有短信提示'
							}
							this.$delPreloadData('rechargeResult')
						}
					}, 1000)
				}
			} else if(this.$getPreloadData('withdrawalsResult',true)) {
				this.btnText = '完成'
				this.message = this.$getPreloadData('withdrawalsResult')
				this.getBank()
				this.$delPreloadData('withdrawalsResult')
			}else{
				location.href=location.origin+location.pathname;
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	button {
		border: none;
		outline: none;
	}
	
	.results {
		width: 100%;
		height: 100%;
		background: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.resultIcon {
		width: 2.18rem;
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
	
	.resultReason {
		.font-dpr(24);
		color: #a6a6a6;
		margin-top: 0.2rem;
	}
	
	.box {
		width: 100%;
		/*flex: 1;*/
		height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.box li {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.btnBoxs {
		margin-bottom: 1.1rem;
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
	
	.resultIcons {
		width: 2.52rem;
	}
	
	.bankList {
		width: 92%;
		margin: 0.93rem 4% 0.8rem;
		border-bottom: 0.01rem solid #ebebeb;
		display: flex;
		flex-direction: column;
	}
	
	.bankCon {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.font-dpr(28);
		margin-bottom: 0.69rem;
		color: #3b3b3b;
	}
	
	.grays {
		color: #a6a6a6;
	}
	
	.reds {
		color: #e45038;
	}
	
	.feeBox {
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.timeList {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.iconCons {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.iconBens {
		/*width: 1.08rem;*/
		height: 1.08rem;
		line-height: 1.08rem;
		.font-dpr(83);
	}
	
	.line {
		width: 1.2rem;
		border-radius: 200px;
	}
	
	.linecon {
		background: #d4d4d4;
		height: 0.08rem;
	}
	
	.linecon p {
		border-bottom-left-radius: 100px;
		border-top-left-radius: 100px;
		height: 100%;
		background: #4a88bc;
	}
	
	.iconText {
		.font-dpr(26);
		color: #4a88bc;
	}
	
	.iconTexts {
		.font-dpr(26);
		color: #d4d4d4;
	}
	
	.resultIconImg {
		width: 100%;
		height: 2.18rem;
		margin: 1.41rem 0 0.66rem;
		line-height: 2.18rem;
		.font-dpr(169);
		text-align: center;
	}
	
	.icon-gou1 {
		color: #3aa230;
	}
	
	.icon-cha2 {
		color: #b4b4b4;
	}
	
	.icon-time {
		color: #f3a934;
	}
	
	.succMoneys {
		.font-dpr(34);
	}
</style>