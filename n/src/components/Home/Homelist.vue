<template>
	<div class="homelist">
		<div :key="itemName.id" class="project-item" v-for="itemName in productRow" v-if="productRow&&productRow.length>0" @click="toDetail(itemName)">
			<div class="item-head">
				<span class="circle red" v-if="itemName.type == 'PRODUCTTYPE_02'">天</span>
				<span class="circle blue" v-else>定</span>
				<span class="post-title">{{itemName.name}}</span>
        <!-- 图标的循环，要放在前面 -->
				<div v-for="(items,index) in itemName.labelList" :key="index">
					<img class="iconImg" src="../../images/x/icon_chuizi.png" v-if="items.labelType=='extend'&&items.labelNo=='Q'" />
					<img class="iconImg" src="../../images/x/icon_yiminjingren.png" v-if="items.labelType=='extend'&&items.labelNo=='R'" />
					<img class="iconImg" src="../../images/x/icon_touzijinxi.png" v-if="items.labelType=='extend'&&items.labelNo=='A5'" />
				</div>
        <!-- 基础标签，放在后面 -->
        <div v-for="(items,index) in itemName.labelList" :key="index">
          <span class="fk" v-if="items.labelType == 'extend'&&items.labelNo!='R'&&items.labelNo!='Q'&&items.labelNo!='A5'">{{items.labelName}}</span>
          <div class="newHand" v-show="itemName.generalLabels=='1000506'">
						<div class="xszx">新手专享</div>
					</div>
        </div>
			</div>
			<div class="item-content">
				<div class="contents">
					<div class="content1">
						<div class="interest">
							<span class="bfb">{{itemName.expArrorDisp}}</span>%
							<span v-if="itemName.rewardInterest">+<span class="bfb">{{itemName.rewardInterest}}</span>%</span>
						</div>
						<div class="datas">
							<span class="grey">投资期限 </span>
							<span class="blank" v-if="itemName.type == 'PRODUCTTYPE_02'">{{itemName.durationName}}</span>
							<span class="blank" v-else>{{itemName.durationPeriodDays}}{{itemName.durationPeriodType=='DAY'?'天':'月'}}</span>
						</div>
					</div>
					<div class="content2">
						<div class="yqsy">
							<span class="grey">历史年化收益率</span>
						</div>
						<div class="money">
							<span class="grey">起投金额 </span>
							<span class="blank">{{itemName.investMin}}元</span>
						</div>
					</div>
				</div>
				<div class="btn-box">
					<div class="btnsed" v-if="itemName.type=='PRODUCTTYPE_01'&&((itemName.state != 'RAISING')||(itemName.raisedTotalNumber == (itemName.collectedVolume+itemName.lockCollectedVolume*1) ||((itemName.raisedTotalNumber-itemName.collectedVolume)-itemName.lockCollectedVolume*1)<itemName.investMin))">
						<span class="btn-text">已售罄</span>
					</div>
					<div @click.stop="goBuy(itemName)" class="btnsed btnscon" v-else>
						<span class="btn-text">立即抢购</span>
					</div>
				</div>
			</div>
		</div>
		<div class="noNum" v-if="!(productRow&&productRow.length>0)">
			<span>暂无数据...</span>
		</div>
	</div>
</template>
<script>
	import Utils from '../../utils/Utils'
	export default {
		name: 'Homelist',
		props: ['productRow'],
		methods: {
			async goBuy(itemName) {
				Utils.goBuyCheck(itemName, this)
			},
			toDetail(itemName) {
				if(itemName.productType == 'CURRENT') {
					this.$router.replace({
						path: '/pages/current'
					})
				} else {
					this.$router.push({
						path: `/productTn?productId=${itemName.productOid}&state=${itemName.state}`
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "../../style/utils.less";
	.homelist {
		animation: fadeIn 1.6s;
		overflow: hidden;
	}

	.project-item {
		width: 92%;
		margin: 0 4% 0.26rem;
		background: #fff;
		position: relative;
	}

	.item-head {
		height: 1.17rem;
		border-bottom: 0.03rem solid #f0f0f0;
		align-items: center;
		display: flex;
		padding-left: 0.26rem;
	}

	.circle {
		width: 0.5rem;
		height: 0.5rem;
		line-height: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		.font-dpr(24);
		color: #fff;
		border-radius: 200px;
		margin-right: 0.13rem;
	}

	.red {
		background: #ef6455;
	}

	.blue {
		background: #5391d7;
	}

	.post-title {
		color: #3b3b3b;
		.font-dpr(28);
		line-height: 0.37rem;
	}

	.fk {
		display: flex;
		justify-content: center;
		align-items: center;
		.font-dpr(24);
		border: 0.03rem solid #f78f66;
		border-radius: 200px;
		height: 0.42rem;
		line-height: 0.42rem;
		padding: 0 0.13rem;
		margin-left: 0.13rem;
		color: #f78f66;
	}

	.iconImg {
		width: 0.53rem;
		height: 0.53rem;
		margin-left: 0.13rem;
	}

	.newHand {
		position: absolute;
		top: 0.26rem;
		right: -0.1rem;
		width: 1.53rem;
		height: 0.61rem;
		background: url(../../images/x/biaoqian.png) no-repeat center;
		background-size: 100% 100%;
	}

	.xszx {
		width: 100%;
		height: 0.61rem;
		line-height: 0.61rem;
		text-align: center;
		position: absolute;
		top: 0;
		right: 0;
		.font-dpr(22);
		color: #fff;
	}

	.item-content {
		width: 100%;
		height: 3.06rem;
	}

	.contents {
		width: 100%;
	}

	.content1 {
		width: 100%;
		display: flex;
		padding-top: 0.4rem;
		flex-direction: row;
		align-items: flex-end;
		line-height: 0.58rem;
		margin-bottom: 0.28rem;
	}

	.content2 {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		line-height: 0.32rem;
	}

	.interest {
		color: #e45038;
		flex: 1.2;
		padding-left: 0.8rem;
	}

	.yqsy {
		flex: 1.2;
		padding-left: 0.8rem;
	}

	.datas,
	.money {
		flex: 1;
		padding-left: 0.4rem;
	}

	.bfb {
		.font-dpr(44);
	}

	.grey {
		color: #a6a6a6;
		.font-dpr(24);
	}

	.blank {
		color: #3b3b3b;
		.font-dpr(24);
	}

	.btn-box {
		display: flex;
		justify-content: center;
		margin-top: 0.21rem;
	}

	.btnsed {
		width: 3.32rem;
		height: 1.09rem;
		position: relative;
		background: url(../../images/x/icon_qianggouanniu2.png) no-repeat center;
		background-size: 100% 100%;
	}

	.btnscon {
		background: url(../../images/x/icon_qianggouanniu.png) no-repeat center;
		background-size: 100% 100%;
	}

	.btn-text {
		.font-dpr(28);
		color: #fff;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
