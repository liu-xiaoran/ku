<template>
	<div class="letterview">
		<div class="title">{{message.msgTitle}}</div>
		<div class="time">{{message.createTime}}</div>
		<div class="contents"><span>{{message.msgContent}}</span></div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	export default {
		name: 'Letterview',
		data() {
			return {
				message: ''
			}
		},
		methods: {
			async views() {
				let res = await Http.post({
					url: Api.my.letterView,
					data: {
						id: this.$route.query.id
					}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.createTime = Utils.formatTimestamp({
						time: Utils.Fmul(datas.createTime, 1000)
					})
					this.message = datas
				}
			}
		},
		created() {
			this.views()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.title {
		width: 100%;
		color: #3b3b3b;
		.font-dpr(36);
		line-height: 0.48rem;
		margin: 0.53rem 0 0.33rem;
		text-align: center;
	}
	
	.time {
		width: 100%;
		color: #a6a6a6;
		.font-dpr(24);
		line-height: 0.32rem;
		margin-bottom: 0.53rem;
		text-align: center;
	}
	
	.contents {
		width: 94%;
		padding: 0 3%;
		color: #3b3b3b;
		.font-dpr(28);
		line-height: 0.66rem;
		display: flex;
		justify-content: center;
	}
</style>