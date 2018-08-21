<template>
	<van-pull-refresh v-model="isLoading" :headHeight="headHeight">
		<div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="400" class="letter">
			<div :class="['navtor',item.isRead=='is'?'gray':'']" v-for="(item,index) in items" :key="item.id">
				<v-touch class="conLists" @tap="toView(item.id)">
					<div class="conTitle">
						<span class="msgTitle">{{item.msgTitle}}</span>
						<span>{{item.createTime}}</span>
					</div>
					<div class="conContent">{{item.msgContent}}</div>
				</v-touch>
				<v-touch class="list-cell" @tap="toPages(item.id,item.transmission)">
					<div class="list-cell__bd" v-if="!item.transmission||(item.transmission&&!item.transmission.type)">查看详情</div>
					<div class="list-cell__bd" v-if="item.transmission&&item.transmission.type=='couponRecord'">查看优惠券</div>
					<div class="list-cell__bd" v-if="item.transmission&&item.transmission.type=='moneyRecord'">查看资金记录</div>
					<div class="list-cell__ft list-cell__ft_in-access"></div>
				</v-touch>
			</div>
			<div class="models" v-if="animate=='scaled'" @touchend="noShow" @touchmove.prevent></div>
			<div :class="['modelList',animate]" @touchmove.prevent>
				<div class="triangle-inner"></div>
				<v-touch :key="item.id" v-for="(item,index) in letterType" :class="['typeName',(letterType.length!=index+1)?'newBox':'']" @tap="upShow(item.typeCode)">{{item.typeName}}</v-touch>
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
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import { PullRefresh, Waterfall } from 'vant';
	export default {
		name: 'Letter',
		directives: {
			WaterfallLower: Waterfall('lower')
		},
		props: ['animate'],
		data() {
			return {
				type: '',
				isLoading: false,
				items: [],
				letterType: [],
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
			toPages(id,transmission) {
				if(!transmission||(transmission&&!transmission.type)) {
					this.toView(id)
				} else if(transmission&&transmission.type=='couponRecord') {
					this.views(id,'mycouponlist')
				} else if(transmission&&transmission.type=='moneyRecord') {
					this.views(id,'depositRecord')
				}
			},
			async views(id,url) {
				let res = await Http.post({
					url: Api.my.letterView,
					data: {
						id: id
					}
				})
				if(res.code == 10000) {
					this.$router.push({
						path: url
					})
				}
			},
			toView(id) {
				this.$router.push({
					path: `/letterview?id=${id}`
				})
			},
			noShow() {
				this.$parent.changeModels()
			},
			upShow(type) {
				this.type = type
				this.getData(1)
				this.top = 1
				this.bottom = 20
				this.$parent.changeModels()
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
					url: Api.my.letterList,
					data: {
						typeCode: this.type,
						pageInfo: {
							pageNo: this.pageNo,
							pageSize: this.pageSize
						}
					},
					extendInfo: ['LetterType']
				})
				this.isLoading = false; //结束下拉刷新
				this.disabled = false; //结束上拉
				if(this.pageNo >= res.data.pageInfo.totalPage) {
					this.reachBottom = true;
					this.disabled = true; //禁用上拉加载更多
				} else {
					this.reachBottom = false;
				}
				if(res.code == 10000) {
					this.onLoadxs(res, pageNo)
				}
			},
			onLoadxs(res, pageNo) {
				let datas = res.data
				if(!(this.letterType && this.letterType.length > 0)) {
					datas.letterType = [{
						typeCode: '',
						typeName: '全部'
					}].concat(res.extendInfo.LetterType)
					this.letterType = datas.letterType
				}
				if(datas.list) {
					for(let value of datas.list) {
						value.createTime = Utils.formatTimestamp({
							time: value.createTime
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
	.letter {
		animation: fadeIn 1.6s;
	}
	
	.navtor {
		width: 100%;
		background-color: #fff;
		margin-bottom: 0.26rem;
		color: #3b3b3b;
	}
	
	.conLists {
		width: 94%;
		display: flex;
		flex-direction: column;
		padding: 0 3%;
	}
	
	.conTitle {
		width: 100%;
		margin: 0.49rem 0 0.34rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.font-dpr(24);
	}
	
	.msgTitle {
		max-width: 65%;
		.font-dpr(30);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.conContent {
		width: 100%;
		.font-dpr(26);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		margin-bottom: 0.48rem;
		line-height: 0.61rem;
	}
	
	.list-cell {
		height: 1.01rem;
		border-top: 0.01rem solid #dfdfdf;
	}
	
	.list-cell__bd {
		.font-dpr(24);
	}
	
	.gray,
	.gray .list-cell {
		color: #a6a6a6;
	}
	
	.models {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 30;
	}
	
	.modelList {
		position: fixed;
		right: 10px;
		top: 0.4rem;
		z-index: 50;
		width: 45%;
		background-color: #fff;
		border: 0.01rem solid #dfdfdf;
		box-shadow: 0 0 0.4rem 0.13rem #d4d4d4;
		transform-origin: 100% 0;
		transform: scale(0);
		opacity: 0;
	}
	
	.triangle-inner {
		content: " ";
		position: absolute;
		right: 6%;
		top: -0.16rem;
		width: 0.26rem;
		height: 0.26rem;
		border: 0.01rem solid #dfdfdf;
		border-left: 0;
		border-bottom: 0;
		-webkit-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		transform: rotate(-45deg);
		background: #fff;
		z-index: 50;
	}
	
	.scaled {
		animation: scales 0.6s;
		transform: scale(1);
		opacity: 1;
	}
	
	.enlarges {
		animation: enlarge 0.6s;
		transform: scale(0);
		opacity: 0;
	}
	
	@-webkit-keyframes scales {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	@-webkit-keyframes enlarge {
		from {
			transform: scale(1);
			opacity: 1;
		}
		to {
			transform: scale(0);
			opacity: 0;
		}
	}
	
	.typeName {
		color: #3b3b3b;
		.font-dpr(28);
		margin: 0 0.26rem;
		padding: 0.26rem 0;
	}
</style>