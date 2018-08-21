<template>
	<div class="register">
		<div class="registerBoxs">
			<div class="inputBoxs">
				<div class="inputs newBox">
					<span class="inputText">手机号</span>
					<p class="list-cell__bd">
						<input class="list-cell__bd_inputs" type="number" v-model="inputs.phone" oninput="if(value.length>11)value=value.slice(0,11)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入您的手机号码" id="phone" />
					</p>
					<v-touch class="eliminate" v-show="inputs.phone" @tap="remove('phone')">
						<div class="chasBtn iconfont icon-cha3"></div>
					</v-touch>
				</div>
				<div class="inputs">
					<span class="inputText">验证码</span>
					<p class="list-cell__bd">
						<input class="list-cell__bd_inputs" v-model="inputs.vercode" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入短信验证码" id="vercode" />
					</p>
					<v-touch class="eliminate" v-show="inputs.vercode" @tap="remove('vercode')">
						<div class="chasBtn iconfont icon-cha3"></div>
					</v-touch>
					<button class="getVercode" :disabled="inputs.phone.length!=11||isVericode.isSend" @click="getVericode">{{isVericode.text}}</button>
				</div>
			</div>
			<div class="regBtn">
				<img v-show="inputs.phone.length!=11||!inputs.vercode||inputs.vercode.length!=6||!isChoose" class="regImg" src="../../images/x/zhucehui.png" />
				<img v-show="!(inputs.phone.length!=11||!inputs.vercode||inputs.vercode.length!=6||!isChoose)" class="regImg" src="../../images/x/zhucehong.png" />
				<button class="comBtn" :disabled="inputs.phone.length!=11||!inputs.vercode||inputs.vercode.length!=6||!isChoose" @click="toRegisters">注册</button>
			</div>
			<div class="agreeBox">
				<CheckboxOption :value="isChoose" @click="bindAgreeChange">我已阅读并同意</CheckboxOption>
				<a class="agreement" :href="'/actives1/static/protocolDetail?type=register&t='+new Date().getTime()">《掌悦平台服务协议》</a>
			</div>
			<div class="iconList">
				<div class="iconCons firstCons">
					<div class="iconVen">
						<div class="icons iconfont icon-gou1"></div>
						<span>国家事业单位控股</span>
					</div>
					<div class="iconVen lastVen">
						<div class="icons iconfont icon-gou1"></div>
						<span>亚太财险保障</span>
					</div>
				</div>
				<div class="iconCons">
					<div class="iconVen">
						<div class="icons iconfont icon-gou1"></div>
						<span>第三方担保</span>
					</div>
					<div class="iconVen lastVen">
						<div class="icons iconfont icon-gou1"></div>
						<span>通过ISO9001-2015质量管理认证</span>
					</div>
				</div>
			</div>
		</div>
		<v-touch class="toLoginBack" @tap="toLoginBack">已有账号，直接登录</v-touch>
		<logBase></logBase>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import wepy from '../../utils/wepy';
	import writeLog from '../../utils/writeLog';
	import { CheckboxOption } from '../../components/Checkbox';
	import logBase from '../logBase';
	export default {
		name: 'Register',
		components: {
			CheckboxOption,
			logBase
		},
		data() {
			return {
				timer: null,
				isChoose: true,
				isVericode: {
					isSend: false,
					text: '获取验证码'
				},
				inputs: {
					phone: '',
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
					this.getCode();
					this.onClickGetCode();
				}
			},
			async onClickGetCode() {
				writeLog.write({
					evt: "RegisterGetVeriCodeClick",
					ext: {
						"tel": this.inputs.phone.substring(this.inputs.phone.length - 4),
						"tellength": this.inputs.phone.length
					}
				})
			},
			async getCode() {
				this.isVericode.isSend = true
				let res = await Http.post({
					url: Api.user.getVericode,
					data: {
						phone: this.inputs.phone,
						smsType: 'regist'
					}
				})
				if(res.code == 10000) {
					if(res.data && res.data.ttl) {
						this.countDown(res.data.ttl)
					} else {
						this.countDown(120)
					}
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
			toRegisters(e) {
				if(!e.srcElement.disabled) {
					this.isRegister();
					this.onClickRegist();
				}
			},
			async onClickRegist() {
				writeLog.write({
					evt: "RegisterClick",
					ext: {
						"tel": this.inputs.phone.substring(this.inputs.phone.length - 4),
						"tellength": this.inputs.phone.length,
						"vericode": this.inputs.vercode
					}
				})
			},
			async isRegister() {
				let res = await Http.post({
					url: Api.user.login,
					data: {
						phone: this.inputs.phone,
						platform: 'H5',
						veriCode: this.inputs.vercode
					}
				})
				if(res.code == 10000) {
					wepy.setStorage({
						key: 'userinfo',
						data: res.extendInfo.UserBasicInfo.userId
					});
					wepy.$instance.globalData['userinfo'] = res.extendInfo.UserBasicInfo.userId;
					if(this.$route.query && this.$route.query.source && this.$route.query.source == 'reg') {
						this.$router.go(-2);
					} else {
						this.$router.go(-1);
					}
				} else {
					writeLog.write({
						evt: "RegisterResult",
						ext: res,
						ret: "fail"
					})
				}
			},
			bindAgreeChange(e) {
				this.isChoose = e;
			},
			toLoginBack() {
				if(this.$route.query && this.$route.query.source && this.$route.query.source == 'reg') {
					this.$router.go(-1);
				} else {
					this.$router.push({
						name: 'Login',
						query: {
							source: 'log'
						}
					});
				}
			}
		},
		beforeCreate() {
			if(wepy.$instance.globalData['userinfo']) {
				this.$router.go(-1);
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.register {
		width: 100%;
		height: 100%;
		overflow: hidden;
		text-align: center;
	}
	
	.registerBoxs {
		width: 100%;
		height: 92%;
	}
	
	.regBtn {
		width: 92%;
		padding: 0.8rem 4% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.2rem;
	}
	
	.regImg {
		width: 4.25rem;
		height: 0.58rem;
		display: block;
	}
	
	.iconList {
		width: 88%;
		margin: 0.53rem 6% 0;
		border-top: 0.02rem solid #dfdfdf;
		padding-top: 0.53rem;
	}
	
	.iconCons {
		width: 100%;
		display: flex;
		align-items: center;
	}
	
	.firstCons {
		margin-bottom: 0.49rem;
	}
	
	.iconVen {
		display: flex;
		align-items: center;
		color: #a6a6a6;
		.font-dpr(21);
		flex: 1.3;
	}
	
	.lastVen {
		flex: 2;
	}
	
	.icons {
		width: 0.37rem;
		height: 0.37rem;
		margin-right: 0.13rem;
		line-height: 0.37rem;
		.font-dpr(30);
		color: #5da17f;
	}
	
	.toLoginBack {
		margin-bottom: 0.66rem;
		color: #e45038;
		.font-dpr(24);
	}
</style>