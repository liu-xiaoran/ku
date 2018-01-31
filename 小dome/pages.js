var AccountRecord = function () {
	return this;
}

AccountRecord.prototype = {
	init: function () {
		this.param = {
			type2: "",
			timeType: "",
			startTime: "",
			endTime: "",
			extend: 1,
			pageInfo: {
				pageSize: 7,
				pageNo: 1
			}
		}
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function () {
		var _this = this
		_this.getRecord(_this.param)
	},
	getRecord: function (param) {
		var _this = this
		var getRecord = function () {
			GHutils.load({
				url: "",
				data: param,
				type: "post",
				extendInfo: ['MoneyType'],
				// loginStatus: function(resp) {
				// 	GHutils.loginOut(true)
				// },
				callback: function (result) {
					if(result.code == 10001){
						window.location.href = '/index.html';
						return false
					}
					if (result.code == 10000) {
						//改二级筛选为动态
						if (!$("#orderTypeOptions").html()) {
							var moneyTypes = ""
							GHutils.forEach(result.extendInfo.MoneyType, function (idx, moneyType) {
								if (moneyType.key) {
									moneyTypes += '<li><a href="javascript:;" data-proType="' + moneyType.key + '">' + moneyType.value + '</a></li>'
								} else {
									moneyTypes += '<li><a href="javascript:;" class="active" data-proType="' + moneyType.key + '">' + moneyType.value + '</a></li>'
								}
							})
							$("#orderTypeOptions").html(moneyTypes)
						}

						if (result.data.list) {
							$('#noReCord').addClass('none')
							$('#hadRecord').removeClass('none')
						} else {
							$('#hadRecord').addClass('none')
							$('#noReCord').removeClass('none')
						}
						$(".bottmPage").html("共" + result.data.pageInfo.totalSize + "条记录&nbsp&nbsp&nbsp&nbsp" + result.data.pageInfo.pageNo + "/" + result.data.pageInfo.totalPage + "页")
						//填写数据前图片对应的类型,左边为图片名称，右边为对应的后端type1字段，增加时添加即可
						var preImgArr = {
							"ti": "WITH",
							"dong": "FREE",
							"chong": "RECH",
							"ding": "DING",
							"zhang": "HUO",
							"xian": "RED",
							"tiyan": "TYJ"
						}

						function preImg(type) {
							for (var key in preImgArr) {
								
								if (preImgArr[key] == type)
									return key
							}
						}
						//数据进出类型及金额
						function ioType(io, amount) {
							var ioText = ""
							amount = amount || 0;
							if (io == 1) {
								ioText = '<li class="col-xs-2" style="color:#ff836b;">+' + GHutils.formatCurrency(amount) + '</li>'
							} else if (io == -1) {
								ioText = '<li class="col-xs-2" style="color:#91cb72;">-' + GHutils.formatCurrency(amount) + '</li>'
							} else if (io == 0) {
								ioText = '<li class="col-xs-2" style="color:#999999;">' + GHutils.formatCurrency(amount) + '</li>'
							} else {
								ioText = '<li class="col-xs-2" style="color:#999999;">信息错误' + GHutils.formatCurrency(amount) + '</li>'
							}
							return ioText
						}
						//判断备注的类型显示，如果有卡号显示卡号否则显示产品名称否则显示红包类型
						function beiType(a, b, c) {
							if (a) {
								return "交易卡号：" + a
							} else if (b) {
								return "交易产品：" + b
							} else if (c) {
								return "红包名称：" + c
							} else {
								return "类型错误"
							}
						}
						var records = '';
						GHutils.forEach(result.data.list, function (idx, record) {
							records += '<ul class="container-fluid-content row"><li class="col-xs-4"><img src="static/images/' + preImg(record.type1) + '.png" class="yuanPic"><div class="yuanText"><p>' + record.type2CH + '</p><p style="color:#999999;">' + GHutils.formatTimestamp({
								time: record.eventTime,
								showtime: "false"
							}) + '</p></div></li>' + ioType(record.io, record.amount) + '<li class="col-xs-1"></li><li class="col-xs-5" style="text-align:left;"><p>' + beiType(record.cardNo, record.productName, record.couponName) + '</p><p>交易流水：' + record.oid + '</p></li></ul>'
						})
						$('#tradeRecord').html(records)
						_this.createPage(Math.ceil(result.data.pageInfo.totalSize / 7), param.pageInfo.pageNo)
					}
				}
			})
		}()
	},
	bindEvent: function () {
		var _this = this;

		$('#orderTypeOptions').on('click', "li a", function () {
			if ($(this).attr('class') == 'active') {
				return false;
			}
			$('#orderTypeOptions').find('a').removeClass('active')
			$(this).addClass('active')
			$('#moreRecord').attr('data-page', 1)
			_this.param.type2 = $(this).attr('data-proType')
			_this.param.pageInfo.pageNo = 1
			parseParam(_this.param)
		})

		$('#timeTypeOptions li a').on('click', function () {
			$('#timeTypeOptions').find('a').removeClass('active')
			if ($(this).attr('data-timeType') == "time") {
				if (!$("#inputDate1").val()) {
					$("#myBordIcon1").trigger("click")
					return false;
				}
				if (!$("#inputDate2").val()) {
					$("#myBordIcon2").trigger("click")
					return false;
				}
				_this.param.startTime = $("#inputDate1").val()
				_this.param.endTime = $("#inputDate2").val()
				_this.param.timeType = ""
			} else {
				$(".myBordInput").val("")
				_this.param.timeType = $(this).attr('data-timeType')
				_this.param.startTime = '';
				_this.param.endTime = '';
			}
			$(this).addClass('active')
			$('#moreRecord').attr('data-page', 1)
			_this.param.pageInfo.pageNo = 1
			parseParam(_this.param)
		})

		$('#moreRecord').on('click', function () {
			if ($(this).is('.active')) {
				return false;
			}
			_this.param.pageInfo.pageNo = parseInt($(this).attr('data-page')) + 1
			$(this).attr('data-page', _this.param.pageInfo.pageNo)
			parseParam(_this.param)
		})

		function parseParam(param) {
			_this.getRecord(param)
		}
	},
	createPage: function (pageCount, current) {
		$(".tcdPageCode").show()
		if (pageCount <= 1) {
			$(".tcdPageCode").hide()
		}
		var _this = this;
		$(".tcdPageCode").createPage({
			pageCount: pageCount,
			current: current,
			backFn: function (page) {
				_this.param.pageInfo.pageNo = page;
				_this.getRecord(_this.param);
			}
		});
	}
}

$(function () {
	new AccountRecord().init();
	var Todays = new Date().toLocaleDateString().replace(/\//g, "-")
	// console.log(Todays)
	$(".myBordInput").attr("placeholder", Todays);
	var picker1 = $('#datetimepicker1').datetimepicker({
		format: 'YYYY-MM-DD',
		locale: moment.locale('zh-cn'),
		//minDate: '2017-7-1'  
		maxDate: Todays
	});
	var picker2 = $('#datetimepicker2').datetimepicker({
		format: 'YYYY-MM-DD',
		locale: moment.locale('zh-cn'),
		maxDate: Todays
	});
	//动态设置最小值  
	picker1.on('dp.change', function (e) {
		// picker2.data('DateTimePicker').maxDate(Todays);
		picker2.data('DateTimePicker').minDate(e.date);
		// console.log(Date.parse(e.date._d)) //时间戳
	})
	//动态设置最大值  
	picker2.on('dp.change', function (e) {
		picker1.data('DateTimePicker').maxDate(e.date);
		// picker2.data('DateTimePicker').maxDate(Todays);
		// picker1.data('DateTimePicker').maxDate(Todays);
	})
})