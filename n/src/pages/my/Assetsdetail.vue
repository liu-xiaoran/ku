<template>
	<div class="assetsdetail">
		<div class="pieChart" id="pie">
			<div class="ring-content">
				<ring v-if="datas&&datas.length>0" canvasId="canvas" :type="canvasData.type" :width="canvasData.width" :height="canvasData.height" :data="datas" :options="canvasData.options" />
			</div>
			<!-- <ve-ring height="100%" width="100%" :data="dataed" :settings="chartSettings" :tooltip-visible="false" :legend-visible="false" :colors="colors"></ve-ring> -->
			<div class="textBox">
				<span class="tite">总资产</span>
				<span class="totalAsset">{{totalAsset||'0.00'}}元</span>
			</div>
		</div>
		<div class="content">
			<div v-for="(item,index) in list">
				<div :class="['lists',((list.length==index+1)||(item.details&&item.details.length>0))?'':'margs']">
					<div class="left">
						<div class="boxed" :style="{'background': item.color}"></div>
						<span style="color:#3b3b3b;">{{item.name}}</span>
					</div>
					<span style="color:#e45038;">{{item.num||'0.00'}}元</span>
				</div>
				<div v-if="item.details&&item.details.length>0" v-for="(items,indexs) in item.details" :class="['lists','listsDetail',(indexs==0)?'margss':'',(item.details.length==indexs+1)?((list.length!=index+1)?'margs':'nomarg'):'']">
					<div class="leftText">{{items.productName}}</div>
					<span style="color:#a6a6a6;">{{items.productAmount||'0.00'}}元</span>
				</div>
			</div>
		</div>
		<logBase></logBase>
	</div>
</template>

