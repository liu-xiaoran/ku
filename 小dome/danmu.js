/*点击打开弹幕跳出弹幕页*/
$(function() {
    $(".showBarrage,.s_close").click(function() {
        /*toggle切换元素可见状态*/
        $(".barrage,.s_close").toggle("slow");
    });
    /*init_animated();不知道有什么效果*/
    init_animated();
})
//提交评论
$(".send .s_btn").click(function() {
    /*用val()获取 .s_text 里面的值再赋给text*/
    var text = $(".s_text").val();
    /*如果值赋给了text则给函数返回值，不在靠下执行*/
    if (text == "") {
        return;
    };
    /*样式：右边是20像素 上边0像素 透明度值为1 getRandomColor()是随机生成颜色赋予text*/
    var _lable = $("<div style='right:20px;top:0px;opacity:1;color:" + getRandomColor() + ";'>" + text + "</div>");
    /*append给.mask后面添加lable.隐藏元素 .show()显示被隐藏的元素*/
    $(".mask").append(_lable.show());
    //执行init_barrage();动作
    init_barrage();
})
//初始化弹幕技术
function init_barrage() {
    /*声明变量_top为0*/
    var _top = 0;
    /*弹幕遍历不隐藏 .each遍历*/
    $(".mask div").show().each(function() {
        /*$(window).width()获取当前窗口的宽度(不包含滚动条)减去字体的宽*/
        //浏览器最大宽度，作为定位left的值
        var _left = $(window).width() - $(this).width();
        //浏览器最大高度
        var _height = $(window).height();
        /*_top = 75+_top 弹幕之间每次加75的距离*/
        _top += 75;
        /*如果(_top 大于等于 (_height -130))*/
        if (_top >= (_height - 130)) {
            /*则0赋予_top*/
            _top = 0;
        }
        /*将css中left、top、color转换为jquery对象*/
        $(this).css({
            left: _left,
            top: _top,
            color: getRandomColor()
        });
        //定时弹出文字
        var time = 10000;
        /*idnex()方法返回指定元素相对于其他指定元素的index位置 index()除以2余数为0*/
        if ($(this).index() % 2 == 0) {
            /*则时间为15000*/
            time = 15000;
        }
        /*animate()方法执行css属性集的自定义动画。*/
        $(this).animate({
            left: "-" + _left + "px"
        },
        time,
        function() {
            /*remove()方法移除被选元素，包括所有的文本和子节点*/
            $(this).remove();
        });
    });
}
//获取随机颜色
function getRandomColor() {
    return '#' + (function(h) {
        return new Array(7 - h.length).join("0") + h
    })((Math.random() * 0x1000000 << 0).toString(16))
}