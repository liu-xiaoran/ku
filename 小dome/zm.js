
console.log("页面加载")
//提示框显示
this.show_prompt = function () {
    $(".prompt_box").show();
    setTimeout(function () {
        $(".prompt_box").hide();
    }, 2000)
}

function onloadJs() {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    //ajax封装
    function myAjax(type, url, data, Fn) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            success: function (data) {
                Fn(data);
            },
            error: function (xhr, type) {
                console.log('xhr=' + JSON.stringify(xhr) + 'type=' + type);
            }
        });
    }
    function customajax(url, data, Fn) {
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            success: function (data) {
                Fn(data);
            },
            error: function (xhr, type) {
                console.log('xhr=' + JSON.stringify(xhr) + 'type=' + type);
            }
        });
    }

    var params = getQueryString('params'), sign = getQueryString('sign'), authUrl="", MyDatas;
    var uid, idCard, name, arr = [], MyData,phone;

    // 判断是否是支付宝回调页面，并将回调数据传给后台
    console.log("进入判断")
    if (params && sign) {
        $(".auth").hide()
        $(".success").show()
        console.log("进入请求")
        customajax(
            url,
            JSON.stringify({
                params: params,
                sign: sign
            }),
            function (data) {
                // var datas = JSON.parse(data)
                console.log("请求结束")
                window.postMessage && window.postMessage({ 'key': "sesameSuccess" },function(){
                    console.log("回调成功了")
                })
            }
        )
    } else {
        if($("#name").val()&&$("#idcard").val()){
            getAuth()
        }else{
            var times = 0
            function dogui2(){
                var cc = setInterval(function(){
                    times++
                    if($("#name").val()&&$("#idcard").val()){
                        getAuth()
                        clearInterval(cc)
                    }
                    if(times>150){
                        $(".prompt").html("信息错误，请返回重试");
                        this.show_prompt();
                        clearInterval(cc)
                    }
                }, 20);
                
            }
            dogui2()
        }
        
    }

console.log("调用")
window.postMessage && window.postMessage({ 'key': "sesame" }, function (data) {
    console.log(data)
    loadDate(data)
})
console.log("调用结束")

    // getDate()

    $(".btn").on("click", function () {
        if(authUrl){
            location.href = authUrl
        }else{
            $(".prompt").html("网速缓慢，请稍后再试~");
            this.show_prompt();
        } 
    })

    function loadDate(MyData) {
        uid = MyData.uid
        idCard = MyData.idCard
        name = MyData.realName
        arr = MyData.titles
        phone = MyData.phone
        $("#name").val(name).attr("disabled", "disabled")
        $("#idcard").val(idCard).attr("disabled", "disabled")

        var numC = arr.indexOf("芝麻授信"),htmls=[],html=[]

        for (var i = 0; i < arr.length; i++) {
            console.log(i)
            htmls.push('<div class="lineNum" '+(i >= numC?'style="background:#D9D9D9"':'')+'>'+(i-0+1)+'</div>')
            html.push('<div class="lineInfo">'+arr[i]+'</div>')
        }
        htmls = htmls.join('')
        html = html.join('')
        document.getElementsByClassName("lineCon")[0].innerHTML=htmls
        document.getElementsByClassName("lineText")[0].innerHTML=html
    }


    // 进入页面拉取用户征信数据
    
    function getAuth() {
        var authdate = JSON.stringify({
                uid: uid,
                name: $("#name").val(),
                identity: $("#idcard").val(),
                phone:phone
            })
        console.log(authdate)
        customajax(
            url,
            authdate,
            function (data) {
                var datas = JSON.parse(data)
                if (datas.success) {
                    if (!datas.data) {
                        $(".auth").hide()
                        $(".success").show()
                    } else {
                        $(".auth").show()
                        $(".success").hide()
                        var url = JSON.parse(datas.data)
                        authUrl = url.url
                    }
                }else{
                    $(".prompt").html(datas.errorMsg);
                    this.show_prompt();
                }
            }
        )
    }
}
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

window.onload = function(){
    console.log("onload")
    var mcounter=0
    if(this.ue().iphone == true){
        // this.onloadJs()
        (function dogui(){
            if(!window.JavascriptBridge&&mcounter++<100){
                setTimeout(function(){
                    dogui()
                },10)
            }else{
                this.onloadJs()
            }
        })()

    }else{
        (function dogui(){
            if(!window.Client&&mcounter++<100){
                setTimeout(function(){
                    dogui()
                },10)
            }else{
                this.onloadJs()
            }
        })()
    }
    
}