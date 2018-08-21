<template>
	<div class="sign">
		<div class="signConed">
			<div class="signHeader">
				<div class="headerBg headerCon">
					<div class="headerBox">
						<div class="flexs flexLeft">
							<span class="days">已连续签到<span class="dayNum" v-text="message.lengths||0"></span>天</span>
						</div>
						<div class="circular">
							<span class="money">{{message.lastAmount||'0.00'}}<span class="yuan">元</span></span>
							<span class="getToday">今日获得</span>
						</div>
						<div class="flexs flexRight">
							<v-touch class="ruleBtn" @tap="toShow">
								<div class="mark">?</div>
								<span>活动规则</span>
							</v-touch>
						</div>
					</div>
					<ul class="dayList">
						<li v-for="(item,index) in message.rewardList">
							<div v-if="message.daySignHistory" :class="['dark',index<message.daySignHistory.length?'bright':'']">
								<span>{{index+1}}</span>
								<img v-if="(index+1)==message.rewardList.length" class="jiangli" src="../../images/x/icon_dajiangli.png" />
							</div>
							<div v-if="(index+1)!=message.rewardList.length" :class="['darkLine',index<message.daySignHistory.length?'brightLine':'']"></div>
						</li>
					</ul>
				</div>
			</div>
			<div class="signContent">
				<div class="signTitle">
					<div class="flexs"></div>
					<span class="titles">签到奖励</span>
					<div class="flexs flexRight">
						<v-touch class="detailedBtn" @tap="toSigndetail">? 领取明细</v-touch>
					</div>
				</div>
				<div class="signLists">
					<div v-for="(item,index) in message.rewardList" :class="['rewardLists',(index==1||index==4)?'centers':'',(index+1)==message.rewardList.length?'rewardListBig':'']">
						<div class="quanhui redBox" v-if="index<message.daySignHistory.length">
							<img class="quanhui" src="../../images/x/icon_quanliang.png" />
							<div class="redCon">
								<div class="amount">
									<span class="yuans">￥</span>
									<span>{{message.daySignHistory[index].bonus.amount}}</span>
								</div>
								<div class="redName">{{message.daySignHistory[index].bonus.name}}</div>
							</div>
						</div>
						<img v-else class="quanhui" src="../../images/x/icon_quanhui.png" />
						<div :class="['quanhuiText',index<message.daySignHistory.length?'quanhuiTexts':'']">
							<span>第{{days[index]}}天</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button class="comBtn" @click="toUsed">马上使用</button>
		<div :class="['zan-dialog',showDialog ? 'zan-dialog--show' : '']">
			<div :class="['zan-dialog__mask',open ? 'weui-animate-fade-in' : 'weui-animate-fade-out']">
				<div :animation="animationData" class="zan-dialog__container">
					<div class="ruleBox" v-if="isRule">
						<div class="ruleHeader">
							<span>活动规则</span>
							<v-touch @tap="toShow" class="closeBtn iconfont icon-cha"></v-touch>
						</div>
						<ul class="ruleCon">
							<li>1、每日完成签到任务，可获得签到红包。</li>
							<li>2、7天内，累计签到7天，即可获得大红包。</li>
							<li>3、累计签满7天，即可开启下一轮签到之旅。</li>
							<li>4、红包即时发放，偶有延迟情况请耐心等待。</li>
						</ul>
					</div>
					<div class="signSucceed" v-else>
						<v-touch @tap="toShow" class="sucClose iconfont icon-cha1"></v-touch>
						<img class="successImg" src="../../images/x/qiandaochenggong.png" />
						<div class="successBox">
							<ul class="successCon">
								<li class="sucTitle">签到成功</li>
								<li class="sucCon" style="margin-bottom: 0.13rem;">获得{{message.lastAmount}}元代金券</li>
								<li class="sucCon">已累计签到{{message.lengths||0}}天</li>
								<li class="sucFoot">请在优惠券里查看</li>
							</ul>
							<div class="successFooter">
								<button class="toUseBtn" @click="toUsed">马上使用</button>
							</div>
						</div>
					</div>
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
  import logBase from '../logBase';
	export default {
    name: 'Sign',
    components: {
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
				isRule: true,
				message: '',
				days: ['一', '二', '三', '四', '五', '六', '七']
			}
		},
		methods: {
			toSigndetail() {
				this.$router.push({
					path: '/signdetail'
				})
			},
			toShow() {
				this.isRule = true
				this.toggleDialog()
			},
			toUsed() {
				if(!this.isRule) {
					this.toggleDialog()
					this.isRule = true
				}
				if(this.message.todayCouponStatus == 'NOTUSED') {
					//					this.myCouponDetailInfo(this.message.todayCouponIdStr)
					this.$router.push({
						path: `/mycoupondetails?uId=${this.message.todayCouponIdStr}`
					})
				} else {
					this.$router.replace({
						path: '/regular'
					})
				}
			},
			toggleDialog() {
				this.open = !this.open
				if(this.showDialog) {
					let time = setTimeout(() => {
						this.showDialog = !this.showDialog
						clearTimeout(time)
					}, 500);
				} else {
					this.showDialog = !this.showDialog
				}
			},
			async onSiginData() {
				let res = await Http.post({
					url: Api.coupon.newhistory,
					data: {},
				})
				if(res.code != 10000) {
					return
				}
				this.couponHistory(res.data)
			},
			couponHistory(data) {
				let datas = data
				if(datas.daySignHistory && datas.daySignHistory.length > 0) {
					datas.lengths = datas.daySignHistory.length
					for(let value of datas.daySignHistory) {
						value.bonus.amount = Utils.formatCurrency(value.bonus.amount)
					}
					datas.lastAmount = datas.daySignHistory[datas.daySignHistory.length - 1].bonus.amount
				}
				this.message = datas
				if(data.checkIn == 2) {
					this.newSign()
				}
				console.log(this.message)
			},
			async newSign() {
				let res = await Http.post({
					url: Api.coupon.newdosign,
					data: {
						getList: 1
					}
				})
				if(res.code == 10000) {
					this.isRule = false
					this.toggleDialog()
					let datas = res.data
					if(datas.daySignHistory && datas.daySignHistory.length > 0) {
						datas.lengths = datas.daySignHistory.length
						for(let value of datas.daySignHistory) {
							value.bonus.amount = Utils.formatCurrency(value.bonus.amount)
						}
						datas.lastAmount = datas.daySignHistory[datas.daySignHistory.length - 1].bonus.amount
					}
					this.message = datas
				}
			}
		},
		created() {
			this.onSiginData()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.sign {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		position: relative;
	}

	.signConed {
		width: 100%;
		height: 90%;
		overflow: hidden;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.signHeader {
		width: 100%;
		height: 5.81rem;
		position: relative;
	}

	.headerBg {
		width: 100%;
		height: 100%;
		background: linear-gradient(to right, #9a49d3, #5c67c7);
	}

	.headerCon {
		position: absolute;
		top: 0;
		left: 0;
	}

	.headerBox {
		margin-top: 0.62rem;
		width: 100%;
		display: flex;
	}

	.flexs {
		flex: 1;
	}

	.circular {
		width: 2.66rem;
		height: 2.66rem;
		background: #fff;
		border-radius: 200px;
		border: 0.13rem solid #9a6ad7;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0.13rem 0;
	}

	.money {
		.font-dpr(66);
		color: #7f3f90;
		border-bottom: 0.04rem solid #dac7df;
		line-height: 0.66rem;
		margin: 0.73rem 0 0.06rem;
	}

	.yuan {
		.font-dpr(24);
	}

	.getToday {
		color: #3b3b3b;
		.font-dpr(28);
	}

	.days {
		color: #fff;
		.font-dpr(26);
		margin-left: 0.66rem;
	}

	.dayNum {
		.font-dpr(40);
	}

	.flexLeft {
		display: flex;
		align-items: center;
	}

	.flexRight {
		display: flex;
		justify-content: flex-end;
	}

	.ruleBtn {
		display: flex;
		color: #fff;
		.font-dpr(24);
		margin-right: 0.37rem;
		line-height: 0.42rem;
		height: 0.42rem;
	}

	.mark {
		background: #fff;
		color: #583fc0;
		width: 0.42rem;
		height: 0.42rem;
		line-height: 0.42rem;
		text-align: center;
		border-radius: 200px;
		margin-right: 0.08rem;
	}

	.dayList {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 0.56rem;
	}

	.dayList li {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dark {
		width: 0.66rem;
		height: 0.66rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 200px;;
		background-color: rgba(0, 0, 0, 0.3);
		color: rgba(255, 255, 255, 0.3);
		.font-dpr(30);
		position: relative;
	}

	.darkLine {
		width: 0.66rem;
		height: 0.13rem;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.bright {
		width: 0.61rem;
		height: 0.61rem;
		line-height: 0.61rem;
		background-color: #d84949;
		color: #fff;
		border: 0.05rem solid #ffd800;
	}

	.brightLine {
		background-color: #ffd800;
	}

	.jiangli {
		width: 1.18rem;
		height: 1.3rem;
		position: absolute;
		bottom: 0.8rem;
		left: -0.26rem;
	}

	.signContent {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.signTitle {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.titles {
		.font-dpr(30);
		color: #3b3b3b;
		margin: 0.53rem 0 0.46rem;
	}

	.detailedBtn {
		width: 1.94rem;
		height: 0.53rem;
		line-height: 0.53rem;
		text-align: center;
		background-color: #f2f2f2;
		border-radius: 200px;;
		color: #a6a6a6;
		.font-dpr(24);
		margin-right: 0.36rem;
		display: block;
		text-decoration: none;
	}

	.signLists {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.rewardLists {
		width: 2.93rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.quanhui {
		width: 100%;
		height: 1.33rem;
	}

	.rewardListBig {
		width: 4.53rem;
	}

	.rewardListBig .quanhui {
		height: 1.81rem;
	}

	.centers {
		margin: 0 0.33rem;
	}

	.quanhuiText {
		width: 100%;
		height: 0.85rem;
		padding-top: 0.13rem;
		color: #cecece;
		.font-dpr(24);
		text-align: center;
	}

	.quanhuiTexts {
		color: #ec6a6a;
	}

	.redBox {
		position: relative;
	}

	.redCon {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
	}

	.amount {
		.font-dpr(40);
		font-weight: 600;
		color: #fae5a6;
		flex: 1;
		display: flex;
		line-height: 0.53rem;
	}

	.yuans {
		.font-dpr(24);
		line-height: 0.32rem;
		font-weight: normal;
		margin: 0 0.17rem 0 0.1rem;
	}

	.redName {
		width: 19%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.font-dpr(24);
		color: #d23a3a;
		padding: 0 5%;
		line-height: 0.32rem;
		text-align: center;
	}

	.rewardListBig .amount {
		.font-dpr(62);
		line-height: 0.82rem;
	}

	.rewardListBig .yuans {
		.font-dpr(36);
		line-height: 0.48rem;
		margin: 0 0.16rem 0 0.1rem;
	}

	.rewardListBig .redName {
		.font-dpr(36);
		line-height: 0.48rem;
	}

	.comBtn {
		width: 91%;
		margin: 0.2rem auto 0;
	}

	.ruleBox {
		width: 80%;
		height: 8.48rem;
		border-radius: 0.13rem;
		background-color: #fff;
		color: #3b3b3b;
	}

	.ruleHeader {
		width: 100%;
		position: relative;
		text-align: center;
		.font-dpr(36);
		margin: 0.53rem 0;
	}

	.closeBtn {
		width: 0.37rem;
		height: 0.37rem;
		line-height: 0.37rem;
		color: #a9a9a9;
		.font-dpr(40);
		position: absolute;
		right: 0.26rem;
		top: -0.26rem;
		padding: 0.26rem;
		z-index: 100;
	}

	.ruleCon {
		width: 86%;
		margin: 0 7%;
		.font-dpr(30);
		display: flex;
		flex-direction: column;
	}

	.signSucceed {
		width: 5.82rem;
		height: 8.21rem;
		position: relative;
	}

	.successImg {
		width: 100%;
		height: 100%;
	}

	.successBox {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
	}

	.successCon {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}

	.sucTitle {
		.font-dpr(60);
		margin: 2.4rem 0 0.4rem;
	}

	.sucCon {
		.font-dpr(36);
	}

	.sucFoot {
		.font-dpr(24);
		color: #ff7474;
		margin-top: 0.13rem;
	}

	.successFooter {
		width: 100%;
		height: 1.62rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.toUseBtn {
		width: 79%;
		height: 0.96rem;
		line-height: 0.96rem;
		border: 0.02rem solid #6d6d6d;
		color: #e45038;
		.font-dpr(30);
		background-color: #fff;
	}

	.sucClose {
		width: 0.58rem;
		height: 0.58rem;
		position: absolute;
		right: -0.4rem;
		top: -0.82rem;
		padding: 0.4rem;
		color: #fff;
		line-height: 0.58rem;
		.font-dpr(46);
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
</style>
