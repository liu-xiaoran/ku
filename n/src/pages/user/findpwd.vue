<template>
	<div id="findpwd">
		<div class="userPhone" v-if="!show">已验证手机号为:{{input.phone}}</div>

		<div class="inputBox" style="margin-top:0">

			<div class="inputs phoneBox" v-if="show">
				<span class="inputText">手机号</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" oninput="if(value.length>11)value=value.slice(0,11)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入您的手机号码" id="phone" v-model="input.phone" />
				</p>
				<v-touch class="eliminate" v-if="input.phone" @tap="remove('phone')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
			<div class="inputs">
				<span class="inputText">验证码</span>
				<p class="list-cell__bd">
					<input style="width: 100%;" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入短信验证码" id="vercode" v-model="input.vercode" />
				</p>
				<v-touch class="eliminate" v-if="input.vercode" @tap="remove('vercode')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<button class="getVercode" :disabled="input.phone.length!=11||isVericode.isSend" @click="getVericode">{{isVericode.span}}</button>
			</div>
		</div>
		<div class="findBtn"><button class="comBtn" :disabled="input.phone.length!=11||!input.vercode||input.vercode.length!=6" @click="toNext">下一步</button></div>
	</div>
</template>
<script>
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Tips from "../../utils/Tips";
	import Utils from "../../utils/Utils";
	import router from "../../router";
	export default {
		name: "findpwd",
		data() {
			return {
				keys: {
					forgetlogin: {
						span: "找回密码",
						to: "/setlogpwd",
						type: "forgetlogin"
					},
					payPwdUpdate: {
						span: "交易密码",
						to: "/setpaypwd",
						type: "payPwdUpdate"
					}
				},
				key: "forgetlogin",
				input: {
					phone: "",
					vercode: ""
				},
				timer: null,
				isVericode: {
					isSend: false,
					span: "获取验证码"
				},
				show: true
			};
		},
		methods: {
			remove(type) {
				if(type == "phone") {
					this.input.phone = "";
				} else if(type == "vercode") {
					this.input.vercode = "";
				}
			},
			getVericode(e) {
				if(!e.srcElement.disabled) {
					if(this.isVericode.isSend) {
						return;
					}
					this.getCode();
				}
			},
			toNext(e) {
				if(!e.srcElement.disabled) {
					if(!Utils.tapHandler()) {
						return;
					}
					if(this.key == "payPwdUpdate") {
						/*重置支付密码*/
						this.$router.push({
							path: `${this.keys[this.key].to}?code=${this.input.vercode}&key=reset`
						})
					} else {
						/*重置登陆密码*/
						this.chectVericode();
					}
				}
			},
			async chectVericode() {
				let res = await Http.post({
					url: Api.user.checkVericode,
					data: {
						phone: this.input.phone,
						veriCode: this.input.vercode,
						smsType: this.keys[this.key].type
					}
				});
				if(res.code == 10000) {
					this.$router.push({
						path: `${this.keys[this.key].to}?phone=${this.input.phone}&code=${this.input.vercode}`
					})
				}
			},
			async getCode() {
				this.isVericode.isSend = true;
				let data = {
					smsType: this.key
				};
				if(this.key == "forgetlogin") {
					data = {
						phone: this.input.phone,
						smsType: this.key
					};
				}
				let res = await Http.post({
					url: Api.user.getVericode,
					data
				});
				if(res.code == 10000 || res.code == 99995) {
					if(res.data && res.data.ttl) {
						this.countDown(res.data.ttl);
					} else {
						this.countDown(120);
					}
				} else {
					this.isVericode.isSend = false;
				}
			},
			countDown(time) {
				let that = this;
				that.timer = setInterval(function() {
					if(time > 0) {
						that.isVericode.isSend = true;
						that.isVericode.span = `重新获取(${time})`;
						time--;
					} else {
						clearInterval(that.timer);
						that.isVericode = {
							isSend: false,
							span: "获取验证码"
						};
					}
				}, 1000);
			}
		},
		created() {
			this.key = this.$route.query.key || "forgetlogin";
			if(this.$route.query.key == "payPwdUpdate") {
				this.show = false;
				this.input.phone = this.$route.query.phone
			} else {
				this.input.phone = this.$route.query.phone
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../style/utils.less";
	#findpwd {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}
	
	.inputBox {
		width: 96%;
		padding-left: 4%;
		background: #fff;
		margin-top: 0.4rem;
	}
	
	.inputs {
		width: 95%;
		height: 1.173333rem;
		padding-right: 5%;
		display: flex;
		flex-direction: row;
		align-items: center;
		.font-dpr(28);
		color: #3b3b3b;
	}
	
	.phoneBox {
		border-bottom: 0.013333rem solid #dfdfdf;
	}
	
	.inputText {
		margin-right: 0.666667rem;
	}
	
	.findBtn {
		width: 92%;
		padding: 0.8rem 4% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.133333rem;
	}
	
	.userPhone {
		height: 1.173333rem;
		color: #a6a6a6;
		line-height: 1.173333rem;
		text-align: center;
	}
	
	#vercode {
		width: 50%;
	}
</style>