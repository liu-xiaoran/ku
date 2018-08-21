<template>
	<div :class="['zan-dialog',showDialog ? 'zan-dialog--show' : '']">
		<div class="paypwdbox" :class="[open ? 'weui-animate-fade-in' : 'weui-animate-fade-out']">
			<div class="payPass" :animation="animationData">
				<div class="pas-title">
					<div class="list-cell__bd closeBox">
						<v-touch @tap="toggleDialog" class="close iconfont icon-cha"></v-touch>
					</div>
					<span>请输入交易密码</span>
					<div class="list-cell__bd"></div>
				</div>
				<div class="pas-num">
					<span>{{message.name}}</span>
					<span class="pas-money">￥{{message.isMoney||'0.00'}}</span>
				</div>
				<div class="pas-box">
					<div class="box-six">
						<input class="pas-input" autofocus="true" @input="change" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" id="pwds" v-model="pwds" />
						<!--<input v-model="pwds" autofocus="true" class="pas-input" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" id="pwds" />-->
						<div class="six">
							<div class="i"><span class="b" v-show="pwds.length>0"></span></div>
							<div class="i"><span class="b" v-show="pwds.length>1"></span></div>
							<div class="i"><span class="b" v-show="pwds.length>2"></span></div>
							<div class="i"><span class="b" v-show="pwds.length>3"></span></div>
							<div class="i"><span class="b" v-show="pwds.length>4"></span></div>
							<div class="i"><span class="b" v-show="pwds.length>5"></span></div>
						</div>
					</div>
				</div>
				<p class="toPwdBox">
					<v-touch @tap="toPwd">忘记交易密码?</v-touch>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import wepy from '../../utils/wepy';
	export default {
		name: 'Paypwdbox',
		props: ['message'],
		data() {
			return {
				pwds: '',
				showDialog: false,
				open: false,
				animationData: {}
			}
		},
		watch: {
			pwds(newValue, oldValue) {
				if(newValue.length >= 6) {
					this.$parent.isSuccessed(newValue)
				}
			}
		},
		methods: {
			toPwd() {
				this.$router.push({
					name: "findpwd",
					query: {
						key: "payPwdUpdate",
						phone: wepy.$instance.globalData['userinfo']
					}
				})
			},
			change() {
				if(this.pwds.length > 6) this.pwds = this.pwds.slice(0, 6)
				this.pwds = this.pwds.toString().replace(/^[\D]*|\D*/g, "")
			},
			toggleDialog() {
				this.open = !this.open
				if(!this.open) {
					this.pwds = ''
				}
				if(this.showDialog) {
					setTimeout(() => {
						this.showDialog = !this.showDialog
					}, 500);
				} else {
					this.showDialog = !this.showDialog
				}
			},
			getEmpty() {
				this.pwds = ''
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	@import "../../style/widget/weui-animate/weui-animate.less";
	.zan-dialog {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		display: none;
		&.zan-dialog--show {
			display: block;
		}
	}
	
	.paypwdbox {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		z-index: 100;
		overflow: hidden;
	}
	
	.payPass {
		background: #fff;
		border-radius: 0.16rem;
		display: block;
		height: 6.61rem;
		margin-top: 8%;
		width: 80%;
	}
	
	.pas-title {
		width: 92%;
		padding: 0 4%;
		height: 1.57rem;
		display: flex;
		align-items: center;
		color: #3b3b3b;
		.font-dpr(36);
		border-bottom: 0.03rem solid #a6a6a6;
	}
	
	.closeBox {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	
	.close {
		width: 0.37rem;
		height: 0.37rem;
		padding: 0.26rem;
		line-height: 0.37rem;
		color: #a9a9a9;
		.font-dpr(40);
	}
	
	.pas-num {
		color: #3b3b3b;
		.font-dpr(28);
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0.26rem 0;
	}
	
	.pas-money {
		margin-top: 0.13rem;
		.font-dpr(66);
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
		width: 6.66rem;
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
		height: 1.17rem;
		width: 100%;
		display: flex;
	}
	
	.i {
		flex: 1;
		border-left: 0.03rem solid #6d6d6d;
		float: left;
		height: 1.17rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.b {
		width: 0.4rem;
		height: 0.4rem;
		display: block;
		background: #3b3b3b;
		border-radius: 200px;
	}
	
	.pas-input {
		border: 0;
		color: #fff;
		.font-dpr(1);
		height: 1.17rem;
		left: -2.66rem;
		top: 0;
		position: absolute;
		width: 12rem;
		z-index: 8;
		opacity: 0;
		outline: none;
	}
	
	.toPwdBox {
		width: 100%;
		text-align: center;
		margin-top: 0.4rem;
		.font-dpr(24);
		color: #aaa;
	}
	
	.toPwdBox div {
		display: inline;
	}
</style>