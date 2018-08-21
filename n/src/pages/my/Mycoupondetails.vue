<template>
	<div class="mycoupondetails">
		<div class="headerBoxs">
			<div :class="['coupon-box','coupon-box-'+couponData.couponType]">
				<div class="coupon-title">
					<div class="coupon-title-1">
						<span class="coupon-title-name">{{couponData.name}}</span>
						<div class="coupon-type">{{couponData.couponTypeCh}}</div>
					</div>
					<div class="coupon-title-2" v-if="couponData.couponType=='RATECOUPON'">
						<span class="rmb">+ </span><span class="num">{{couponData.couponAmount}}%</span>
					</div>
					<div class="coupon-title-2" v-else>
						<span class="rmb">¥ </span><span class="num">{{couponData.couponAmount}}</span>
					</div>
				</div>
				<div class="coupon-content">
					<div style="margin-bottom: 0.06rem;">仅限投资{{couponData.limitLabels}}</div>
					<div style="margin-top: 0.06rem;">满{{couponData.limitInvestAmount}}元使用</div>
				</div>
				<div class="coupon-content coupon-contents" v-if="wallet">
					<span>还需充值<span class="reds">{{wallets}}元</span>可用该代金券</span>
					<v-touch class="toRecharge" @tap="goRecharge">
						<div class="icons iconfont icon-tanhao"></div>
						<span class="reds">去充值 ></span>
					</v-touch>
				</div>
			</div>
			<div class="listTitle">
				<div class="lines"></div>
				<span>此代金券适合项目推荐</span>
			</div>
		</div>
		<div class="contentBoxs">
			<div :key="item.id" @click="toRegular(item.productOid)" class="couponproduct" v-for="(item,index) in couponData.recommendProducts">
				<div class="products-item">
					<div class="tnContent">
						<div class="productname">
							<span class="name">{{item.name}}</span>
							<span v-for="items in item.labelList">
								<img class="iconImg" src="../../images/x/icon_chuizi.png" v-if="items.labelType=='extend'&&items.labelNo=='Q'" />
								<img class="iconImg" src="../../images/x/icon_yiminjingren.png" v-if="items.labelType=='extend'&&items.labelNo=='R'" />
								<img class="iconImg" src="../../images/x/icon_touzijinxi.png" v-if="items.labelType=='extend'&&items.labelNo=='A5'" />
							</span>
							<span v-for="items in item.labelList">
								<i class="labeTexts" v-if="items.labelNo!='R'&&items.labelNo!='Q'&&items.labelNo!='A5'&&(item.state!='RAISING')&&(items.labelType=='extend')">{{items.labelName}}</i>
              					<i class="labeText" v-if="items.labelNo!='R'&&items.labelNo!='Q'&&items.labelNo!='A5'&&(item.state=='RAISING')&&(items.labelType=='extend')">{{items.labelName}}</i>
							</span>
						</div>
						<div class="productContent">
							<div class="content1">
								<div class="shouyi">
									<span :class="['bfb','syl',item.state=='RAISING'?'':'greys']">{{item.expArrorDisp}}<span class="add">%</span>
									<i style="font-style: normal;" v-if="item.rewardInterest"><span class="add">+</span>{{item.rewardInterest}}<span class="add">%</span></i>
									</span>
									<span class="datas tz">{{item.durationPeriodDays}}<span class="add">天</span></span>
								</div>
								<div class="shouyis" style="margin-bottom: 0.26rem;">
									<span class="ys syl">历史年化收益率</span>
									<span class="ys tz">投资期限</span>
								</div>
							</div>
							<div class="content2">
								<button class="btnCon" @click.stop="goBuy(item)">立即抢购</button>
							</div>
						</div>
					</div>
					<div class="progress">
						<p :class="['activeProgress',(item.percent==100)?'radused':'']" :style="{'width':item.percent+'%'}"></p>
					</div>
					<div class="tnFooter">
						<span class="ys">{{item.investMin||0}}元起投</span>
						<span class="ys" v-if="item.state=='RAISING'">剩余{{item.remainMoney}}元</span>
					</div>
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
		name: 'Mycoupondetails',
		data() {
			return {
				couponData: '',
				wallet: '',
				wallets: ''
			}
		},
		methods: {
			toRegular(id) {
				this.$router.push({
					path: `/pages/regular?productId=${id}`
				})
			},
			async goBuy(itemName) {
				Utils.goBuyCheck(itemName, this)
			},
			async goRecharge() {
				let res = await Http.post({
					url: Api.money.recharge,
					data: {},
					extendInfo: ['UserBasicInfo'],
					localCache:1
				})
				if(res.code == 10012) {
					this.$router.push({
						path: '/bindcard'
					})
				} else if(res.code == 10000) {
					if(res.data.valid) {
						//						this.$preload('nextData', res.data)
						this.$router.push({
							path: `/recharge?m=${this.wallet}`
						})
					} else if(res.data.validDesc) {
						Tips.alert(res.data.validDesc)
					}
				}
			},
			/*计算需要充值金额*/
			calcNeedRecharge(datas, wallet) {
				let _wallet = 0;
				switch(datas.couponType) {
					case "COUPON":
						if(Utils.Fsub(datas.limitInvestAmount, datas.couponAmount) > wallet) {
							_wallet = Utils.Fsub(Utils.Fsub(datas.limitInvestAmount, datas.couponAmount), wallet)
						}
						break;
					default:
						if(datas.limitInvestAmount > wallet) {
							_wallet = Utils.Fsub(datas.limitInvestAmount, wallet)
						}
						break;
				}
				return _wallet
			},
			myCouponDetailInfo(res) {
				let datas = res.data
				this.wallet = this.calcNeedRecharge(datas, res.extendInfo.UserBasicInfo.wallet);
				this.wallets = Utils.formatCurrency(this.wallet)
				datas.couponAmount = Utils.formatCurrency(datas.couponAmount)
				datas.limitInvestAmount = Utils.formatCurrency(datas.limitInvestAmount)
				if(datas.recommendProducts) {
					for(let value of datas.recommendProducts) {
						value.expArrorDisp = Utils.formatCurrency(value.expArrorDisp)
						value.rewardInterest = value.rewardInterest ? Utils.formatCurrency(value.rewardInterest) : value.rewardInterest
						value.investMin = Utils.formatCurrency(value.investMin)
						value.remainMoney = Utils.formatCurrency(value.remainMoney)
					}
				}
				this.couponData = datas
			},
			async couponDataCon() {
				let res = await Http.post({
					url: Api.my.couponDetail,
					data: {
						ucId: this.$route.query.uId
					},
					extendInfo: ['UserBasicInfo']
				})
				if(res.code == 10000) {
					this.myCouponDetailInfo(res)
				}
			}
		},
		created() {
			this.couponDataCon()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	@import "../../style/base/mixin/rpx.less";
	@import "../../style/base/variable/color.less";
	.mycoupondetails {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.headerBoxs {
		width: 100%;
	}
	
	.contentBoxs {
		width: 100%;
		overflow-y: auto;
	}
	
	.mixinColor(@color) {
		.coupon-type {
			background-color: @color;
		}
		.coupon-title {
			color: @color;
		}
	}
	
	.coupon-box-COUPON {
		.mixinColor(@zyColorPrimary)
	}
	
	.coupon-box-RATECOUPON {
		.mixinColor(#689ed5)
	}
	
	.coupon-title-name {
		.font-dpr(32);
	}
	
	.coupon-box-t {
		height: 0.1rem;
	}
	
	.coupon-box {
		margin: 0.4rem 0.34rem;
		background-color: #fff;
		border-radius: 0.2rem;
		overflow: hidden;
	}
	
	.coupon-title {
		.calc-rpx-1242(margin-left, 32*0.013rem);
		.calc-rpx-1242(margin-right, 32*0.013rem);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.coupon-type {
		color: #fff;
		border-radius: 0.06rem;
		.font-dpr(24);
		.calc-rpx-1242(padding-left, 10*0.013rem);
		.calc-rpx-1242(padding-right, 10*0.013rem);
		margin-left: 0.13rem;
		height: 0.42rem;
		line-height: 0.42rem;
	}
	
	.coupon-title-1 {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.coupon-title-2 {
		.num {
			.font-dpr(60);
		}
		.rmb {
			.font-dpr(28);
		}
	}
	
	.coupon-content {
		min-height: 1.6rem;
		.calc-rpx-1242(margin-left, 32*0.013rem);
		.calc-rpx-1242(margin-right, 32*0.013rem);
		.font-dpr(24);
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #3b3b3b;
	}
	
	.coupon-contents {
		min-height: 0.98rem;
		border-top: 0.01rem dashed #bebebe;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	
	.reds {
		color: #e45038;
		line-height: 0.32rem;
	}
	
	.toRecharge {
		margin-left: 0.56rem;
		display: flex;
		align-items: center;
	}
	
	.icons {
		width: 0.37rem;
		height: 0.37rem;
		margin-right: 0.2rem;
		line-height: 0.37rem;
		color: #e45038;
		.font-dpr(30);
	}
	
	.listTitle {
		padding: 0 0.34rem;
		height: 0.9rem;
		display: flex;
		align-items: center;
		color: #3b3b3b;
		.font-dpr(30);
		line-height: 0.4rem;
	}
	
	.lines {
		width: 0.13rem;
		height: 0.4rem;
		background: #e45038;
		margin-right: 0.16rem;
	}
	
	.couponproduct {
		background: #fff;
		padding: 0 0.34rem;
		margin-bottom: 0.26rem;
		display: block;
		text-decoration: none;
	}
	
	.products-item {
		.calc-rpx-1242(padding-left, 32*0.013rem);
		.calc-rpx-1242(padding-right, 32*0.013rem);
	}
	
	.tnContent {
		min-height: 2.98rem;
		overflow: hidden;
	}
	
	.iconImg {
		width: 0.53rem;
		height: 0.53rem;
		margin-left: 0.1rem;
	}
	
	.labeTexts {
		color: #d4d4d4;
		border: 0.02rem solid #d4d4d4;
		.font-dpr(24);
		height: 0.42rem;
		line-height: 0.42rem;
		padding: 0 0.13rem;
		border-radius: 200px;
		margin-left: 0.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-style: normal;
	}
	
	.newlabeText {
		color: #9c4cd1;
		border: 0.01rem solid #9c4cd1;
		.font-dpr(24);
		height: 0.42rem;
		line-height: 0.42rem;
		padding: 0 0.13rem;
		border-radius: 200px;
		margin-left: 0.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.labeText {
		color: #ed7d2b;
		border: 0.02rem solid #ed7d2b;
		.font-dpr(24);
		height: 0.42rem;
		line-height: 0.42rem;
		padding: 0 0.13rem;
		border-radius: 200px;
		margin-left: 0.1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-style: normal;
	}
	
	.productname {
		display: flex;
		align-items: center;
		margin-top: 0.4rem;
	}
	
	.name {
		.font-dpr(32);
		color: #3b3b3b;
	}
	
	.productContent {
		display: flex;
		flex-direction: row;
		text-align: left;
	}
	
	.bfb {
		.font-dpr(40);
		color: #e45038;
	}
	
	.datas {
		.font-dpr(40);
		color: #3b3b3b;
	}
	
	.add {
		.font-dpr(28);
	}
	
	.ys {
		color: #a6a6a6;
		.font-dpr(24);
	}
	
	.shouyi {
		margin: 0.43rem 0 0.2rem;
	}
	
	.shouqin {
		width: 1.78rem;
		height: 1.78rem;
	}
	
	.content1 {
		flex: 1;
	}
	
	.shouyi,
	.shouyis {
		display: flex;
	}
	
	.syl {
		flex: 1.9;
	}
	
	.tz {
		flex: 1;
	}
	
	.content2 {
		padding-bottom: 0.5rem;
		display: flex;
		align-items: flex-end;
	}
	
	.tnFooter {
		height: 0.9rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.loading-tip {
		width: 100%;
		height: 1.06rem;
		line-height: 1.06rem;
		text-align: center;
		color: #ccc;
	}
	
	.greys {
		color: #a6a6a6;
	}
	
	.btnCon {
		width: 2.36rem;
		height: 0.88rem;
		line-height: 0.88rem;
		text-align: center;
		color: #fff;
		.font-dpr(32);
		background: #e45038;
		border-radius: 0.1rem;
		border: none;
		outline: none;
	}
	
	.progress {
		width: 100%;
		height: 0.05rem;
		border-radius: 200px;
		background: #dfdfdf;
	}
	
	.activeProgress {
		height: 100%;
		background: #e45038;
		border-top-left-radius: 200px;
		border-bottom-left-radius: 200px;
	}
	
	.radused {
		border-top-right-radius: 200px;
		border-bottom-right-radius: 200px;
	}
</style>