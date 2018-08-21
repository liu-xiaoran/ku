<template>
	<router-view></router-view>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				
			}
		},
		created() {
			global.wechatShare = new ZYLIB.ZYWechat({
				data: {
					title: '掌悦理财，悦享无忧',
					desc: '新人红包688元'
				},
				timelineData: {
					title: '掌悦理财，悦享无忧'
				}
			})
			let locked = false;
			// window.addEventListener('touchmove', function(ev) {
			// 	locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
			// }, true);

			// function stopTouchendPropagation(e) {
			// 	var e = window.event || event;
			// 	if(document.all) {
			// 		e.cancelBubble = true;
			// 	} else {
			// 		e.stopPropagation();
			// 	}
			// 	window.removeEventListener('touchend', stopTouchendPropagation, true);
			// 	locked = false;
			// }
		}
	}
</script>

<style lang="less">
	@import './style/weui.less';
	
	body,
	html {
		width: 100%;
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}

	#app {
		background-color: #f0f0f0;
		font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif;
		height: 100%;
		display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 0 auto;
		overflow: hidden;
	}

	.appContent {
		-webkit-overflow-scrolling: touch;
		flex: 1;
		overflow-y: auto;
	}

	.display__none {
		display: none;
	}
</style>
<style lang="scss">
	@import './style/utils.scss';
</style>
