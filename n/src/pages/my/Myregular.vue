<template>
	<div class="myregular">
		<div class="weui-tab">
			<div class="headerBox">
				<div class="numBox">
					<span class="nums numss">{{message.expectIncome||'0.00'}}</span>
					<span class="texts">预期待收收益(元)</span>
				</div>
				<div class="headerTwo">
					<div class="numBox list-cell__bd">
						<span class="nums">{{message.investAmount||'0.00'}}</span>
						<span class="texts">在投本金(元)</span>
					</div>
					<div class="list-cell__bd"></div>
					<div class="numBox list-cell__bd">
						<span class="nums">{{message.totalIncome||'0.00'}}</span>
						<span class="texts">累计收益(元)</span>
					</div>
				</div>
			</div>
			<div class="weui-navbars">
				<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__item',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
					<div class="weui-navbar__title">{{item}}</div>
				</v-touch>
				<div class="weui-navbar__slider" id="lineMove" style="left: 0"></div>
			</div>
		</div>
		<Myregularlist1 v-on:toShare="toShare" v-on:toLquBtn="toLquBtn" type="" ref="edit0" v-show="activeIndex == 0" />
		<Myregularlist2 v-on:toShare="toShare" v-on:toLquBtn="toLquBtn" type="HOLDING" ref="edit1" v-show="activeIndex == 1" />
		<Myregularlist3 v-on:toShare="toShare" v-on:toLquBtn="toLquBtn" type="TOCONFIRM" ref="edit2" v-show="activeIndex == 2" />
		<Myregularlist4 v-on:toShare="toShare" v-on:toLquBtn="toLquBtn" type="CLEARED" ref="edit3" v-show="activeIndex == 3" />
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
		<logBase></logBase>
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import Tips from '../../utils/Tips';
	import Myregularlist from '../../components/My/Myregularlist';
	import logBase from '../logBase';
	export default {
		name: 'Myregular',
		components: {
			Myregularlist1: Myregularlist,
			Myregularlist2: Myregularlist,
			Myregularlist3: Myregularlist,
			Myregularlist4: Myregularlist,
			logBase
		},
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
				tabs: ['全部(0)', '计息中(0)', '待计息(0)', '已结清(0)'],
				activeIndex: 0,
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
							this.toShare(res.data.rewardId,true)
						} else {
							this.isWx = false
						}
					}
					this.toggleDialog(false)
				}
			},
			async toShare(shareId,tys) {
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
						if(!type&&this.isShare) {
							this.isShare = false
						}
						clearTimeout(time)
					}, 500);
				} else {
					this.isShare = type
					this.showDialog = !this.showDialog
				}
			},
			tabClick(id) {
				if(id == 1) {
					this.$refs.edit1.creates();
				} else if(id == 2) {
					this.$refs.edit2.creates();
				} else if(id == 3) {
					this.$refs.edit3.creates();
				}
				document.getElementById("lineMove").style.transform = `translateX(${Utils.Fmul(id,100)}%)`;
				document.getElementById("lineMove").style.webkitTransform = `translateX(${Utils.Fmul(id,100)}%)`;
				this.activeIndex = id
			},
			showTips(data) {
				this.message = {
					expectIncome: Utils.formatCurrency(data.expectIncome),
					investAmount: Utils.formatCurrency(data.investAmount),
					totalIncome: Utils.formatCurrency(data.totalIncome)
				}
				let array = [data.allNum, data.holdingNum, data.toConfirmNum, data.closedNum]
				for(let [index, value] of new Map(this.tabs.map((item, i) => [i, item]))) {
					this.tabs[index] = value.replace(/\([^\)]*\)/g, `(${array[index]})`);
				}
			}
		},
		mounted() {
			this.$refs.edit0.creates();
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.myregular {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.weui-tab {
		width: 100%;
		/*height: 29.5%;*/
		margin-bottom: 0.33rem;
	}
	
	.headerBox {
		width: 100%;
		height: 3.92rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #e45038;
	}
	
	.numBox {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.headerTwo {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-top: 0.4rem;
	}
	
	.nums {
		.font-dpr(28);
		color: #fff;
	}
	
	.numss {
		.font-dpr(50);
	}
	
	.texts {
		.font-dpr(24);
		color: #ffb88d;
	}
	
	.weui-navbars {
		display: flex;
		width: 100%;
		background: #fff;
		position: relative;
		border-bottom: 0.01rem solid #f0f0f0;
		box-sizing: border-box;
	}
	
	.weui-navbar__slider {
		width: 25%;
	}
	
	.weui-navbar__title {
		.font-dpr(28);
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