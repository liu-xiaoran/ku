<template>
	<div class="paypwd-box">
		<div class="pas-title">{{title}}</div>
		<div class="pas-box">
			<div class="box-six">
				<input focus="true" v-focus="true" class="pas-input" autofocus="true" @input="change" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" id="pwds" v-model="pwds" />
				<div class="six">
					<div class="i"><span class="b" v-if="pwds.length>0"></span></div>
					<div class="i"><span class="b" v-if="pwds.length>1"></span></div>
					<div class="i"><span class="b" v-if="pwds.length>2"></span></div>
					<div class="i"><span class="b" v-if="pwds.length>3"></span></div>
					<div class="i"><span class="b" v-if="pwds.length>4"></span></div>
					<div class="i"><span class="b" v-if="pwds.length>5"></span></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Tips from "../../utils/Tips";
	import Utils from "../../utils/Utils";
	import router from "../../router";
	export default {
		name: "setpaypwd",
		data() {
			return {
				pwds: "",
				title: "请输入交易密码",
				paypwd: ""
			};
		},
		directives: {
			focus: {
				// 指令的定义
				inserted: function(el) {
					el.focus();
				}
			}
		},
		watch: {
			pwds(newValue, oldValue) {
				console.log(newValue, !this.paypwd);
				if(newValue && newValue.length >= 6 && !this.paypwd) {
					setTimeout(() => {
						this.title = "请确认交易密码";
						this.pwds = "";
					}, 600);
					this.paypwd = newValue;
				} else if(newValue && newValue.length >= 6) {
					if(newValue == this.paypwd) {
						this.submit();
					} else {
						Tips.toast("两次输入密码不一致，请重新输入");
						this.pwds = "";
						this.paypwd = "";
						this.title = "请输入交易密码";
					}
				}
			}
		},
		methods: {
			change() {
				if(this.pwds.length>6)this.pwds=this.pwds.slice(0,6)
				this.pwds = this.pwds.toString().replace(/^[\D]*|\D*/g,"")
			},
			async submit() {
				let data = {
					password: this.paypwd
				};
				if(this.key == "reset") {
					data = {
						securityCode: this.code,
						newPassword: this.paypwd
					};
				}
				let res = await Http.post({
					url: Api.user.paypwd[this.key],
					data
				});
				if(res.code == 10000) {
					this.$router.go(-1)
				}
			}
		},
		created() {
			this.key = this.$route.query.key || "set";
			this.code = this.$route.query.code;
		},
		beforeDestroy() {
			this.paypwd = "";
		}
	};
</script>
<style lang="less" scoped>
	@import "../../style/utils.less";
	.paypwd-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 60%;
	}
	
	.pas-title {
		margin-bottom: 1rem;
	}
	
	.pas-box {
		display: block;
		overflow: hidden;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.box-six {
		display: flex;
		width: 6.666667rem;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;
	}
	
	.six {
		border-bottom: 0.03rem solid #6d6d6d;
		border-radius: 0.08rem;
		border-right: 0.03rem solid #6d6d6d;
		border-top: 0.03rem solid #6d6d6d;
		height: 1.173333rem;
		width: 100%;
		display: flex;
	}
	
	.i {
		flex: 1;
		border-left: 0.03rem solid #6d6d6d;
		float: left;
		height: 1.173333rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.b {
		width: 0.4rem;
		height: 0.4rem;
		display: block;
		background: #3b3b3b;
		border-radius: 1.333333rem;
	}
	
	.pas-input {
		border: 0;
		color: #fff;
		font-size: 0.5px;
		height: 1.173333rem;
		left: -2.666667rem;
		top: 0;
		position: absolute;
		width: 12rem;
		z-index: 8;
		opacity: 0;
	}
</style>