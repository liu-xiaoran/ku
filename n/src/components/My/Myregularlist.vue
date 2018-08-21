<template>
	<div class="scroll">
		<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
			<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400" class="myregularlist">
				<div v-for="(item, index) in items" :key="item.id" class="holdBox" @click="toMyregularinfo(item.orderId,item.productInfo.detail.investCompactFile)">
					<div class="list-cell newBox" style="margin-bottom:0.53rem;">
						<div :class="['holdIcon',item.holdStatus=='TOCONFIRM'?'color1':item.holdStatus=='HOLDING'?'color2':'color3']">{{item.holdStatusCh}}</div>
						<div class="list-cell__bd productNames">{{item.productInfo.productName}}</div>
						<div class="list-cell__ft list-cell__ft_in-access">
							<span class="redShare" @click.stop="toShares(item.rewardInfo.rewardId)" v-if="item.rewardInfo&&item.rewardInfo.rewardStatus=='share'">发礼包</span>
							<span class="redShare" @click.stop="lingqu(item.orderId)" v-if="item.rewardInfo&&item.rewardInfo.rewardStatus=='valid'">领奖励</span>
						</div>
					</div>
					<ul v-if="item.holdStatus=='TOCONFIRM'">
						<li class="consText">
							<span>已确认金额</span>
							<span>{{item.orderAmount}}元</span>
						</li>
						<li class="consText">
							<span>预期收益</span>
							<span><span style="color:#e45038;">{{item.expectIncome}}</span>元</span>
						</li>
						<li class="consText">
							<span>产品预计计息日</span>
							<span>{{item.productInfo.expectDurationBegDate}}</span>
						</li>
					</ul>
					<ul v-if="item.holdStatus=='HOLDING'">
						<li class="consText">
							<span>投资金额</span>
							<span>{{item.orderAmount}}元</span>
						</li>
						<li class="consText">
							<span>预期收益</span>
							<span><span style="color:#e45038;">{{item.expectIncome}}</span>元</span>
						</li>
						<li class="consText">
							<span>到期日期</span>
							<span>{{item.productInfo.expectDurationEndDate}}</span>
						</li>
					</ul>
					<ul v-if="item.holdStatus=='CLEARED'">
						<li class="consText">
							<span>本息金额</span>
							<span><span style="color:#e45038;">{{item.payAmount}}</span>元</span>
						</li>
						<li class="consText">
							<span>产品计息日</span>
							<span>{{item.productInfo.ExpectDurationBegDate}}</span>
						</li>
						<li class="consText">
							<span>还本付息日</span>
							<span>{{item.closedTime}}</span>
						</li>
					</ul>
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
			<div class="empty-placeholder row-center" v-if="(!items||(items&&items.length<=0))&&type">
				<span class="ml20">暂无数据...</span>
			</div>
			<div class="toFinBox" v-if="(!items||(items&&items.length<=0))&&!type">
				<img class="zanwujilu" src="../../images/x/zanwujilu.png" />
				<span class="toFinText">暂无记录</span>
				<router-link class="toFinBtn" to="/pages/regular" replace>立即投资</router-link>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import { PullRefresh, Waterfall } from 'vant';
	export default {
		name: 'Myregularlist',
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		props: ['type'],
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
			toShares(shareId) {
				this.$emit('toShare',shareId)
			},
			async lingqu(orderId) {
				this.$emit('toLquBtn',orderId)
			},
			toMyregularinfo(oid,investCompactFile) {
				this.$router.push({
					path: `/myregularinfo?oid=${oid}&type=${investCompactFile}`
				})
			},
			creates() {
				if((this.items && this.items.length == 0) || !this.items) {
					this.getData(1)
					this.top = 1
					this.bottom = 20
				}
			},
			onRefresh() {
				this.getData(1)
			},
			loadMore() {
				let arr = ["", "HOLDING", "TOCONFIRM", "CLEARED"];
				if(arr[this.$parent.activeIndex] != this.type) return
				this.disabled = true;
				this.getData()
			},
			async getData(pageNo) {
				if(pageNo) this.pageNo = pageNo
				let res = await Http.post({
					url: Api.my.myRegular,
					data: {
						holdStatus: this.type,
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
			async onLoadxs(data, pageNo) {
				let datas = data
				this.$parent.showTips(datas)
				if(datas.list && datas.list.length > 0) {
					for(let value of datas.list) {
						if(value.holdStatus == 'TOCONFIRM') {
							value.orderAmount = Utils.formatCurrency(value.orderAmount)
							value.expectIncome = Utils.formatCurrency(value.expectIncome)
							value.productInfo.expectDurationBegDate = Utils.formatTimestamp({
								time: value.productInfo.expectDurationBegDate,
								showtime: true
							})
						} else if(value.holdStatus == 'HOLDING') {
							value.orderAmount = Utils.formatCurrency(value.orderAmount)
							value.expectIncome = Utils.formatCurrency(value.expectIncome)
							value.productInfo.expectDurationEndDate = Utils.formatTimestamp({
								time: value.productInfo.expectDurationEndDate,
								showtime: true
							})
						} else if(value.holdStatus == 'CLEARED') {
							value.payAmount = Utils.formatCurrency(value.payAmount)
							value.productInfo.ExpectDurationBegDate = Utils.formatTimestamp({
								time: value.productInfo.ExpectDurationBegDate,
								showtime: true
							})
							value.closedTime = Utils.formatTimestamp({
								time: value.closedTime,
								showtime: true
							})
						}
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
	.scroll {
		/*height: 70.5%;*/
		overflow-y: auto;
	}
	
	.myregularlist {
		animation: fadeIn 1.6s;
	}
	
	.holdBox {
		width: 100%;
		background: #fff;
		margin-bottom: 0.26rem;
		overflow: hidden;
		display: block;
		text-decoration: none;
	}
	
	.consText {
		padding: 0 0.46rem;
		margin-bottom: 0.26rem;
		display: flex;
		justify-content: space-between;
		align-content: center;
		.font-dpr(28);
		color: #a6a6a6;
	}
	
	.consText span:last-child {
		color: #3b3b3b;
	}
	
	.holdIcon {
		.font-dpr(22);
		line-height: 0.29rem;
		padding: 0.05rem 0.13rem;
		border-radius: 200px;
		margin-right: 0.1rem;
	}
	
	.color1 {
		border: 0.02rem solid #77acd9;
		color: #77acd9;
	}
	
	.color2 {
		border: 0.02rem solid #f6903d;
		color: #f6903d;
	}
	
	.color3 {
		border: 0.02rem solid #8bb472;
		color: #8bb472;
	}
	
	.toFinBox {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.toFinText {
		color: #a6a6a6;
		.font-dpr(26);
		margin-bottom: 22%;
	}
	
	.toFinBtn {
		width: 4rem;
		height: 0.93rem;
		line-height: 0.93rem;
		.font-dpr(30);
		color: #fff;
		text-align: center;
		background: #e45038;
		border-radius: 0.1rem;
		display: block;
		text-decoration: none;
	}
	
	.productNames {
		.font-dpr(28);
		line-height: 0.37rem;
	}
	
	.zanwujilu {
		width: 4.32rem;
		margin: 2.5rem 0 0.3rem;
	}
	
	.redShare {
		height: 0.58rem;
		line-height: 0.58rem;
		display: inline-block;
		color: #fff;
		background: #e45038;
		border-radius: 200px;
		.font-dpr(26);
		padding: 0 0.2rem;
		margin-right: 0.3rem;
	}
</style>