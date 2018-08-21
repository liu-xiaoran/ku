<template>
	<div class="aboutus">
		<input id="foo" value="zhangyuelicai" style="width: 1px;height: 1px;opacity: 0;position: absolute;left: 0;top: 0;">
		<div class="aboutusBox">
			<img class="logo" src="../../images/x/guanyuwomenlogo.png" />
			<span class="version">Ver:1.0.0</span>
			<div class="mylist">
				<v-touch data-clipboard-target="#foo" :key="item.id" v-for="(item,index) in list" :class="['list-cell',(list.length!=index+1)?'newBox':'',(item.type&&item.type=='copy')?'copys':'']" @tap="href(item.url||'',item.type||'')">
					<div class="list-cell__bd">{{item.name}}</div>
					<div class="list-cell__ft">{{item.text}}</div>
				</v-touch>
			</div>
		</div>
		<span class="footerText">@2017 Shanghai Wanse Investment management</span>
		<span class="footerText" style="margin-bottom: 0.26rem;">co.,Ltd.All Rights Reserved</span>
	</div>
</template>

<script>
	import Clipboard from "clipboard";
	import Tips from '../../utils/Tips';
	export default {
		name: 'Aboutus',
		data() {
			return {
				list: [{
					name: '官方网站',
					text: 'www.zhangyuelicai.com'
				}, {
					name: '官方微信',
					text: 'zhangyuelicai',
					type: 'copy',
					url: '/m/static/wechat.html?id=1&t=' + new Date().getTime()
				}, {
					name: '官方微博',
					text: '掌悦理财'
				}, {
					name: '联系邮箱',
					text: 'kefu@zhangyuelicai.com',
					url: 'mailto://kefu@zhangyuelicai.com'
				}, {
					name: '(人工服务时间: 09:00~18:00)',
					text: '400-611-8088',
					url: 'tel://400-611-8088'
				}]
			}
		},
		methods: {
			href(url, type) {
				if(url) {
					if(type&&type =='copy') {
						let clipboard = new Clipboard('.copys');
						clipboard.on('success', (e) => {
							e.clearSelection();
							Tips.success('复制成功!')
							let time = setTimeout(() => {
								window.location.href = url;
								clearTimeout(time)
							}, 800)
						});
						clipboard.on('error', (e) => {
							Tips.success('复制失败!')
							let time = setTimeout(() => {
								window.location.href = window.location.href = "/m/static/wechat.html&t=" + new Date().getTime();
								clearTimeout(time)
							}, 800)
						});
					} else {
						window.location.href = url
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/utils.less";
	.aboutus {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.aboutusBox {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.logo {
		width: 2.32rem;
		height: 3.25rem;
		margin: 0.26rem 0;
	}
	
	.version {
		color: #3b3b3b;
		.font-dpr(28);
		margin-bottom: 0.26rem;
	}
	
	.mylist {
		width: 100%;
	}
	
	.list-cell__ft {
		color: #3b3b3b;
		.font-dpr(30);
	}
	
	.list-cell {
		margin-left: 4%;
		padding-right: 4%;
		cursor: pointer;
	}
	
	.footerText {
		.font-dpr(28);
		color: #3b3b3b;
	}
</style>