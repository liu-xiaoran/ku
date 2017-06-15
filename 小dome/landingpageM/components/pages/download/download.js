
var shade = require('shade');


module.exports = {
    downLoad: function() {
        //判断设备类型和浏览器环境
        function ue() {
            var e = navigator.userAgent.toLowerCase();
            return {
                iphone: /iphone/.test(e),
                android: /android/.test(e),
                winphone: /windows phone/.test(e),
                weixin: /micromessenger/.test(e),
                qqnews: /qqnews/.test(e),
                mqqbrowser: /mqqbrowser/.test(e),
                qq: /\sqq/.test(e)
            }
        }
        
        //下载app
        $(".down_btn").on("touchend", function () {
            if(ue().weixin == true) {
                $(".shade_box").show();
                $(".shade").show();
                $("html,body").addClass("ovfHiden");
            } else {
                if (ue().iphone == true) {
                    location.href = 'https://itunes.apple.com/app/id1203692435';
                } else if (ue().android == true) {
                    location.href = window.getApk();
                }
            }
        })
    },
    render: function (dom) {
        // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
        dom.innerHTML = __inline('download.tpl');
        this.downLoad()
    }
}