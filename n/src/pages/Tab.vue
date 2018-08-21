<template>
	<div class="pages">
		<div class="appContent">
			<router-view/>
		</div>
		<div class="tab">
			<v-touch v-for="(tab,index) in tabList" :key="tab.id" :class="{active:active==index}" @tap="toggle(index,tab.url)">
				<img :src="active==index?tab.acticon:tab.icon" />
				<p v-text="tab.name"></p>
			</v-touch>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Tab',
		data() {
			return {
				tabList: [{
					name: '首页',
					icon: require('../images/x/icon_shouye1.png'),
					acticon: require('../images/x/icon_shouye.png'),
					url: '/'
				}, {
					name: '掌薪宝',
					icon: require('../images/x/icon_huoqi1.png'),
					acticon: require('../images/x/icon_huoqi.png'),
					url: '/pages/current'
				}, {
					name: '定期',
					icon: require('../images/x/icon_dingqi1.png'),
					acticon: require('../images/x/icon_dingqi.png'),
					url: '/pages/regular'
				}, {
					name: '我的',
					icon: require('../images/x/icon_wo1.png'),
					acticon: require('../images/x/icon_wo.png'),
					url: '/pages/my'
				}],
				active: 0
			}
		},
		methods: {
			toggle(i,url) {
				this.active = i
				this.$router.replace({
					path: url
				})
			},
			showUp() {
				for(let i = 0, len = this.tabList.length; i < len; i++) {
					if(location.hash == "#"+this.tabList[i].url) {
						this.active = i
					}
				}
			}
		},
		created() {
			this.showUp();
		},
		updated() {
			this.showUp();
		}
	}
</script>

<style lang="less" scoped>
	@import "../style/utils.less";
	.pages {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.tab {
		width: 100%;
		height: 1.17rem;
		background: #fff;
		border-top: 0.02rem solid #e8e8e8;
		.font-dpr(22);
	}
	
	.tab div {
		width: 25%;
		height: 100%;
		float: left;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #949494;
		text-decoration: none;
	}
	
	.tab div img {
		width: 0.62rem;
		height: 0.62rem;
		display: block;
		border: none;
	}
	
	.tab div p {
		width: 100%;
		text-align: center;
	}
	
	.tab .active {
		color: #e45038;
	}
</style>