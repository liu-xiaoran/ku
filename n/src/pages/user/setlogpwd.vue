<template>
	<div id="setlogpwd">
		<div class="inputBox">
			<div class="inputs newBox" v-if="eyes.length==3">
				<span class="inputTexts">原密码</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" maxlength="16" :type="eyes[2]?'text':'password'" placeholder="请输入原密码" v-model="input.oldpwd" />
				</p>
				<v-touch class="eliminate" v-if="input.oldpwd" @tap="remove('oldpwd')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<v-touch @tap="changePwd(2)" class="eye iconfont" :class="eyes[2]?'icon-yanjing1':'icon-yanjing'"></v-touch>
			</div>
			<div class="inputs newBox">
				<span class="inputTexts">新密码</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" maxlength="16" :type="eyes[0]?'text':'password'" placeholder="请输入新密码" v-model="input.newpwd" />
				</p>
				<v-touch class="eliminate" v-if="input.newpwd" @tap="remove('newpwd')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<v-touch @tap="changePwd(0)" class="eye iconfont" :class="eyes[0]?'icon-yanjing1':'icon-yanjing'"></v-touch>
			</div>
			<div class="inputs">
				<span class="inputTexts">确认新密码</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" maxlength="16" :type="eyes[1]?'text':'password'" placeholder="请输入新密码" v-model="input.secondPwd" />
				</p>
				<v-touch class="eliminate" v-if="input.secondPwd" @tap="remove('secondPwd')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<v-touch @tap="changePwd(1)" class="eye iconfont" :class="eyes[1]?'icon-yanjing1':'icon-yanjing'"></v-touch>
			</div>
		</div>
		<div class="setBtn"><button class="comBtn" :disabled="!input.newpwd||input.newpwd.length<6||input.newpwd!==input.secondPwd" @click="setPwds">确定</button></div>
	</div>
</template>
<script>
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Tips from "../../utils/Tips";
	import Utils from "../../utils/Utils";
	import wepy from '../../utils/wepy';
	import router from "../../router";
	export default {
		name: "setlogpwd",
		data() {
			return {
				keys: {
					find: {
						span: "设置登录密码",
						api: ""
					},
					set: {
						span: "设置登录密码"
					},
					change: {
						span: "修改登录密码"
					}
				},
				key: "find",
				parentDate: "",
				eyes: [true, true],
				input: {
					secondPwd: "",
					newpwd: "",
					oldpwd: ""
				},
			};
		},
		methods: {
			remove(type) {
				this.input[type] = "";
			},
			changePwd(index) {
				this.eyes.splice(index, 1, !this.eyes[index])
			},
			setPwds(e) {
				if(!e.srcElement.disabled) {
					if(!Utils.tapHandler()) {
						return;
					}
					this.setPwd();
				}
			},
			async setPwd() {
				let data = {
					newPwd: this.input.newpwd,
					newPwd2: this.input.secondPwd,
					platform: "H5"
				};
				if(this.key == "change") {
					data.oldPwd = this.input.oldpwd;
				} else if(this.key == "find") {
					data.phone = this.parentDate.phone;
					data.veriCode = this.parentDate.vericode;
				}
				let res = await Http.post({
					url: Api.user.setLoginPwd[this.key],
					data
				});
				if(res.code == 10000) {
					if(wepy.$instance.globalData["userinfo"]) {
						this.goLogin();
					} else {
						this.$router.replace({
							path: "/pages/home"
						})
					}
				}
			},
			async goLogin() {
				let res = await Http.post({
					url: Api.user.logout,
					data: {
						platform: "H5"
					}
				});
				if(res.code == 10000) {
					wepy.$instance.globalData.userinfo = null;
					wepy.$instance.globalData.session_id = null;
					wepy.removeStorage({
						key: "userinfo"
					});
					wepy.removeStorage({
						key: "session_id"
					});
					wepy.removeStorage({
						key: "isEye"
					});
					this.$router.replace({
						path: "/pages/home"
					})
				}
			}
		},
		created() {
			this.key = this.$route.query.key || "find"
			this.parentDate = {
				phone: this.$route.query.phone,
				vericode: this.$route.query.code
			}
			if(this.key == "change") {
				this.eyes = [true, true, true]
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

	.setBtn {
		width: 92%;
		padding: 0.8rem 4% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.133333rem;
	}
</style>
