<template>
	<div class="productDetail">
		<div class="weui-tab weui-navbars">
			<v-touch :key="item.id" v-for="(item,index) in tabs" :id="index" :class="['weui-navbar__items',activeIndex == index ? 'weui-bar__item_on' : '']" @tap="tabClick(index)">
				<div class="weui-navbar__title">{{item}}</div>
			</v-touch>
		</div>
		<div class="xieyis" v-show="activeIndex != 2">
			<Xieyi ref="edit" />
		</div>
		<div class="recordlists" v-show="activeIndex == 2">
			<Recordlist ref="edits" :productType="productType" />
		</div>
		<div class="btnBottom">
			<div v-if="productType=='CURRENT'" class="btnBottomCon">
				<v-touch class="btnBottomLeft" @tap="redeem">转让</v-touch>
				<v-touch class="btnBottomRight" @tap="buy">抢购</v-touch>
			</div>
			<v-touch v-else :class="states?'btnBottomCons':'btnBottomCons2'"  @tap="buy" v-text="states?'购买':'已售罄'">

			</v-touch>
		</div>
		<logBase />
	</div>
</template>
<script>
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Utils from "../../utils/Utils";
	import logBase from '../logBase';
	import Xieyi from '../../components/Finance/Xieyi';
  import Recordlist from '../../components/Finance/Recordlist';
  import router from "../../router";
  import Tips from "../../utils/Tips";
	export default {
		name: "productDetail",
		components: {
			Xieyi,
			Recordlist,
			logBase
		},
		data() {
			return {
				tabs: ["项目介绍", "收益说明", "投资记录"],
				activeIndex: 0,
        productType: '',
        states : false
			}
		},
		methods: {
			tabClick(id) {
				if(id!=2) {
					this.$refs.edit.isData(this.$route.query.productId, this.$route.query.productType, id);
				} else {
					this.$refs.edits.getData(1)
				}
				this.activeIndex = id
			},
			redeem() {
				this.isRedeem();
			},
			buy() {
        if(!this.states){
          Tips.alert("已售罄")
          return
        }
				this.goBuy(this.$route.query);
			},
			async goBuy(itemName) {
				Utils.goBuyCheck(itemName, this);
			},
			async isRedeem() {
				let res = await Http.post({
					url: Api.money.redeemPrepose,
					data: {
						productId: this.$route.query.productId
					},
					login: 1,
					extendInfo: ["UserBasicInfo"]
				});
				if(res.code == 10000) {
					if(res.extendInfo.UserBasicInfo.isBindCard == 1) {
						if(!res.data.valid && res.data.validDesc) {
							Tips.alert(res.data.validDesc);
						} else if(res.data.holdAmount <= 0) {
							Tips.toast("您暂未持有该产品");
						} else {
							let datas = res.data;
							datas.maxRedeemAmounts = Utils.formatCurrency(
								datas.maxRedeemAmount
							);
							datas.maxSingleDayRedeemAmount = Utils.formatCurrency(
								datas.maxSingleDayRedeemAmount
							);
							// 跳转到转让页面
							router.push({name:"Redeem",query:{
                p:this.$route.query.productId
              }}); //跳转到转让页面
						}
					} else {
						router.push({
							name: "bindcard"
						}); //跳转到绑卡页面
					}
				}
			},
		},
		created() {
      this.productType = this.$route.query.productType
      if(!this.$route.query.state||(this.$route.query.state=="RAISING")){
        this.states = true
      }
		}
	};
</script>
<style lang="less" scoped>
	@import "../../style/utils.less";
	.productDetail {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.weui-navbars {
		display: flex;
		width: 100%;
		height: 6%;
		background: #fff;
	}

	.weui-navbar__items {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.weui-navbar__title {
		flex: 1;
		text-align: center;
		.font-dpr(28);
		color: #3b3b3b;
	}

	.weui-bar__item_on .weui-navbar__title {
		color: #e45038;
	}

	.weui-tab__panel {
		margin-top: 1.46rem;
		padding: 0 0.34rem;
	}

	.xieyis,.recordlists {
		width: 100%;
		height: 87.1%;
		overflow-y: auto;
	}

	.btnBottom {
		height: 6.9%;
		width: 100%;
	}

	.btnBottomCon {
		border: 0.053333rem solid #e45038;
		.font-dpr(32);
		height: 1.12rem;
		display: flex;
		flex-direction: row;
		div {
			width: 50%;
			height: 100%;
			text-align: center;
			line-height: 1.12rem;
		}
	}

	.btnBottomCons {
		background: #e45038;
		.font-dpr(32);
		height: 100%;
		color: #ffffff;
		text-align: center;
		line-height: 1.12rem;
	}

  .btnBottomCons2 {
    background: #dcdcdc;
    .font-dpr(32);
    height: 100%;
    color: #656565;
    text-align: center;
    line-height: 1.12rem;
  }
	.btnBottomLeft {
		color: #e45038;
		background: #ffffff;
	}

	.btnBottomRight {
		color: #ffffff;
		background: #e45038;
	}
</style>
