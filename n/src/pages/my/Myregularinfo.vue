<template>
	<div class="myregularinfo" v-if="message.productInfo">
		<div class="list-cell newBox" style="margin-bottom:0.26rem;">
			<div class="list-cell__bd textcons">{{message.productInfo.productName}}</div>
		</div>
		<div class="consText">
			<span>投资金额</span>
			<span>{{message.orderAmount}}元</span>
		</div>
		<div class="consText">
			<span>预期收益</span>
			<span><span style="color:#e45038;">{{message.expectIncome}}</span>元</span>
		</div>
		<div class="consText">
			<span>历史年化收益率</span>
			<span>{{message.productInfo.baseRate+'+'+message.productInfo.rewardRate}}</span>
		</div>
		<div class="consText">
			<span>产品计息日</span>
			<span>{{message.productInfo.expectDurationBegDate}}</span>
		</div>
		<div class="consText">
			<span>投资期限</span>
			<span>{{message.productInfo.durationPeriodDays+message.productInfo.durationPeriodTypeCh}}</span>
		</div>
		<div class="consText">
			<span>产品到期日</span>
			<span>{{message.productInfo.expectDurationEndDate}}</span>
		</div>
		<div class="consText">
			<span>还款方式</span>
			<span>{{message.productInfo.payBackTypeCh}}</span>
		</div>
		<a :href="'/actives1/static/protocolDetail?type=regular_dingxiang&pid='+message.productInfo.productId+'&orderId='+message.orderId+'&t='+new Date().getTime()" class="consText">
			<div class="list-cell__bd" style="color:#93b7ce;line-height: 0.58rem" v-text="texts"></div>
			<div class="list-cell__ft list-cell__ft_in-access"></div>
		</a>
		<v-touch @tap="toShare(message.rewardInfo.rewardId)" class="iconImgs" v-if="message.rewardInfo&&message.rewardInfo.rewardStatus=='share'">
			<img src="../../images/x/falibao.png" />
		</v-touch>
		<v-touch @tap="toLquBtn(oid)" class="iconImgs" v-if="message.rewardInfo&&message.rewardInfo.rewardStatus=='valid'">
			<img src="../../images/x/linjiangli.png" />
		</v-touch>
		<div :class="['zan-dialog',showDialog ? 'zan-dialog--show' : '']" @touchmove.prevent>
			<div :class="['zan-dialog__mask',open ? 'weui-animate-fade-in' : 'weui-animate-fade-out']">
				<div :animation="animationData" class="zan-dialog__container">
					<div class="lqContent" v-if="!isShare">
						<v-touch @tap="toggleDialog" class="sucClose iconfont icon-cha1"></v-touch>
						<img v-if="types" class="lqImg" src="../../images/x/jingxiquan.png" />
						<img v-if="!types" class="lqImg" src="../../images/x/jingxilibao.png" />
						<div class="lqContentBox">
							<p class="text1">恭喜您</p>
							<p class="text2" v-text="htmls"></p>
							<v-touch class="qdBtns" v-if="types" @tap="toMycouponDetails">确定</v-touch>
							<v-touch class="qdBtns" v-if="!types&&isWx" @tap="toggleDialog(true)">分享给好友</v-touch>
							<p class="text3" v-if="!types&&!isWx">请到APP进行分享!</p>
						</div>
					</div>
					<v-touch class="share_box" v-if="isShare" @tap="toggleDialog">
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
	import Tips from '../../utils/Tips';
	export default {
		name: 'Myregularinfo',
		data() {
			return {
				showDialog: false,
				open: false,
				animationData: {
					duration: 200,
					timingFunction: 'ease'
				},
				isShare: false,
				isWx: false,
				htmls: '',
				types: '',
				message: '',
				texts: '',
				oid: '',
				ucId: ''
			}
		},
		methods: {
			toMycouponDetails() {
				this.$router.push({
					path: `/mycoupondetails?uId=${this.ucId}`
				})
			},
			async toLquBtn(orderId) {
				let res = await Http.post({
					url: Api.receiveRewardForInvest,
					data: {
						orderId: orderId
					}
				});
				if(res.code == 10000) {
					this.htmls = res.data.rewardDesc;
					if(res.data.rewardType == "voucher") {
						this.ucId = res.data.rewardId
						this.types = true
					} else if(res.data.rewardType == "redpacket") {
						this.types = false
						if(/micromessenger/.test(navigator.userAgent.toLowerCase()) == true) {
							this.isWx = true
							this.toShare(res.data.rewardId, true)
						} else {
							this.isWx = false
						}
					}
					this.toggleDialog(false)
				}
			},
			async toShare(shareId, tys) {
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
						if(!tys) {
							this.toggleDialog(true);
						}
					}
				} else {
					Tips.alert('请到APP进行分享!')
				}
			},
			toggleDialog(type) {
				if(!Utils.tapHandler()) {
					return
				}
				this.open = !this.open
				if(this.showDialog) {
					let time = setTimeout(() => {
						this.showDialog = !this.showDialog
						if(!type && this.isShare) {
							this.isShare = false
						}
						clearTimeout(time)
					}, 500);
				} else {
					this.isShare = type
					this.showDialog = !this.showDialog
				}
			},
			async myRegularInfos(orderId) {
				let res = await Http.post({
					url: Api.my.myRegularInfo,
					data: {
						orderId: orderId
					}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.orderId = orderId
					datas.orderAmount = Utils.formatCurrency(datas.orderAmount)
					datas.expectIncome = Utils.formatCurrency(datas.expectIncome)
					datas.productInfo.baseRate = Utils.formatFloatCurrency(datas.productInfo.baseRate) + '%'
					datas.productInfo.rewardRate = Utils.formatFloatCurrency(datas.productInfo.rewardRate) + '%'
					datas.productInfo.expectDurationBegDate = Utils.formatTimestamp({
						time: datas.productInfo.expectDurationBegDate,
						showtime: true
					})
					datas.productInfo.expectDurationEndDate = Utils.formatTimestamp({
						time: datas.productInfo.expectDurationEndDate,
						showtime: true
					})
					this.message = datas
				}
			}
		},
		created() {
			this.oid = this.$route.query.oid
			this.myRegularInfos(this.$route.query.oid)
			if(this.$route.query.type >= 136) {
				this.texts = '《借款协议》'
			} else {
				this.texts = '《定向委托投资协议》'
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.myregularinfo {
		width: 100%;
		background: #fff;
		overflow: hidden;
		position: relative;
	}
	
	.consText {
		padding: 0 0.46rem;
		margin-bottom: 0.26rem;
		display: flex;
		justify-content: space-between;
		align-content: center;
		.font-dpr(28);
		color: #a6a6a6;
		text-decoration: none;
	}
	
	.consText text:last-child {
		color: #3b3b3b;
	}
	
	.list-cell__ft_in-access::after {
		margin-top: 0.2rem;
	}
	
	.list-cell__ft_in-access {
		height: 0.58rem;
		line-height: 0.58rem;
	}
	
	.textcons {
		.font-dpr(28);
	}
	
	.iconImgs {
		width: 1.96rem;
		position: fixed;
		right: 2%;
		top: 48%;
	}
	
	.iconImgs img {
		width: 100%;
	}
	
	.zan-dialog {
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
	
	.zan-dialog--show .display__none {
		display: block;
	}
	
	.lqContent {
		width: 6.3rem;
		height: 7.49rem;
		position: relative;
	}
	
	.lqImg {
		width: 100%;
		height: 100%;
	}
	
	.lqContentBox {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
	
	.text1 {
		.font-dpr(34);
		color: #3b3b3b;
		margin-bottom: 0.4rem;
	}
	
	.text2 {
		.font-dpr(34);
		color: #e45038;
		margin-bottom: 0.6rem;
	}
	
	.text3 {
		.font-dpr(34);
		color: #e45038;
		margin-bottom: 0.74rem;
	}
	
	.qdBtns {
		width: 4.41rem;
		height: 0.96rem;
		line-height: 0.96rem;
		text-align: center;
		color: #fff;
		background: #e45038;
		border-radius: 0.1rem;
		.font-dpr(30);
		margin-bottom: 0.74rem;
	}
	
	.sucClose {
		width: 0.58rem;
		height: 0.58rem;
		position: absolute;
		right: -0.4rem;
		top: -1.82rem;
		padding: 0.4rem;
		color: #fff;
		line-height: 0.58rem;
		.font-dpr(46);
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
</style>