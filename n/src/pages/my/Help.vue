<template>
	<div class="help">
		<img class="banner" src="../../images/xx/bangzhubanner.png" />
		<input id="foo" value="zhangyuelicai" style="width: 1px;height: 1px;opacity: 0;position: absolute;left: 0;top: 0;">
		<div class="helpCon">
			<v-touch data-clipboard-target="#foo" :key="item.id" v-for="(item,index) in list" :class="['helpBox',((index%2)==0)?'borders':'',(index+1<list.length)?'borderss':'',(item.type=='copy')?'copys':'']" @tap="href(item.url||'',item.type)">
				<img class="icons" :src="item.icon" />
				<span>{{item.name}}</span>
			</v-touch>
		</div>
    <logBase></logBase>
	</div>
</template>

<script>
  import Clipboard from "clipboard";
  import logBase from '../logBase';
	export default {
    name: 'Help',
    components: {
      logBase
    },
		data() {
			return {
				list: [{
					name: '常见问题',
					icon: require('../../images/x/changjianwenti.png'),
					type: 'href',
					url: '/notice1/help/setting-problems.html?t=' + new Date().getTime()
				}, {
					name: '咨询电话',
					icon: require('../../images/x/zixundianhua.png'),
					type: 'href',
					url: 'tel://400-611-8088'
				}, {
					name: '意见反馈',
					icon: require('../../images/x/yijianfankui.png'),
					type: 'router',
					url: '/feedback'
				}, {
					name: '微信公众号',
					icon: require('../../images/x/weixin.png'),
					type: 'copy',
					url: '/m/static/wechat.html?id=1&t=' + new Date().getTime()
				}, {
					name: '客服邮箱',
					icon: require('../../images/x/kefuyouxiang.png'),
					type: 'href',
					url: 'mailto://kefu@zhangyuelicai.com'
				}, {
					name: '关于我们',
					icon: require('../../images/x/bangzhuguanyu.png'),
					type: 'router',
					url: '/aboutus'
				}, {
					name: '服务协议',
					icon: require('../../images/x/bangzhuxieyi.png'),
					type: 'href',
					url: '/actives1/static/protocolDetail?type=service&t=' + new Date().getTime()
				}]
			}
		},
		methods: {
			href(url, type) {
				if(type == 'href') {
					window.location.href = url
				} else if(type == 'router') {
					this.$router.push({
						path: url
					})
				} else if(type == 'copy') {
					let clipboard = new Clipboard('.copys');
					clipboard.on('success', (e) => {
						e.clearSelection();
						window.location.href = url;
					});
					clipboard.on('error', (e) => {
						window.location.href = "/m/static/wechat.html&t=" + new Date().getTime()
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.banner {
		width: 100%;
		height: 3.16rem;
		display: block;
		margin-bottom: 0.26rem;
	}

	.helpCon {
		width: 100%;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
	}

	.helpBox {
		width: 50%;
		height: 3.09rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #3b3b3b;
		.font-dpr(28);
		line-height: 0.37rem;
		cursor: pointer;
	}

	.borderss {
		border-bottom: 0.021rem solid #dfdfdf;
	}

	.borders {
		border-right: 0.021rem solid #dfdfdf;
	}

	.icons {
		width: 0.89rem;
		height: 0.86rem;
		display: block;
		margin-bottom: 0.53rem;
	}
</style>
