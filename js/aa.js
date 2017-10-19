funtion doneFast(){
	i--;
	$("#FastModledw").html(i);
	if(i <= 0) {
		clearInterval(timer);
		$("#FastModleNow").html('充值正在处理')
		$("#FastModleEnd").html('<li class="f_cf60">充值成功将有短信提示</li><li>您可以 <a href="account-myDeposit.html" class="f_cf60">查看充提记录</a></li>')
	}

	GHutils.load({
		url: "/jztrad/bankorder/isdone",
		data: {
			orderAmount: $('#deposit-Moneys').val(),
			payNo: _this.payNo,
			smsCode: $('#verifycode').val()
		},
		type: "post",
		callback: function(result) {
			if(result.errorCode == 0) {
				clearInterval(timer);
				$("#FastModleNow").html('恭喜您成功充值')
				$("#FastModleEnd").html('<li class="f_cf60">成功充值' + $('#verifycode').val() + '元</li><li>您可以 <a href="account.html" class="f_cf60">查看账户</a></li>')
			} else if(res.errorCode == -1 || res.errorCode == -2) {
				clearInterval(timer);
				$("#FastModleNow").html('充值失败')
				$("#FastModleEnd").html('<li class="f_cf60">支付失败？您可以 <a href="javascript:;" data-dismiss="modal" class="f_cf60">重新支付</a></li>')
			}
		}

	})
}

function doneFast(){
	i--;
	$("#FastModledw").html(i);
	if(i <= 0){
		clearInterval(timer);
		$("#FastModleNow").html('充值正在处理')
		$("#FastModleEnd").html('<li class="f_cf60">充值成功将有短信提示</li><li>您可以 <a href="account-myDeposit.html" class="f_cf60">查看充提记录</a></li>')
	}
	GHutils.load({
		url:"/jztrad/bankorder/isdone",
		data:{
			orderAmount: $('#deposit-Moneys').val(),
			payNo: _this.payNo,
			smsCode: $('#verifycode').val()
		},
		type:"post",
		callback:function(){
			if(result.errorCode == 0){
				clearInterval(timer);
				$("#FastModleNow").html('恭喜您成功充值')
				$("#FastModleEnd").html('<li class="f_cf60">成功充值' + $('#verifycode').val() + '元</li><li>您可以 <a href="account.html" class="f_cf60">查看账户</a></li>')
			
			}else if(res.errorCode == -1 || res.errorCode == -2){
				clearInterval(timer);
				$("#FastModleNow").html('充值失败')
				$("#FastModleEnd").html('<li class="f_cf60">支付失败？您可以 <a href="javascript:;" data-dismiss="modal" class="f_cf60">重新支付</a></li>')
			
			}
		}
	})
	
	
}
