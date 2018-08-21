<template>
	<div class="feedback">
		<textarea rows="10" class="feedbackBox" placeholder="请留下您的宝贵意见" autofocus="autofocus" v-model="inputs" />
		<button class="comBtn" @click="feedbackBtn">告诉我们</button>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Tips from '../../utils/Tips';
	export default {
		name: 'Feedback',
		data() {
			return {
				inputs: ''
			}
		},
		methods: {
			feedbackBtn() {
				if(this.inputs) {
					this.feedInfo()
				} else {
					Tips.alert('请留下您的宝贵意见')
				}
			},
			async feedInfo() {
				let res = await Http.post({
					url: Api.set.sendFeedBack,
					data: {
						content: this.inputs
					}
				})
				if(res.code == 10000) {
					Tips.success('反馈成功!')
					this.$router.go(-1)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.feedback {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.feedbackBox {	
		.font-dpr(28);
		color: #3b3b3b;
		width: 86%;
		margin: 0.4rem 0 0.8rem;
		background-color: #fff;
		border-radius: 0.1rem;
		padding: 3%;
		border: none;
		outline: none;
		resize : none;
	}
	
	.comBtn {
		width: 80%;
	}
</style>