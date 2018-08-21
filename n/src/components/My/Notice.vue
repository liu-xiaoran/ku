<template>
	<van-pull-refresh v-model="isLoading" :headHeight="headHeight" class="notice">
		<a class="navtor" v-for="item in pageNum" :href="item.url">
			<div class="conList">
				<span class="msgTitle">{{item.title}}</span>
				<span>{{item.releaseTime}}</span>
			</div>
			<div class="list-cell">
				<div class="list-cell__bd">查看详情</div>
				<div class="list-cell__ft list-cell__ft_in-access"></div>
			</div>
		</a>
	</van-pull-refresh>
</template>

<script>
	import { PullRefresh } from 'vant';
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	export default {
		name: 'Notice',
		data() {
			return {
				pageNum: '',
				isLoading: false,
				headHeight: lib.flexible.rem2px(1.3)
			}
		},
		watch: {
			isLoading() {
				if(this.isLoading) {
					this.onRefresh()
				}
			}
		},
		methods: {
			onRefreshs() {
				if(!this.pageNum) {
					this.onLoadxed()
				}
			},
			onRefresh() {
				this.onLoadxed()
			},
			async onLoadxed() {
				let d = new Date()
				let res = await Http.get({
					url: Api.notice,
					data: {
						t: d.getTime()
					}
				})
				this.isLoading = false; //结束下拉刷新
				if(res.data.errorCode == 0) {
					this.pageNum = res.data.rows
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.navtor {
		width: 100%;
		background-color: #fff;
		margin-bottom: 0.26rem;
		color: #3b3b3b;
		display: block;
		text-decoration: none;
	}
	
	.conList {
		width: 94%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.49rem 3% 0.34rem;
		.font-dpr(24);
	}
	
	.msgTitle {
		.font-dpr(30);
	}
	
	.list-cell {
		height: 1.01rem;
		border-top: 0.01rem solid #dfdfdf;
	}
	
	.list-cell__bd {
		.font-dpr(24);
	}
</style>