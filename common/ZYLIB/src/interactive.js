// var ZYInteractive = require('./lib/interactive');
// export {ZYInteractive}
var ZYWechat = require('./lib/wechat');
import req from './lib/req'
import toast from './lib/toast'
let _config = {}
let _JavascriptBridge
class ZYInteractive {

    static postMessage(json, msg) {
        if (typeof Client != "undefined") {
            Client.postMessage && Client.postMessage(JSON.stringify(json));
        } else if (_JavascriptBridge) {
            _JavascriptBridge.callHandler('postMessage', json, function(response) {})
        } else {
            msg && toast(msg)
        }
    }

    constructor(options = {}) {
        _config.shareData= {
        	...{ 'key': "share", 'url': location.href.split('#')[0], 'title': '标题', 'content': '内容', 'imageUrl': 'img', 'img': 'img' },
            ...options.shareData
        }
        this.init();

    }
    init() {
        /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
        if (!!window.navigator.userAgent.match(/iPhone|iPad|iPod/)) {
            //获取 oc bridge
            this.setupWebViewJavascriptBridge((bridge) => {
                _JavascriptBridge = bridge;
                // 处理 oc 调用 js
                bridge.registerHandler('appCallJs', function(data, responseCallback) {
                    //处理oc给的传参
                    console.log('oc请求js  传值参数是：', data)
                    window.appCallJs(data)
                    var responseData = { 'result': 'handle success' }
                    //处理完，回调传值给oc
                    responseCallback(responseData)
                })


            })
        }
        //全局注册
        window.appCallJs = function(data) {
            console.log("appCallJs",data)
            if (typeof data == 'string') {
                data = JSON.parse(data)
            }
            if (data.key == 'share') {
                console.log(_config.shareData)
                ZYInteractive.postMessage(_config.shareData);
            }else if(data.key == 'header-right-button-click'){
                if(data["target-data"]){
                    location.href=data["target-data"]
                }
            }
        }
    }
    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

    setShareData(data) {
        _config.shareData = { ..._config.shareData, ...data }
    }
}
export {ZYInteractive,ZYWechat,req,toast}