<template>
	<div>
		<div v-if="!item.rewardType" :class="['coupon-box','coupon-box-'+(!item.type||item.type=='NOTUSED'?item.couponType:'gray')]">
			<div class="coupon-box-t"></div>
			<div class="coupon-title">
				<div class="coupon-title-1">
					<span class="coupon-title-name">{{item.name}}</span>
					<div class="coupon-type">{{item.couponTypeCh}}</div>
				</div>
				<div class="coupon-title-2" v-if="item.couponType=='RATECOUPON'">
					<span class="rmb">+ </span><span class="num">{{item.couponAmount}}%</span>
				</div>
				<div class="coupon-title-2" v-else>
					<span class="rmb">¥ </span><span class="num">{{item.couponAmount}}</span>
				</div>
			</div>
			<div class="coupon-content">
				<div>仅限投资{{item.limitLabels}}</div>
				<div :class="['coupon-content-two',item.couponType=='REDPACKETS'?'white':'']">满{{item.limitInvestAmount}}元使用</div>
				<div class="coupon-btnbox">
					<span class="grey">有效期至:{{item.expireTime}}</span>
					<v-touch class="button" @tap="showRedPacket(item.ucId)" v-if="item.couponType=='REDPACKETS'&&item.type&&item.type=='NOTUSED'">点击领取</v-touch>
					<slot></slot>
				</div>
			</div>
		</div>
		<div v-else :class="['coupon-box','coupon-box-'+(item.canShare?item.rewardType:'gray')]">
			<div class="coupon-box-t"></div>
			<div class="coupon-title">
				<div class="coupon-title-1">
					<span class="coupon-title-name">{{item.rewardName}}</span>
				</div>
				<v-touch class="rewardBtn" @tap="toShare(item.rewardId)" v-if="item.canShare">立即分享</v-touch>
				<p class="rewardBtn" v-else>已过期</p>
			</div>
			<div class="coupon-content">
				<div class="rewardNum">已被领取{{item.receiveNum}}个，剩余{{item.laveNum}}个</div>
				<div class="rewardTime">有效期至: {{item.expireTime}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Tips from '../../utils/Tips';
	export default {
		name: 'Coupon',
		props: ['item'],
		data() {
			return {

			}
		},
		methods: {
			async toShare(shareId) {
				if(/micromessenger/.test(navigator.userAgent.toLowerCase()) == true) {
					let res = await Http.post({
						url: Api.getShareParams,
						data: {
							type: 'InvestSurprise',
							shareId: shareId
						}
					});
					if(res.code == 10000) {
						let datas = {
							data: {
								imgUrl: res.data.imgUrl,
								title: res.data.title,
								desc: res.data.description,
								link: res.data.targetUrl
							},
							timelineData: {
								imgUrl: res.data.imgUrl,
								title: res.data.title,
								link: res.data.targetUrl
							}
						}
						global.wechatShare.shareToTimeline(datas);
						global.wechatShare.shareToFriend(datas);
						this.$emit('toggleDialogs');
					}
				} else {
					Tips.alert('请到APP进行分享!')
				}
			},
			async showRedPacket(ucId) {
				let res = await Http.post({
					url: Api.my.useRedPacket,
					data: {
						ucId: ucId
					}
				})
				if(res.code == 10000) {
					global.vue.$emit('changeOverd')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.coupon-box-voucher .coupon-box-t {
		background: #e45038;
	}
	
	.coupon-box-redpacket .coupon-box-t {
		background: #a16bb1;
	}
	
	.coupon-box-voucher .coupon-title-name {
		color: #e45038;
	}
	
	.coupon-box-redpacket .coupon-title-name {
		color: #a16bb1;
	}
	
	.coupon-box-gray .coupon-title-name {
		color: #a6a6a6;
	}
	
	.rewardNum {
		.font-dpr(32);
		color: #3b3b3b;
	}
	
	.rewardTime {
		.font-dpr(24);
		color: #a6a6a6;
		margin-top: 0.2rem;
	}
	
	.rewardBtn {
		width: 1.74rem;
		height: 0.5rem;
		text-align: center;
		color: #fff;
		line-height: 0.5rem;
		.font-dpr(24);
		background: #e45038;
		border-radius: 200px;
	}
	
	.coupon-box-gray .rewardBtn {
		background: #a6a6a6;
	}
</style>