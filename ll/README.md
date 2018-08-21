# 掌悦请求参数封装
##### 掌悦新版接口需要一些基础参数，前端统一调用，包括但不限于pc、mobile端
## 使用方法
### 1、引入js 
	测试环境地址：106.14.25.126/h5/libs/js/req-0.0.1.min.js
	生产地址：https://www.zhangyuelicai.com/h5/libs/js/req-0.0.1.min.js
### 2、调用
	ZYReq(config)
### PS:
	ZYReq({
		channelId:"1",
		platform:"app",
		data:{
			test:1,
			pageInfo:{
				pageNo: 1,      //页码
        		pageSize: 10    //页条数
			}
		}
	})
### 注意：如果使用es6开发 请import源码