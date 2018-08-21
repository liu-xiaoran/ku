<template>
	<div class="mysurprised">
		<ul class="surpHeader">
			<li class="surpBox">
				<span>{{nums.totalGetNum}}</span>
				<p>共获得礼包(个)</p>
			</li>
			<li class="linesd"></li>
			<li class="surpBox">
				<span>{{nums.totalReceivedNum}}</span>
				<p>被领取礼包(个)</p>
			</li>
		</ul>
		<div class="scroll">
			<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
				<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400" class="couponlist">
					<div v-for="(item,index) in items">
						<Coupon v-on:toggleDialogs="toggleDialogs" :item="item" />
					</div>
				</div>
				<div class="weui-loadmore" v-if="!reachBottom">
					<div class="weui-loading"></div>
					<div class="weui-loadmore__tips">正在加载</div>
				</div>
				<!--触底提示-->
				<div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-if="items&&items.length>0 && reachBottom">
					<div class="weui-loadmore__tips weui-loadmore__tips_in-line">仅显示最近30天内的礼包</div>
				</div>
				<div class="empty-placeholder row-center" v-if="(!items||(items&&items.length<=0))">
					<!--<span class="ml20">暂无数据...</span>-->
					<img class="wulibao" src="../../images/x/wulibao.png" />
					<p class="wulibaoText">您暂无投资惊喜礼包~</p>
					<p class="wulibaoText">现在投资有机会拿投资惊喜礼包哦！</p>
					<router-link class="toFinBtn" to="/pages/regular" replace>立即投资</router-link>
				</div>
			</van-pull-refresh>
		</div>
		<div :class="['zan-dialog',showDialogs ? 'zan-dialog--show' : '']" @touchmove.prevent>
			<div :class="['zan-dialog__mask',opens ? 'weui-animate-fade-in' : 'weui-animate-fade-out']">
				<div :animation="animationDatas" class="zan-dialog__container">
					<v-touch class="share_box" @tap="toggleDialogs">
						<img class="jiantou" src="../../images/x/arrow.png" />
						<p class="dianji">点击右上角分享</p>
					</v-touch>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import { PullRefresh, Waterfall } from 'vant';
	import Coupon from '../../components/My/Coupon';
	export default {
		name: 'Mysurprised',
		directives: {
			WaterfallLower: Waterfall('lower')
		},
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
				headHeight: lib.flexible.rem2px(1.3),
				nums: {
					totalGetNum: 0,
					totalReceivedNum: 0
				},
				showDialogs: false,
				opens: false,
				animationDatas: {
					duration: 200,
					timingFunction: 'ease'
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
			toggleDialogs() {
				this.opens = !this.opens
				if(this.showDialogs) {
					let time = setTimeout(() => {
						this.showDialogs = !this.showDialogs
						clearTimeout(time)
					}, 500);
				} else {
					this.showDialogs = !this.showDialogs
				}
			},
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
					url: Api.my.investRewardList,
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
				this.nums = {
					totalGetNum: res.totalGetNum,
					totalReceivedNum: res.totalReceivedNum
				}
				let datas = res
				if(datas.list && datas.list.length > 0) {
					for(let value of datas.list) {
						value.expireTime = Utils.formatTimestamp({
							time: value.expireTime
						})
					}
				}
				this.pageNo++;
				this.items = pageNo ? datas.list : this.items.concat(datas.list)
			}
		},
		created() {
			this.getData(1)
			this.top = 1
			this.bottom = 20
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	@import "../../style/widget/weui-animate/weui-animate.less";
	.mysurprised {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.surpHeader {
		width: 100%;
		height: 13%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: #fff;
		margin-bottom: 0.38rem;
	}
	
	.surpBox {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.surpBox span {
		.font-dpr(44);
		color: #3b3b3b;
		font-weight: 600;
		margin-bottom: 0.28rem;
	}
	
	.surpBox p {
		.font-dpr(26);
		color: #a6a6a6;
	}
	
	.linesd {
		width: 0.02rem;
		height: 1.06rem;
		background: #dfdfdf;
	}
	
	.scroll {
		width: 100%;
		height: 87%;
		overflow-y: auto;
	}
	
	.couponlist {
		padding: 0 0.34rem;
	}
	
	.zan-dialog {
		width: 100%;
		height: 100%;
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
	
	.zan-dialog__mask {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		background: rgba(0, 0, 0, 0.4);
	}
	
	.zan-dialog__container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.share_box {
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.jiantou {
		width: 3.94rem;
		height: 3.9rem;
		position: absolute;
		top: 0.32rem;
		right: 1rem;
	}
	
	.dianji {
		padding: 4.54rem 0 0 5.81rem;
		color: #fff;
		.font-dpr(30);
	}
	
	.empty-placeholder {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	
	.wulibao {
		width: 4.32rem;
		margin-bottom: 0.3rem;
	}
	
	.wulibaoText {
		.font-dpr(26);
		color: #a6a6a6;
		margin-bottom: 0.26rem;
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
		margin-top: 21%;
	}
</style>