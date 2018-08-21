<template>
	<div class="signdetail">
		<div class="headers">
			<span class="title">累计获得红包</span>
			<span class="totals">{{total}}<i class="title">元</i></span>
		</div>
		<div class="contents">
			<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
				<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="40">
					<div class="listCon">
						<div :class="['lists',(items.length!=index+1)?'newBox':'']" v-for="(item,index) in items">
							<div class="leftBox">
								<span class="nums">周期第{{item.num}}天签到发放</span>
								<span class="times">{{item.time}}</span>
							</div>
							<span class="amounts">+{{item.amount}}</span>
						</div>
					</div>
					<div class="weui-loadmore" v-if="!reachBottom">
						<div class="weui-loading"></div>
						<div class="weui-loadmore__tips">正在加载</div>
					</div>
					<!--触底提示-->
					<div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-if="items&&items.length>0 && reachBottom">
						<div class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多了</div>
					</div>
					<div class="empty-placeholder row-center" v-if="(!items||(items&&items.length<=0))">
						<span class="ml20">暂无数据...</span>
					</div>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import { PullRefresh, Waterfall } from 'vant';
	export default {
		name: 'Signdetail',
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		data() {
			return {
				isLoading: false,
				items: [],
				disabled: false,
				pageNo: 1,
				pageSize: 10,
				reachBottom: false,
				headHeight: lib.flexible.rem2px(1.3),
				total: '0.00'
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
			onRefresh() {
				this.getData(1)
			},
			loadMore() {
				this.disabled = true;
				this.getData()
			},
			async getData(pageNo) {
				if(pageNo) this.pageNo = pageNo
				let res = await Http.post({
					url: Api.coupon.receivelist,
					data: {
						pageInfo: {
							pageNo: this.pageNo,
							pageSize: this.pageSize
						}
					}
				})
				this.isLoading = false; //结束下拉刷新
				this.disabled = false; //结束上拉
				if(this.pageNo >= res.data.pageInfo.totalPage) {
					this.reachBottom = true;
					this.disabled = true; //禁用上拉加载更多
				} else {
					this.reachBottom = false;
				}
				if(res.code != 10000) {
					return
				}
				this.onLoadxs(res.data, pageNo)
			},
			onLoadxs(res, pageNo) {
				let datas = res
				this.total = Utils.formatCurrency(datas.total)
				if(datas.list && datas.list.length > 0) {
					for(let value of datas.list) {
						value.amount = Utils.formatCurrency(value.amount)
						value.time = Utils.formatTimestamp({
							time: value.time
						})
					}
				}
				this.pageNo++;
				this.items = pageNo ? datas.list : this.items.concat(datas.list)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.signdetail {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.headers {
		width: 100%;
		height: 22%;
		background-color: #d14040;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		margin-bottom: 0.26rem;
	}
	
	.title {
		.font-dpr(36);
		font-style: normal;
	}
	
	.totals {
		.font-dpr(80);
	}
	
	.contents {
		width: 100%;
		height: 78%;
		overflow-y: auto;
	}
	
	.listCon {
		width: 100%;
		background-color: #fff;
	}
	
	.lists {
		width: 90%;
		margin-left: 5%;
		padding-right: 5%;
		height: 1.76rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.amounts {
		.font-dpr(36);
		color: #e45038;
	}
	
	.leftBox {
		display: flex;
		flex-direction: column;
	}
	
	.nums {
		.font-dpr(28);
		color: #3b3b3b;
	}
	
	.times {
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.van-pull-refresh {
		height: 100%;
	}
</style>