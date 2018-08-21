<template>
	<div class="scroll">
		<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
			<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400" class="couponlist">
				<div v-for="(item,index) in items">
					<v-touch style="border-radius: 0.2rem;" @tap="toMycouponDetails(item.ucId)" v-if="type=='NOTUSED'&&item.couponType!='REDPACKETS'">
						<Coupon :item="item" />
					</v-touch>
					<Coupon :item="item" v-else />
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
		</van-pull-refresh>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import { PullRefresh, Waterfall } from 'vant';
	import Coupon from './Coupon';
	export default {
		name: 'Couponlist',
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		props: ['type'],
		components: {
			Coupon
		},
		data() {
			return {
				isLoading: false,
				items: [],
				disabled: false,
				pageNo: 1,
				pageSize: 10,
				reachBottom: false,
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
			toMycouponDetails(ucId) {
//				this.myCouponDetailInfo(ucId)
				this.$router.push({
					path: `/mycoupondetails?uId=${ucId}`
				})
			},
			creates() {
				this.getData(1)
				this.top = 1
				this.bottom = 20
			},
			onRefresh() {
				this.getData(1)
			},
			loadMore() {
				let arr = ["NOTUSED", "USED", "EXPIRED"];
				if(arr[this.$parent.activeIndex] != this.type) return
				this.disabled = true;
				this.getData()
			},
			async getData(pageNo) {
				if(pageNo) this.pageNo = pageNo
				let res = await Http.post({
					url: Api.my.myCoupon,
					data: {
						couponStatus: this.type,
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
				let data = {}
				if(this.type == 'NOTUSED') {
					data.notUsed = datas.pageInfo.totalSize
				} else if(this.type == 'USED') {
					data.used = datas.pageInfo.totalSize
				} else if(this.type == 'EXPIRED') {
					data.expired = datas.pageInfo.totalSize
				}
				this.$parent.showTips(data)
				if(datas.list && datas.list.length > 0) {
					for(let value of datas.list) {
						value.couponAmount = Utils.formatCurrency(value.couponAmount)
						value.limitInvestAmount = Utils.formatCurrency(value.limitInvestAmount)
						value.expireTime = Utils.formatTimestamp({
							time: value.expireTime
						})
						value.type = this.type
					}
				}
				this.pageNo++;
				this.items = pageNo ? datas.list : this.items.concat(datas.list)
			}
		}
	}
</script>

<style scoped>
	.scroll {
		height: 94%;
		overflow-y: auto;
	}
	
	.couponlist {
		padding: 0.4rem 0.34rem 0;
		animation: fadeIn 1.6s;
	}
	
	.van-pull-refresh {
		height: 100%;
	}
</style>