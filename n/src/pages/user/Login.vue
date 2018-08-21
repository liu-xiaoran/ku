<template>
	<div class="login">
		<div class="loginBoxs">
			<img class="logoImg" src="../../images/x/denglulogo.png" />
			<div class="loginTab">
				<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__items',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
					<div class="weui-navbar__title">{{item}}</div>
				</v-touch>
				<div class="weui-navbar__slider" id="lineMove" style="left: 0"></div>
			</div>
			<div class="inputBox">
				<img class="icon" src="../../images/x/icon_shouji.png" />
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" type="number" v-model="inputs.phone" oninput="if(value.length>11)value=value.slice(0,11)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入您的手机号码" id="phone" />
				</p>
				<v-touch class="eliminate" v-show="inputs.phone" @tap="remove('phone')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
			<div class="weui-tab__panel">
				<div class="weui-tab__content fastlogin" v-show="activeIndex == 0">
					<div class="inputBox">
						<img class="icon" src="../../images/x/icon_duanxin.png" />
						<p class="list-cell__bd">
							<input class="list-cell__bd_inputs" v-model="inputs.vercode" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入短信验证码" id="vercode" />
						</p>
						<v-touch class="eliminate" v-show="inputs.vercode" @tap="remove('vercode')">
							<div class="chasBtn iconfont icon-cha3"></div>
						</v-touch>
						<button class="getVercode" :disabled="inputs.phone.length!=11||isVericode.isSend" @click="getVericode">{{isVericode.text}}</button>
					</div>
				</div>
				<div class="weui-tab__content loginBox" v-show="activeIndex == 1">
					<div class="pwdlogin">
						<div class="inputBox">
							<img class="icon" src="../../images/x/icon_mima.png" />
							<p class="list-cell__bd">
								<input class="list-cell__bd_inputs" v-model="inputs.pwd" maxlength="16" :type="eyes?'text':'password'" placeholder="请输入您的登录密码" id="pwd" />
							</p>
							<v-touch class="eliminate" v-show="inputs.pwd" @tap="remove('pwd')">
								<div class="chasBtn iconfont icon-cha3"></div>
							</v-touch>
							<v-touch @tap="changePwd" :class="['eye','iconfont',eyes?'icon-yanjing1':'icon-yanjing']"></v-touch>
						</div>
					</div>
				</div>
			</div>
			<button class="toLogin comBtn" :disabled="inputs.phone.length!=11||(activeIndex==1?!inputs.pwd||inputs.pwd.length<6:!inputs.vercode||inputs.vercode.length!=6)" @click="toLogins">登录</button>
			<v-touch class="toReg" @tap="toRegisterBack">
				<img class="redPacket" src="../../images/x/icon_xiaohongbao.png" />
				<span>注册领红包 &gt;&gt;</span>
			</v-touch>
		</div>
		<v-touch class="toForgetPwd" @tap="toForgetPwd">忘记登录密码？</v-touch>
    <logBase></logBase>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
  import wepy from '../../utils/wepy';
  import router from "../../router";
  import logBase from '../logBase';
	export default {
    name: 'Login',
    components: {
      logBase
    },
		data() {
			return {
				timer: null,
				activeIndex: 1,
				eyes: false,
				tabs: ['快捷登录', '密码登录'],
				isVericode: {
					isSend: false,
					text: '获取验证码'
				},
				inputs: {
					phone: '',
					vercode: '',
					pwd: ''
				}
			}
		},
		methods: {
			remove(type) {
				this.inputs[type] = ''
			},
			changePwd() {
				this.eyes = !this.eyes
			},
			tabClick(id) {
				if(id == 1) {
					this.inputs.vercode = ''
					clearInterval(this.timer)
					this.isVericode = {
						isSend: false,
						text: '获取验证码'
					}
				} else {
					this.inputs.pwd = ''
				}
				document.getElementById("lineMove").style.transform = `translateX(${Utils.Fmul(id,100)}%)`;
				document.getElementById("lineMove").style.webkitTransform = `translateX(${Utils.Fmul(id,100)}%)`;
				this.activeIndex = id
			},
			getVericode(e) {
				if(!e.srcElement.disabled) {
					this.getCode();
				}
			},
			async getCode() {
				this.isVericode.isSend = true
				let res = await Http.post({
					url: Api.user.getVericode,
					data: {
						phone: this.inputs.phone,
						smsType: 'appLogin'
					}
				})
				if(res.code == 10000 || res.code == 99995) {
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
			toLogins(e) {
				if(!e.srcElement.disabled) {
					this.isLogin()
				}
			},
			async isLogin() {
				let res = await Http.post({
					url: Api.user.login,
					data: {
						phone: this.inputs.phone,
						platform: 'H5',
						userPwd: this.inputs.pwd,
						veriCode: this.inputs.vercode
					}
				})
				if(res.code == 10000) {
					wepy.setStorage({
						key: 'phoneNum',
						data: this.inputs.phone
					})
					wepy.setStorage({
						key: 'userinfo',
						data: res.extendInfo.UserBasicInfo.phone
					})
					wepy.$instance.globalData['userinfo'] = res.extendInfo.UserBasicInfo.phone
					if(this.$route.query&&this.$route.query.source&&this.$route.query.source == 'log') {
						this.$router.go(-2);
					} else {
						this.$router.go(-1);
					}
				}
			},
			toRegisterBack() {
				if(this.$route.query&&this.$route.query.source&&this.$route.query.source == 'log') {
					this.$router.go(-1);
				} else {
					this.$router.push({
						name: 'Register',
						query: {
							source: 'reg'
						}
					});
				}
      },
      toForgetPwd(){
        this.$router.push({
          name:"findpwd",
          query:{
            key:"forgetlogin",
            phone:this.inputs.phone
          }
        })
      }
		},
		beforeCreate() {
			if(wepy.$instance.globalData['userinfo']) {
				this.$router.go(-1);
			}
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		created() {
			if(wepy.getStorageSync('phoneNum')) {
				this.inputs.phone = wepy.getStorageSync('phoneNum');
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.login {
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
		text-align: center;
	}

	.loginBoxs {
		width: 92%;
		height: 94%;
		padding: 0 4%;
		min-height:14rem
	}

	.logoImg {
		width: 3.4rem;
		height: 3.34rem;
		margin: 0.26rem 0 0.66rem;
	}

	.loginTab {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-bottom: 1.06rem;
		position: relative;
		border-bottom: 0.02rem solid #e2e2e2;
	}

	.weui-navbar__items {
		position: relative;
		display: block;
		flex: 1;
		text-align: center;
		font-size: 0;
		padding-bottom: 0.13rem;
		color: #a6a6a6;
	}

	.weui-bar__item_on {
		color: #e45038;
	}

	.weui-navbar__title {
		.font-dpr(30);
	}

	.loginTab span {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 0.02rem solid #e2e2e2;
		padding-bottom: 0.13rem;
	}

	.loginBox,
	.pwdlogin,
	.fastlogin,
	.weui-tab__panel {
		width: 100%;
	}

	.inputBox {
		width: 96%;
		height: 1.17rem;
		border-bottom: 0.02rem solid #dfdfdf;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 2%;
	}

	.icon {
		width: 0.52rem;
		height: 0.44rem;
		margin-right: 0.4rem;
	}

	.toLogin {
		margin-top: 0.74rem;
	}

	.toReg {
		display: flex;
		align-items: center;
		justify-content:center;
		margin-top: 0.4rem;
		color: #e45038;
		.font-dpr(26);
	}

	.redPacket {
		width: 0.56rem;
		height: 0.52rem;
		margin-right: 0.13rem;
	}

	.toForgetPwd {
		margin-bottom: 0.66rem;
		color: #a6a6a6;
		.font-dpr(24);
		text-decoration: none;
	}

	.weui-navbars {
		display: flex;
		width: 100%;
		background: #fff;
		position: relative;
	}

	.weui-navbar__slider {
		height: 0.02rem;
		background: #e45038;
		bottom: 0;
	}
	
	#lineMove {
		transform: translateX(100%);
		-webkit-transform: translateX(100%);
	}
</style>
