<template>
	<div class="myheader">
		<div class="isLoginBox" v-if="!userinfo">
			<span class="titled">您还未登录 , 请先登录</span>
			<div class="btnBoxs">
				<router-link class="btns" to="/login">登录</router-link>
				<div class="lined"></div>
				<router-link class="btns" to="/register">注册</router-link>
			</div>
		</div>
		<div class="isAmountBox" v-else>
			<div class="totalBox">
				<div class="flexs"></div>
				<v-touch class="total totals" @tap="toAssetsdetail">
					<span class="totalAsset">{{!isEyes?message.totalAsset||'0.00':'****'}}</span>
					<span class="texts">总资产(元)</span>
				</v-touch>
				<div class="flexs rightBox">
					<v-touch @tap="changeShows" :class="[!isEyes?'eyes iconfont icon-yanjing1':'eyes iconfont icon-yanjing',]"></v-touch>
					<router-link to="/message" class="xiaoxi iconfont icon-youjian1">
						<div v-show="message.newLetter" class="newLetter">{{message.newLetter}}</div>
					</router-link>
				</div>
			</div>
			<div class="assetBox">
				<div class="total flexs">
					<span class="assets">{{!isEyes?message.cashBalance||'0.00':'****'}}</span>
					<span class="texts">现金余额(元)</span>
				</div>
				<div class="total flexs">
					<span class="assets">{{!isEyes?message.frozenBalance||'0.00':'****'}}</span>
					<span class="texts">冻结金额(元)</span>
				</div>
				<div class="total flexs">
					<span class="assets">{{!isEyes?message.accumulativeIncome||'0.00':'****'}}</span>
					<span class="texts">累计收益(元)</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Myheader',
		props: ['userinfo', 'message', 'isEyes'],
		data() {
			return {
				
			}
		},
		methods: {
			toAssetsdetail() {
				this.$router.push({
					path: '/assetsdetail'
				})
			},
			changeShows() {
				this.$emit('changeShow')
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.myheader {
		width: 100%;
		height: 3.93rem;
		background-color: #e45038;
	}
	
	.isLoginBox,
	.isAmountBox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.titled {
		.font-dpr(28);
		color: #ffe6bb;
		line-height: 0.37rem;
		margin: 1.48rem 0 0.6rem;
	}
	
	.btnBoxs {
		width: 25%;
		height: 0.69rem;
		border-radius: 200px;
		background-color: #fff;
		display: flex;
		align-items: center;
	}
	
	.btns {
		flex: 1;
		color: #e45038;
		.font-dpr(28);
		text-align: center;
		height: 0.69rem;
		line-height: 0.69rem;
		display: block;
		text-decoration: none;
	}
	
	.lined {
		width: 0.02rem;
		height: 0.33rem;
		background-color: #e9715d;
	}
	
	.totalBox {
		width: 100%;
		display: flex;
		margin: 0.16rem 0 0.9rem;
	}
	
	.flexs {
		flex: 1;
	}
	
	.total {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.totals {
		margin-top: 0.37rem;
		text-decoration: none;
	}
	
	.totalAsset {
		.font-dpr(50);
		color: #fff;
		line-height: 0.66rem;
	}
	
	.texts {
		.font-dpr(24);
		color: #ff9177;
		line-height: 0.32rem;
		margin-top: 0.21rem;
	}
	
	.rightBox {
		display: flex;
		justify-content: space-between;
	}
	
	.assetBox {
		width: 100%;
		display: flex;
	}
	
	.assets {
		.font-dpr(28);
		color: #fff;
		line-height: 0.37rem;
	}
	
	.eyes {
		width: 0.41rem;
		height: 0.33rem;
		padding: 0.37rem;
		line-height: 0.33rem;
		color: #ffb9a8;
		.font-dpr(34);
	}
	
	.xiaoxi {
		width: 0.5rem;
		height: 0.38rem;
		padding: 0.37rem 0.34rem;
		position: relative;
		display: block;
		color: #fff;
		.font-dpr(39);
		line-height: 0.38rem;
		display: block;
		text-decoration: none;
	}
	
	.newLetter {
		min-width: 0.32rem;
		height: 0.45rem;
		padding: 0 0.06rem;
		line-height: 0.45rem;
		border-radius: 200px;
		background-color: #fff;
		text-align: center;
		color: #e45038;
		.font-dpr(28);
		position: absolute;
		top: 0.1rem;
		right: 0.16rem;
	}
</style>