<template>
	<div class="mycurrent">
		<div class="headerBox">
			<div class="numBox">
				<span class="nums numss">{{message.yesterdayIncome||'0.00'}}</span>
				<span class="texts">昨日收益(元)</span>
			</div>
			<div class="headerTwo">
				<div class="numBox list-cell__bd">
					<span class="nums">{{message.holdAmount||'0.00'}}</span>
					<span class="texts">在投本金(元)</span>
				</div>
				<div class="list-cell__bd"></div>
				<div class="numBox list-cell__bd">
					<span class="nums">{{message.totalIncome||'0.00'}}</span>
					<span class="texts">累计收益(元)</span>
				</div>
			</div>
		</div>
		<div class="weui-tab">
			<div class="weui-navbars">
				<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__item',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
					<div class="weui-navbar__title">{{item}}</div>
				</v-touch>
				<div class="weui-navbar__slider" id="lineMove" style="left: 0"></div>
			</div>
			<div class="weui-tab__content" v-show="activeIndex == 0">
				<router-link :to="'/mycurrentinfo?holdId='+item.holdId" style="display: block;text-decoration: none;" class="holdBox" v-for="item in message.holdings" :key="item.id" v-if="message.holdings">
					<div class="list-cell newBox" style="margin-bottom:0.53rem;">
						<div class="list-cell__bd textCon">{{item.productInfo.productName}}</div>
						<div class="list-cell__ft list-cell__ft_in-access"></div>
					</div>
					<div class="consText">
						<span>当前价值</span>
						<span>{{item.holdAmount}}元</span>
					</div>
					<div class="consText">
						<span>昨日收益</span>
						<span><span style="color:#e45038;">{{item.yesterdayIncome}}</span>元</span>
					</div>
					<div class="consText">
						<span>累计收益</span>
						<span>{{item.totalIncome}}元</span>
					</div>
					<div class="consText">
						<span>冻结金额</span>
						<span>{{item.waitRedeemAmount}}元</span>
					</div>
				</router-link>
				<div class="noNum" style="padding-top:3.73rem;" v-if="!message.holdings">
					<span>暂无数据...</span>
				</div>
			</div>
			<div class="weui-tab__content" v-show="activeIndex == 1">
				<div class="holdBox" v-if="message.toConfirms" v-for="item in message.toConfirms">
					<div class="list-cell newBox" style="margin-bottom:0.53rem;">
						<div class="list-cell__bd textCon" style="color:#a6a6a6;">{{item.productInfo.productName}}</div>
					</div>
					<div class="consText">
						<span style="color:#3b3b3b;">投资金额(元)</span>
						<span>申请状态</span>
					</div>
					<div class="consText">
						<span style="color:#3b3b3b;">{{item.waitInvestAmount}}</span>
						<span>{{item.holdStatusCh}}</span>
					</div>
				</div>
				<div class="noNum" style="padding-top:3.73rem;" v-if="!message.toConfirms">
					<span>暂无数据...</span>
				</div>
			</div>
		</div>
		<logBase />
	</div>
</template>

<script>
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	import logBase from '../logBase';
	export default {
		name: 'Mycurrent',
		components: {
			logBase
		},
		data() {
			return {
				message: '',
				tabs: ['计息中(0)', '待计息(0)'],
				activeIndex: 0
			}
		},
		methods: {
			tabClick(id) {
				document.getElementById("lineMove").style.transform = `translateX(${Utils.Fmul(id,100)}%)`;
				document.getElementById("lineMove").style.webkitTransform = `translateX(${Utils.Fmul(id,100)}%)`;
				this.activeIndex = id
			},
			async myCurrents() {
				let res = await Http.post({
					url: Api.my.myCurrent,
					data: {}
				})
				if(res.code == 10000) {
					let datas = res.data
					datas.holdAmount = Utils.formatCurrency(datas.holdAmount)
					datas.totalIncome = Utils.formatCurrency(datas.totalIncome)
					datas.yesterdayIncome = Utils.formatCurrency(datas.yesterdayIncome)
					if(datas.holdings) {
						this.tabs[0] = `计息中(${datas.holdings.length})`
						for(let value of datas.holdings) {
							value.holdAmount = Utils.formatCurrency(value.holdAmount)
							value.totalIncome = Utils.formatCurrency(value.totalIncome)
							value.waitRedeemAmount = Utils.formatCurrency(value.waitRedeemAmount)
							value.yesterdayIncome = Utils.formatCurrency(value.yesterdayIncome)
						}
					} else {
						this.tabs[0] = '计息中(0)'
					}
					if(datas.toConfirms) {
						this.tabs[1] = `待计息(${datas.toConfirms.length})`
						for(let value of datas.toConfirms) {
							value.waitInvestAmount = Utils.formatCurrency(value.waitInvestAmount)
						}
					} else {
						this.tabs[1] = '待计息(0)'
					}
					this.message = datas
				}
			}
		},
		created() {
			this.myCurrents()
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.mycurrent {
		width: 100%;
		height: 100%;
		overflow: hidden;
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
	
	.weui-tab__content {
		width: 100%;
		overflow-y: auto;
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
	}
	
	.holdBox {
		width: 100%;
		background: #fff;
		margin-top: 0.26rem;
		overflow: hidden;
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
	
	.consText text:last-child {
		color: #3b3b3b;
	}
	
	.weui-navbar__title {
		.font-dpr(28);
	}
	
	.textCon {
		.font-dpr(28);
	}
</style>
