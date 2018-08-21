<style lang="less" scoped>
	@import "../../style/base/mixin/rpx.less";
	@import "../../style/utils.less";
	.all {
		.font-dpr(32);
		height: 100%;
		background: #fff;
	}
	
	.top {
		.calc-rpx(height, 500*0.013rem);
		background: linear-gradient(#f05151, #ea7273);
		.img {
			color: #fff;
			line-height: 164*0.013rem;
			font-size: 171*0.013rem;
		}
		color:#fff;
		display:flex;
		flex-direction: column;
		justify-content:center;
		align-items:center;
		.box {
			height: 280*0.013rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
		}
	}
	
	.a-center {
		width: 93.8%;
		margin-left: auto;
		margin-right: auto;
		margin-top: 44*0.013rem;
		box-sizing: border-box;
		.calc-rpx(height, 600*0.013rem);
		.row {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 78*0.013rem;
			.col:first-child {
				color: #a6a6a6
			}
			.line {
				width: 39%;
				height: .5*0.013rem;
				background-color: #d2d2d2;
			}
		}
	}
	
	.b-center {
		.calc-rpx-1242(margin-top, 104*0.013rem);
		display: flex;
		flex-direction: row;
		.box {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 5.15rem;
		}
		.row {
			.col:nth-child(2) {
				color: #a6a6a6
			}
		}
		.img {
			.calc-rpx-1242(margin-top, 10*0.013rem);
			.calc-rpx-1242(width, 57*0.013rem);
			.calc-rpx-1242(margin-left, 130*0.013rem);
			.calc-rpx-1242(margin-right, 37*0.013rem);
		}
	}
	
	.iconList {
		width: 38*0.013rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		.calc-rpx-1242(margin-top, 10*0.013rem);
		.calc-rpx-1242(margin-left, 130*0.013rem);
		.calc-rpx-1242(margin-right, 37*0.013rem);
	}
	
	.circles {
		width: 38*0.013rem;
		height: 38*0.013rem;
		background-color: #fff;
		border: 3*0.013rem solid #e45038;
		border-radius: 200px;
		box-sizing: border-box;
	}
	
	.circlescon {
		border: none;
		background-color: #ee5d5d;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		line-height: 38*0.013rem;
	}
	
	.lines {
		width: 3*0.013rem;
		height: 124*0.013rem;
		background-color: #d4d4d4;
	}
	
	.icon-gou {
		font-size: 23*0.013rem;
	}
	
	.jingxiBox {
		width: 8.41rem;
		height: 2.94rem;
		margin: 0.8rem auto 0;
		overflow: hidden;
		position: relative;
	}
	
	.jingxiBoxCon {
		width: 100%;
		height: 100%;
		border: 0.02rem solid #e16550;
		background: #fff1f1;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.cricle {
		width: 0.28rem;
		height: 0.28rem;
		border: 0.02rem solid #e16550;
		border-radius: 200px;
		background: #fff;
		position: absolute;
		top: 1.33rem;
	}
	
	.hdTite {
		padding-bottom: 0.44rem;
		width: 6.4rem;
		border-bottom: 0.02rem dashed #f9a79a;
	}
	
	.hdTites {
		text-align: center;
		color: #e26a56;
		font-weight: 600;
		.font-dpr(40);
	}
	
	.hqBtn {
		width: 2.6rem;
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		color: #fff;
		.font-dpr(28);
		background: #e45038;
		border-radius: 0.1rem;
		margin-top: 0.26rem;
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
<template>
	<div class="all">
		<div class="top">
			<div class="box">
				<div class="img iconfont icon-gou1"></div>
				<span>{{topText}}成功</span>
			</div>
		</div>
		<div class="a-center" v-if="showtop2">
			<div class="row">
				<div class="line"></div>
				<div class="txt">{{topText=="申购"?"投资":topText}}详情</div>
				<div class="line"></div>
			</div>
			<div class="row" v-for="(item, index) in list">
				<div class="col" v-for="(j, index) in item">{{j}}</div>
			</div>
			<div class="jingxiBox" v-if="isJl!=-1">
				<div class="jingxiBoxCon">
					<p class="hdTite hdTites">获得投资奖励!</p>
					<v-touch class="hqBtn" v-if="isJl==0" @tap="toLquBtn">领取奖励</v-touch>
					<div class="hqBtn" v-if="isJl==1" style="background:#ffafa2;">奖励已领取</div>
				</div>
				<p class="cricle" style="left: -0.14rem;"></p>
				<p class="cricle" style="right: -0.14rem;"></p>
			</div>
		</div>
		<div class="b-center" v-if="!showtop2">
			<div class="iconList">
				<div class="circles circlescon">
					<div class="iconfont icon-gou"></div>
				</div>
				<div class="lines"></div>
				<div class="circles"></div>
				<div class="lines"></div>
				<div class="circles"></div>
			</div>
			<div class="box">
				<div class="row" v-for="(item, index) in list">
					<div class="col" v-for="(j, index) in item">{{j}}</div>
				</div>
			</div>
		</div>
		<div class="btn-area">
			<button class="comBtn" @click="submit">完成</button>
		</div>
		<div :class="['zan-dialog',showDialog ? 'zan-dialog--show' : '']">
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
							<v-touch class="qdBtns" v-if="!types&&isWx" @tap="toShare">分享给好友</v-touch>
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
		<logBase></logBase>
	</div>
</template>
<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils'
	import logBase from '../logBase';
	let result;
	export default {
		data() {
			return {
				showDialog: false,
				open: false,
				animationData: {
					duration: 200,
					timingFunction: 'ease'
				},
				topText: "",
				showtop2: false,
				list: [],
				isJl: -1,
				isShare: false,
				isWx: false,
				htmls: '',
				types: '',
				ucId: ""
			};
		},
		components: {
			logBase
		},
		methods: {
			toMycouponDetails() {
				this.$router.replace({
					path: `/mycoupondetails?uId=${this.ucId}`
				})
			},
			submit() {
				this.$router.replace({
					path: "/pages/my"
				})
			},
			toShare() {
				this.isShare = true
			},
			async weShare(shareId) {
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
				}
			},
			async toLquBtn() {
				let res = await Http.post({
					url: Api.receiveRewardForInvest,
					data: {
						orderId: result.orderId
					}
				});
				if(res.code == 10000) {
					this.htmls = res.data.rewardDesc;
					if(res.data.rewardType == "voucher") {
						this.ucId = res.data.rewardId
						this.types = true
					} else if(res.data.rewardType == "redpacket") {
						if(/micromessenger/.test(navigator.userAgent.toLowerCase()) == true) {
							this.isWx = true
							this.weShare(res.data.rewardId)
						} else {
							this.isWx = false
						}
						this.types = false
					}
					this.toggleDialog()
				}
			},
			toggleDialog() {
				this.open = !this.open
				if(this.showDialog) {
					let time = setTimeout(() => {
						this.showDialog = !this.showDialog
						if(this.isShare) {
							this.isShare = false
						}
						clearTimeout(time)
					}, 500);
				} else {
					this.showDialog = !this.showDialog
				}
			},
			async rewardStatus(orderId) {
				let res = await Http.post({
					url: Api.rewardStatusForInvest,
					data: {
						orderId: orderId
					}
				});
				if(res.code == 10000) {
					for(let i = 0; i < res.data.length; i++) {
						if(res.data[i].orderId == orderId) {
							if(res.data[i].status == 0) {
								this.isJl = 0
							} else if(res.data[i].status == 1) {
								this.isJl = 1
							}
						}
					}
				}
			}
		},
		created() {
			result = this.$getPreloadData("result");
			// const result={
			//   "orderId": 4252762,
			//   "orderStatus": "CONFIRMED",
			//   "orderStatusCh": "成功",
			//   "productName": "掌薪宝1期",
			//   "orderAmount": 100,
			//   "expectInterestDate": 1508083200000,
			//   "expectViewIncomeDate": 1508169600000
			// }
			console.log(result)
			if(result.router && result.router == "buy") {
				this.topText = "申购"
				this.showtop2 = result.productType == 'REGULAR' //定期or掌薪宝
				if(this.showtop2) {
					this.list = [
						["产品名称", result.productName],
						["投资金额", Utils.formatCurrency(result.orderAmount) + "元"]
					]
					this.rewardStatus(result.orderId)
				} else {
					this.list = [
						[result.productName, Utils.formatCurrency(result.orderAmount) + "元"],
						["开始计算收益", Utils.formatTimestamp({
							time: result.expectInterestDate
						})],
						["查看收益", Utils.formatTimestamp({
							time: result.expectViewIncomeDate
						})]
					]
				}
			} else {
				this.topText = "转出"
				this.showtop2 = true
				this.list = [
					["转出金额", Utils.formatCurrency(result.orderAmount) + "元"],
					["转出手续费", Utils.formatCurrency(result.redeemFee) + "元"],
					["转出时间", Utils.formatTimestamp({
						time: result.createTime
					})],
					["预计到账", Utils.formatTimestamp({
						time: result.redeemDate
					})]
				]
			}
		}
	}
</script>