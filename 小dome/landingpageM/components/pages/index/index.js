'use strict';

      
// require依赖的文件
// var header1 = require('header1');
// var header2 = require('header2');
// var banner = require('banner');
// var tab = require('tab');
// var register1 = require('register1');
// var register2 = require('register2');
// var register3 = require('register3');
// var register4 = require('register4');
// var content1 = require('content1');
// var content2 = require('content2');
// var btns = require('btns');
// var downs = require('downs');
// var version = require('version');
// var footer = require('footer');
// var shade = require('shade');
// var downLoad = require('downLoad');
//var $ = require("zepto");
//var a=require("./share.js");
/**
 * 渲染页面骨架
 * @param {HTMLElement} dom
 */
exports.render = function(dom){
    // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
    dom.innerHTML = __inline('index.tpl');
//     // 渲染header1模块
//     header1.render(document.getElementById('site-header1'));
    
//     // 渲染header2模块
// //  header2.render(document.getElementById('site-header2'));
//     // 渲染banner模块
//     banner.render(document.getElementById('site-banner'));
//     // 渲染tab模块
//     tab.render(document.getElementById('site-tab'));
//     // 渲染register1模块
//     register1.render(document.getElementById('site-register1'));
//     // 渲染register2模块
// //  register2.render(document.getElementById('site-register2'));
//     // 渲染register3模块
// //  register3.render(document.getElementById('site-register3'));
//     // 渲染register4模块
// //  register4.render(document.getElementById('site-register4'));
//     // 渲染content1模块
// //  content1.render(document.getElementById('site-content1'));
//     // 渲染content2模块
//     content2.render(document.getElementById('site-content2'));
//     // 渲染btns模块
// //  btns.render(document.getElementById('site-btns'));
//     // 渲染downs模块
//     downs.render(document.getElementById('site-downs'));
//     // 渲染version模块
//     version.render(document.getElementById('site-version'));
//     // 渲染footer模块
// //  footer.render(document.getElementById('site-footer'));
//     // 渲染shade模块
//     shade.render(document.getElementById('site-shade'));
//     // 渲染downLoad模块
// //  downLoad.render(document.getElementById('site-downLoad'));
    
    
    for(var i=0;i<window.config.length;i++){
        // console.log(obj[key], key);
        
        if(window.config[i].indexOf("/")<0){
            (function(dom){
                require.async(""+window.config[i], function(component){
                    (function(component,dom){
                        component.render(document.getElementById('site-'+dom));
                    })(component,dom)
                    
                })
            })(window.config[i])
            
        }
    }
    //滑动时，touchend阻止冒泡
	var locked = false;
	window.addEventListener('touchmove', function(ev){
	    locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
	}, true);
	function stopTouchendPropagation(e){
		var e = window.event||event;
	    if(document.all){  //只有ie识别
	        e.cancelBubble=true;
	    }else{
	        e.stopPropagation();
	    }
	    window.removeEventListener('touchend', stopTouchendPropagation, true);
	    locked = false;
	}
};