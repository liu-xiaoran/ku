'use strict';

module.exports = {
    render: function (dom) {
	    // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
	    // scrat已经配置了对handlebars后置的文件进行预编译，因此
	    // 可以直接内嵌这里文件当做js函数执行
	    var tpl = __inline('banner.handlebars');

	    // 模板数据
	    var data = {
	        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
	        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
	        img: window.remoteConfig.banner_src
	    };

	    // 使用模板+数据得到html
	    dom.innerHTML = tpl(data);
        // dom.innerHTML = __inline('banner.tpl');
    }
};