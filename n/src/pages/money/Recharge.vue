<template>
	<div class="recharge">
		<div class="bankBox">
			<img v-if="message.bankLogo" class="bankLogo" :src="message.bankLogo" />
			<div class="bankcon">
				<span class="bankName">{{message.bankName}}</span>
				<span class="bankCardNo">{{message.bankCardNo}}</span>
				<span class="bankMeg">限额:{{message.payOneLimit/10000}}万/笔,{{message.payMoonLimit/10000?(message.payMoonLimit/10000+'万/月,'):(message.payDayLimit?'无限额/月,':'')}}{{message.payDayLimit/10000?(message.payDayLimit/10000+'万'):'无限额'}}/日</span>
			</div>
		</div>
		<div class="tishi">
			<div style="display:flex;align-items: center;">
				<div v-if="message.maintainInfo" class="whText">
					<div class="yhImg iconfont icon-tanhao"></div>
					<span>{{message.maintainInfo}}</span>
				</div>
			</div>
			<div>当前余额:<span class="cashBalance">{{message.cashBalances}}</span>元</div>
		</div>
		<div class="inputBoxs" style="margin-top: 0;">
			<div class="inputs newBox">
				<span class="inputTexts">充值金额</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" v-model="inputs.moneys" oninput="value=value.replace(/[^\d\.]/g,'')" type="number" :placeholder="'单笔充值最低'+message.rechargeMins+'元'" id="moneys" />
				</p>
				<v-touch class="eliminate" v-show="inputs.moneys" @tap="remove('moneys')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<span class="inputText" style="margin-right: 0;">元</span>
			</div>
			<div class="inputs">
				<span class="inputTexts">验证码</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" v-model="inputs.vercode" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入短信验证码" id="vercode" />
				</p>
				<v-touch class="eliminate" v-show="inputs.vercode" @tap="remove('vercode')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<button class="getVercode" style="margin: 0;" :disabled="!inputs.moneys||(inputs.moneys-0)<message.rechargeMin||isVericode.isSend" @click="getVericode">{{isVericode.text}}</button>
			</div>
		</div>
		<div class="regBtn">
			<button class="comBtn" :disabled="!inputs.moneys||(inputs.moneys-0)<message.rechargeMin||!inputs.vercode||inputs.vercode.length!=6" @click="toRecharges">确定</button>
		</div>
		<div class="iconVen">
			<div class="icons iconfont icon-anquan"></div>
			<span>账户资金安全由亚太保险提供保障</span>
		</div>
		<Paypwdbox :message="toPwdBox" ref="edit" />
		<logBase />
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import writeLog from '../../utils/writeLog';
	import Tips from '../../utils/Tips';
	import Paypwdbox from '../../components/pwdbox/Paypwdbox.vue';
	import logBase from '../logBase';
	export default {
		name: 'Recharge',
		components: {
			Paypwdbox,
			logBase
		},
		data() {
			return {
				orderNo: '',
				message: '',
				timer: null,
				isVericode: {
					isSend: false,
					text: '获取验证码'
				},
				toPwdBox: {
					name: '充值',
					isMoney: ''
				},
				inputs: {
					moneys: '',
					vercode: ''
				}
			}
		},
		methods: {
			remove(type) {
				this.inputs[type] = '';
			},
			getVericode(e) {
				if(!e.srcElement.disabled) {
					this.getCode()
					this.onClickGetVericode()
				}
			},
			async onClickGetVericode() {
				writeLog.write({
					evt: "RechargeGetVeriCodeClick",
					ext: {
						"amount": this.inputs.moneys
					}
				})
			},
			async getCode() {
				this.isVericode.isSend = true
				let res = await Http.post({
					url: Api.money.getRechCode,
					data: {
						rechargeAmount: this.inputs.moneys
					}
				})

				if(res.code == 10000) {
					this.orderNo = res.data.orderNo
					this.toPwdBox.isMoney = Utils.formatCurrency(this.inputs.moneys)
					this.countDown(60)
				} else {
					this.isVericode.isSend = false
				}
			},
			countDown(time) {
				this.timer = setInterval(() => {
					if(time > 0) {
						this.isVericode.isSend = true
						this.isVericode.text = `重新获取(${time})`
						time--
					} else {
						clearInterval(this.timer)
						this.isVericode = {
							isSend: false,
							text: '获取验证码'
						}
					}
				}, 1000)
			},
			toRecharges(e) {
				if(!e.srcElement.disabled) {
					if(this.toPwdBox.isMoney != Utils.formatCurrency(this.inputs.moneys)) {
						clearInterval(this.timer)
						this.isVericode = {
							isSend: false,
							text: '获取验证码'
						}
						Tips.alert('金额发生改变，请重新获取验证码')
					} else {
						this.$refs.edit.toggleDialog()
					}
					this.onClickToRecharges()
				}
			},
			async onClickToRecharges() {
				writeLog.write({
					evt: "RechargeConfirmClick",
					ext: {
						"oid": this.orderNo.substring(this.orderNo.length - 4),
						"vericode": this.inputs.vercode
					}
				})
			},
			async goRecharge() {
				let res = await Http.post({
					url: Api.money.recharge,
					data: {},
					extendInfo: ['UserBasicInfo'],
					dotShowMsg: 1,
					localCache:1
				})
				if(res.code == 10012) {
					this.$router.push({
						path: '/bindcard'
					});
				} else if(res.code == 10000) {
					if(res.extendInfo.UserBasicInfo.isPayPwd == 1) {
						if(res.data.valid) {
							let datas = res.data
							if(datas.rechargeMin) {
								datas.rechargeMins = Utils.formatCurrency(datas.rechargeMin)
							}
							datas.cashBalances = Utils.formatCurrency(datas.cashBalance || 0)
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
			async isSuccessed(pwd) {
				if(!Utils.tapHandler()) {
					return
				}
				let res = await Http.post({
					url: Api.money.goRecharge,
					data: {
						securityCode: this.inputs.vercode,
						password: pwd,
						orderNo: this.orderNo
					}
				})
				if(res.code == 10000) {
					this.$preload('rechargeResult', res.data)
					this.$router.push({
						path: `/results?pwd=${pwd}`
					})
					this.inputs.moneys = ''
					this.inputs.vercode = ''
					clearInterval(this.timer)
					this.isVericode = {
						isSend: false,
						text: '获取验证码'
					}
				} else {
					writeLog.write({
						evt: "RechargeResult",
						ext: res,
						ret: "fail"
					})
				}
				this.$refs.edit.toggleDialog();
			}
		},
		created() {
			if(this.$route.query.m) {
				this.inputs.moneys = this.$route.query.m
			}
			this.goRecharge()
		},
		beforeDestroy() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.tishi {
		width: 92%;
		height: 1.17rem;
		display: flex;
		justify-content: space-between;
		padding: 0 4%;
		align-items: center;
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.yhImg {
		width: 0.37rem;
		height: 0.37rem;
		margin-right: 0.13rem;
		line-height: 0.37rem;
		color: #c97171;
		.font-dpr(30);
	}
	
	.whText {
		display: flex;
		align-items: center;
	}
	
	.cashBalance {
		color: #3b3b3b;
	}
	
	.regBtn {
		width: 92%;
		padding: 0.72rem 4% 0.53rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.13rem;
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
</style>