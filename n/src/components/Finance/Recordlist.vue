<template>
	<van-pull-refresh v-model="isLoading" :headHeight="headHeight" style="height: 100%;">
		<div class="recordTop" v-if="productType!='CURRENT'&&pageDocuments.content">
			<div class="recordTopCon">
				<div>{{pageDocuments.title}}</div>
				<div>{{pageDocuments.content}}</div>
			</div>
		</div>
		<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="40" class="recordlist">
			<div :class="['recordReCon',(items.length!=index+1)?'newBox':'']" v-for="(item,index) in items" :key="index">
				<div class="recordReConLeft">
					<div class="recordRePhone">
						<span>{{item.userPhone}}</span>
						<img class="iconImg" src="../../images/x/icon_chuizi.png" v-if="item.activityTypes.indexOf('hammer') >= 0" />
						<img class="iconImg" src="../../images/x/icon_yiminjingren.png" v-if="item.activityTypes.indexOf('famous') >= 0" />
					</div>
					<div class="recordReTime">{{item.createTime}}</div>
				</div>
				<div class="recordReConRight">
					<div>{{item.orderAmount}}元</div>
				</div>
			</div>
			<div class="weui-loadmore" v-if="!reachBottom&&!isLoading">
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
</template>

<script>
	import { PullRefresh, Waterfall } from "vant";
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Utils from "../../utils/Utils";
	export default {
		name: "Recordlist",
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		props: ['productType'],
		data() {
			return {
				isLoading: false,
				items: [],
				disabled: false,
				pageNo: 1,
				pageSize: 10,
				reachBottom: false,
				headHeight: lib.flexible.rem2px(1.3),
				pageDocuments: {
					content: "",
					title: ""
				}
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
					url: Api.productDetail.investRecord,
					data: {
						productOid: this.$route.query.productId,
						pageInfo: {
							pageNo: this.pageNo,
							pageSize: this.pageSize
						}
					}
				})
				this.isLoading = false; //结束下拉刷新
				if(this.pageNo >= res.data.pageInfo.totalPage) {
					this.reachBottom = true;
					this.disabled = true; //禁用上拉加载更多
				} else {
					this.reachBottom = false;
				}
				if(res.code == 10000) {
					this.onLoadxs(res, pageNo);
				} else {
					this.disabled = true; //禁用上拉加载更多
				}
			},
			onLoadxs(res, pageNo) {
				this.pageDocuments = res.data.documents
				let datas = res.data;
				if(datas.content && datas.content.length > 0) {
					for(let value of datas.content) {
						value.createTime = Utils.formatTimestamp(value.createTime);
						value.orderAmount = Utils.formatCurrency(value.orderAmount);
					}
					this.pageNo++;
					this.items = pageNo ? datas.content : this.items.concat(datas.content)
					setTimeout(()=>{
						this.disabled = false; //恢复上拉
					},0)
				} else {
					this.disabled = true; //禁用上拉加载更多
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.recordTop {
		min-height: 1.386667rem;
		background: #f0f0f0;
		.font-dpr(24);
		color: #a6a6a6;
	}

	.recordTopCon {
		height: 100%;
		width: 9.333333rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 0 auto;
	}

	.recordReCon {
		height: 1.76rem;
		width: 94%;
		padding-right: 3%;
		padding-left: 3%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #fff;
	}

	.recordReConLeft {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.recordReConRight {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.recordRePhone {
		.font-dpr(28);
		color: #3b3b3b;
		display: flex;
		align-items: center;
		.iconImg {
			display: block;
			width: 0.373333rem;
			height: 0.373333rem;
			margin-left: 0.106667rem;
		}
	}

	.recordReTime {
		.font-dpr(24);
		color: #a6a6a6;
		padding-left: 0.053333rem;
	}
</style>