<script>
	import Vue from 'vue'
	// import VeRing from 'v-charts/lib/ring';
	import Api from '../../utils/Api';
	import Http from '../../utils/Http';
	import Utils from '../../utils/Utils';
	// Vue.component(VeRing.name, VeRing)
	import Ring from '../../components/Ring.vue'
	import logBase from "../logBase";
	export default {
		name: 'Assetsdetail',
		data() {
			return {
				totalAsset: '',
				datas: [],
				list: [],
				canvasData: {
					type: 'ring',
					width: lib.flexible.rem2px(6.32),
					height: lib.flexible.rem2px(6.32),
					options: {
						bgColor: '#fff', // 默认背景颜色 #e3e3e3
						titlePosition: 'top', // 图表标题位置: top / bottom
						colorList: ['#e45038', '#2e8ef2', '#9f48d3', '#ffaa25'], // 环形图颜色列表
						radius: parseInt(lib.flexible.rem2px(6.32 * 0.5)), // 环形图外圆半径
						innerRadius: lib.flexible.rem2px(2.37) // 环形图内圆半径
					}
				}
			}
		},
		components: {
			Ring,
			logBase
		},
		methods: {
			async myDatas() {
				let res = await Http.post({
					url: Api.my.myAsset,
					data: {}
				})
				if(res.code == 10000) {
					let datas = res.data
					if(datas.currentAsset == 0 && datas.currentAsset == datas.regularAsset && datas.regularAsset == datas.cashBalance && datas.cashBalance == datas.frozenBalance) {
						this.datas = [{
							name: 'a',
							value: 1
						}, {
							name: 'b',
							value: 1
						}, {
							name: 'b',
							value: 1
						}, {
							name: 'b',
							value: 1
						}]
					} else {
						this.datas = [{
							name: 'a',
							value: datas.currentAsset
						}, {
							name: 'b',
							value: datas.regularAsset
						}, {
							name: 'b',
							value: datas.cashBalance
						}, {
							name: 'b',
							value: datas.frozenBalance
						}]
					}
					if(datas.regularProducts && datas.regularProducts.length > 0) {
						for(let value of datas.regularProducts) {
							value.productAmount = Utils.formatCurrency(value.productAmount)
						}
					}
					if(datas.currentProducts && datas.currentProducts.length > 0) {
						for(let value of datas.currentProducts) {
							value.productAmount = Utils.formatCurrency(value.productAmount)
						}
					}
					if(datas.frozenAssets && datas.frozenAssets.length > 0) {
						for(let value of datas.frozenAssets) {
							value.productAmount = Utils.formatCurrency(value.productAmount)
						}
					}
					this.list = [{
						name: '掌薪宝资产',
						color: '#e45038',
						num: Utils.formatCurrency(datas.currentAsset),
						details: datas.currentProducts
					}, {
						name: '定期资产',
						color: '#2e8ef2',
						num: Utils.formatCurrency(datas.regularAsset),
						details: datas.regularProducts
					}, {
						name: '可用余额',
						color: '#9f48d3',
						num: Utils.formatCurrency(datas.cashBalance)
					}, {
						name: '冻结金额',
						color: '#ffaa25',
						num: Utils.formatCurrency(datas.frozenBalance),
						details: datas.frozenAssets
					}]
					this.totalAsset = Utils.formatCurrency(datas.totalAsset)
				} else {
					this.datas = [{
						name: 'a',
						value: 1
					}, {
						name: 'b',
						value: 1
					}, {
						name: 'b',
						value: 1
					}, {
						name: 'b',
						value: 1
					}]
					this.list = [{
						name: '掌薪宝资产',
						color: '#e45038',
						num: ''
					}, {
						name: '定期资产',
						color: '#2e8ef2',
						num: ''
					}, {
						name: '可用余额',
						color: '#9f48d3',
						num: ''
					}, {
						name: '冻结金额',
						color: '#ffaa25',
						num: ''
					}]
					this.totalAsset = '0.00'
				}
			}
		},
		created() {
			let clientHeight = Utils.Fmul(document.body.clientHeight, 0.23)
			this.chartSettings = {
				hoverAnimation: false,
				radius: [lib.flexible.rem2px(6.32 * 0.5), lib.flexible.rem2px(2.37)],
				offsetY: clientHeight,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				}
			}
			this.myDatas()
			// this.colors = ['#ffaa25', '#ffca4b', '#9f48d3', '#2e8ef2']
			// this.dataed = {
			// 	columns: ['b','percent'],
			// 	rows: [{
			// 		'a': '1',
			// 		'percent': this.$getPreloadData('amountData').currentAsset
			// 	}, {
			// 		'a': '1',
			// 		'percent': this.$getPreloadData('amountData').regularAsset
			// 	}, {
			// 		'a': '1',
			// 		'percent': this.$getPreloadData('amountData').cashBalance
			// 	}, {
			// 		'a': '1',
			// 		'percent': this.$getPreloadData('amountData').frozenBalance
			// 	}]
			// }
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.ring-content {
		width: 6.32rem;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.assetsdetail {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.pieChart {
		width: 100%;
		height: 50%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		margin-bottom: 2%;
		position: relative;
	}
	
	.textBox {
		width: 100%;
		height: 100%;
		position: absolute;
		/*left: 50%;
		top: 50%;*/
		/*transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		text-align: center;*/
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.tite {
		.font-dpr(30);
		color: #3b3b3b;
		text-align: center;
		line-height: 0.4rem;
		margin-bottom: 0.2rem;
	}
	
	.totalAsset {
		.font-dpr(36);
		color: #e45038;
		text-align: center;
		line-height: 0.48rem;
		padding-top: 0.2rem;
	}
	
	.content {
		width: 78%;
		height: 48%;
		background-color: #fff;
		display: flex;
		.font-dpr(30);
		line-height: 0.4rem;
		padding: 0.72rem 11%;
		flex-direction: column;
		overflow-y: auto;
	}
	
	.lists {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.left {
		display: flex;
		align-items: center;
	}
	
	.boxed {
		width: 0.26rem;
		height: 0.26rem;
		margin-right: 0.29rem;
	}
	
	.listsDetail {
		.font-dpr(26);
		color: #a6a6a6;
		margin-bottom: 0.53rem;
	}
	
	.leftText {
		padding-left: 0.56rem;
	}
	
	.margs {
		margin-bottom: 0.88rem;
	}
	
	.margss {
		margin-top: 0.53rem;
	}
	
	.nomarg {
		margin-bottom: 0;
	}
</style>