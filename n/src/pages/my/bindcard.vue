<template>
	<div class="bindcard">
		<div class="formtop">身份信息{{nameSure}}</div>
		<div class="inputBoxs">
			<div class="inputs newBox">
				<span class="inputspan">姓名</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" type="text" placeholder="请输入真实姓名" id="name" v-model="name" :disabled='nameLock' />
				</p>
				<v-touch class="eliminate" v-if="name && !nameLock" @tap="remove('name')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
			<div class="inputs">
				<span class="inputspan">身份证号</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" type="text" placeholder="请输入身份证号码" id="IDcard" v-model="IDcard" :disabled="nameLock" />
				</p>
				<v-touch class="eliminate" v-if="IDcard && !nameLock" @tap="remove('IDcard')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
		</div>
		<div class="formtop">银行卡信息</div>
		<div class="inputBoxs">
			<div class="section newBox list-cell__ft_in-access">
				<div class="section__title inputspan">选择银行</div>
				<div class="pickers list-cell__bd" @click="bandShow">{{bankName}}</div>
			</div>
			<div class="inputs newBox">
				<span class="inputspan">储蓄卡号</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入银行卡号" id="bankCard" v-model="bankCard" />
				</p>
				<v-touch class="eliminate" v-if="bankCard" @tap="remove('bankCard')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
			<div class="inputs newBox">
				<span class="inputspan">预留手机号</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" oninput="if(value.length>11)value=value.slice(0,11)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入银行预留手机号码" id="bankPhone" v-model="bankPhone" />
				</p>
				<v-touch class="eliminate" v-if="bankPhone" @tap="remove('bankPhone')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
			</div>
			<div class="inputs">
				<span class="inputspan">手机验证码</span>
				<p class="list-cell__bd">
					<input class="list-cell__bd_inputs" oninput="if(value.length>6)value=value.slice(0,6)" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" placeholder="请输入短信验证码" placeholder-style="color:#d4d4d4" id="vercode" v-model="vercode" />
				</p>
				<v-touch class="eliminate" v-if="vercode" @tap="remove('vercode')">
					<div class="chasBtn iconfont icon-cha3"></div>
				</v-touch>
				<button class="getVercode" :disabled="bankPhone.length!=11||isVericode.isSend" @click="getVericode">{{isVericode.text}}</button>
			</div>
		</div>
		<div class="setBtn">
			<button class="comBtn" :disabled="!vercode||vercode.length<6||!isChoose" @click="submit">下一步</button>
		</div>
		<div class="agreeBox">
			<div class="agreeBox">
				<CheckboxOption :value="isChoose" @click="bindAgreeChange">我已阅读并同意</CheckboxOption>
				<a class="agreement" :href="'/actives1/static/protocolDetail?type=fast'+'&t='+new Date().getTime()">《快捷支付服务协议》</a>
			</div>
		</div>
		<div class='warmTip'>
			<div style="color:#3b3b3b;">温馨提示：</div>
			<div>{{warmTip}}</div>
		</div>
		<div class="httpsTip">
			<div class="httpsimg iconfont icon-anquan"></div>
			<div style="floatnquat;flex:1;">https加密的安全通讯协议、128位密钥、防火墙隔离系统，有效的入侵防范及容灾备份等，确保平台数据安全无忧。</div>
		</div>
		<van-popup v-model="modal" position="bottom">
			<van-picker showToolbar v-if="modal" :itemHeight="itemHeight" title="" :columns="pickerColumns" @change="onChange" @cancel="onCancel" @confirm="onConfirm" />
		</van-popup>
		<logBase></logBase>
	</div>
</template>
<script>
	import { CheckboxOption } from "../../components/Checkbox";
	import Api from "../../utils/Api";
	import Http from "../../utils/Http";
	import Tips from "../../utils/Tips";
	import Utils from "../../utils/Utils";
  import router from "../../router";
  import writeLog from '../../utils/writeLog';
	import Vue from 'vue';
	import { Popup } from 'vant';
	import Picker from '../../components/picker/index';
	import logBase from '../logBase';

	Vue.component(Popup.name, Popup);
	Vue.component(Picker.name, Picker);
	let pickerlist = [];
	export default {
		name: "bindcard",
		components: {
			CheckboxOption,
			logBase
		},
		data() {
			return {
				itemHeight: parseInt(lib.flexible.rem2px(1.173333)),
				pickerColumns: [{
					values: [],
					className: 'column1'
				}],
				lockDate: {},
				modal: false,
				bankName: "",
				isChoose: true,
				timer: null,
				isVericode: {
					isSend: false,
					text: "获取验证码"
				},
				bankCode: "",
				warmTip: "",
				nameLock: false,
				nameSure: "",
				value: [0],
        bankCard: "",
        bankPhone:"",
        IDcard:"",
        name:"",
        vercode:""
			};
		},
		watch: {
      bankCode(newValue,oldValue){
        if(!this.isEmptyObject(this.lockDate)&&(this.bankCode != this.lockDate.bankCode)){
          this.clearVercode()
        }
      },
      bankPhone(newValue,oldValue){
        if(!this.isEmptyObject(this.lockDate)&&(this.bankPhone != this.lockDate.bankPhone)){
          this.clearVercode()
        }
      },
      IDcard(newValue,oldValue){

        if(!this.isEmptyObject(this.lockDate)&&(this.IDcard != this.lockDate.certNo)){
          this.clearVercode()
        }
        //卡号匹配英文和数字
        if(!/^[a-z0-9]+$/i.test(newValue)){
          this.IDcard = newValue.slice(0,newValue.length-1)
        }
      },
      name(newValue,oldValue){
        if(!this.isEmptyObject(this.lockDate)&&(this.name != this.lockDate.realName)){
          this.clearVercode()
        }
      },
			bankCard(newValue, oldValue) {
				if(!this.isEmptyObject(this.lockDate) && (this.bankCard != this.lockDate.bankCardNo)) {
					this.clearVercode()
				}
				if(
					this.bankCard &&
					this.bankCard.toString().length >= 10 &&
					newValue != oldValue
				) {
					this.bankCardNoVerify();
				}
      }
		},
		methods: {
			onChange(picker, values) {

      },
      clearVercode(){
        document.activeElement.blur();
        Tips.error("更改信息需要重新获取验证码");
        clearInterval(this.timer);
        this.isVericode = {
          isSend: false,
          text: "获取验证码"
        };
        this.vercode = "";
        this.lockDate = {}
      },
			onCancel() {
				this.modal = false
			},
			onConfirm(values) {
				this.bankName = values[0].split('&')[0]
				this.modal = false
			},
			remove(type) {
				if(type == "IDcard") {
					this.IDcard = "";
				} else if(type == "vercode") {
					this.vercode = "";
				} else if(type == "bankCard") {
					this.bankCard = "";
				} else if(type == "bankPhone") {
					this.bankPhone = "";
				} else if(type == "name") {
					this.name = "";
				}
			},
			bindAgreeChange(e) {
				this.isChoose = e;
			},
			getVericode() {
				if(this.isVericode.isSend) {
					return;
				}
				this.authVerify();
				this.onClickGetVericode();
			},
			bandShow() {
				if(this.bankName) {
					pickerlist.forEach((element, index) => {
						if(element.indexOf(this.bankName) >= 0) {
							this.pickerColumns = [{
								values: pickerlist,
								defaultIndex: index,
								className: 'column1'
							}]
						}
					});
				}

				this.modal = true;
			},
			submit() {
				if (!Utils.tapHandler()) {
				  return;
				}
				this.bindBankCard();
				this.onClickSubmit();
      },
      //点击获取验证码日志上报
			async onClickGetVericode() {
				writeLog.write({
					evt: "AddBankGetVeriCodeClick",
					ext: {
						name: this.name.substring(this.name.length - 1),
						idcard: this.IDcard.substring(this.IDcard.length - 4),
						idcardlength: this.IDcard.length,
						bankname: this.bankName,
						bankcardnum: this.bankCard.substring(
							this.bankCard.length - 4
						),
						bankcardlength: this.bankCard.length,
						tel: this.bankPhone.substring(this.bankPhone.length - 4),
						tellength: this.bankPhone.length
					}
				});
      },
      //点击绑卡日志上报
			async onClickSubmit() {
				writeLog.write({
					evt: "AddBankNextClick",
					ext: {
						oid: this.lockDate.orderNo.substring(
							this.lockDate.orderNo.length - 4
						),
						vericode: this.vercode
					}
				});
      },
      //银行卡列表
			async bankList() {
				let res = await Http.post({
					url: "/payment/agency/bank/list"
				});
				if(res.code==10000) {
					pickerlist = []
					res.data.bankList.forEach((element) => {
						pickerlist.push(element.bankName + "& (充值限额：" + (element.payOneLimit ? (element.payOneLimit / 10000 + "万") : ("无限额")) + "/笔，" + (element.payDayLimit ? (element.payDayLimit / 10000 + "万") : ("无限额")) + "/日)")
					});

					this.pickerColumns = [{
						values: pickerlist,
						defaultIndex: Math.floor(pickerlist.length * 0.5),
						className: 'column1'
					}]
					console.log("this.pickerColumns", this.pickerColumns)
				} else {
          Tips.error(res.message);
				}
      },
      //绑卡前置验证
			async bindBankCardPreVerify() {
				let res = await Http.post({
					url: "/payment/account/bindBankCardPreVerify"
				});
				if(res.code == 10000) {
					if(!res.data.valid && res.data.validDesc) {
						Tips.error(res.data.validDesc);
					}
					this.warmTip = res.data.warmPrompt;
					if(res.data.certNo && res.data.realName) {
						this.name = res.data.realName;
						this.IDcard = res.data.certNo;
						this.nameLock = true;
						this.nameSure = "（已实名认证，不可更改）";
					}
				} else {
					Tips.error(res.message);
				}
      },
      //验证银行卡
			async bankCardNoVerify() {
				let res = await Http.post({
					url: "/payment/account/bankCardNoVerify",
					data: {
						bankCardNo: this.bankCard
					}
				});
				if(res.code == 10000) {
					this.bankCode = res.data.bankCode;
					this.bankName = res.data.bankName;
				}
      },
      //发送验证码
			async authVerify() {
				this.isVericode.isSend = true;
				let res = await Http.post({
					url: "/payment/account/authVerify",
					data: {
						realName: this.name,
						certNo: this.IDcard,
						bankPhone: this.bankPhone,
						bankCardNo: this.bankCard,
						bankCode: this.bankCode
					}
				});
				if(res.code == 10000) {
					this.lockDate = {
						realName: this.name,
						certNo: this.IDcard,
						bankPhone: this.bankPhone,
						bankCardNo: this.bankCard,
						bankCode: this.bankCode,
						orderNo: res.data.orderNo
					};
					this.countDown(120);
				} else {
					this.isVericode.isSend = false;
				}
      },
      // 绑定银行卡
			async bindBankCard() {
				let res = await Http.post({
					url: "/payment/account/bindBankCard",
					data: {
						orderNo: this.lockDate.orderNo,
						securityCode: this.vercode
					},
					extendInfo: ["UserBasicInfo"]
				});
				if(res.code == 10000) {
					if(!res.extendInfo.UserBasicInfo.isPayPwd) {
						this.$router.replace({
							path: "/setpaypwd"
						});
					} else {
						this.$router.go(-1);
					}
				} else {
					writeLog.write({
						evt: "AddBankResult",
						ext: res,
						ret: "fail"
					});
				}
			},
			isEmptyObject(obj) {
        return Object.keys(obj).length==0 //判断对象是否为空
			},
			countDown(time) {
				let that = this;
				that.timer = setInterval(function() {
					if(time > 0) {
						that.isVericode.isSend = true;
						that.isVericode.text = `重新获取(${time})`;
						time--;
					} else {
						clearInterval(that.timer);
						that.isVericode = {
							isSend: false,
							text: "获取验证码"
						};
					}
				}, 1000);
			},
			validate() {
				const rules = [{
						value: this.name || "",
						method: "required",
						message: "请输入真实姓名"
					},
					{
						value: this.idcard || "",
						method: "required",
						message: "请输入身份证号"
					}
				];
				return this.check(rules);
			}
		},
		created() {
			this.bindBankCardPreVerify();
			this.bankList();
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.lockDate = {};
		}
	};
</script>
<style lang="scss">
	@import '../../style/vant-css/popup.scss';
	@import '../../style/vant-css/picker.scss';
</style>
<style lang="less" scoped>
	@import "../../style/utils.less";
	.inputBoxs {
		margin-top: 0;
	}
  .inputs input{
    background: #ffffff;
  }
	.inputspan {
		width: 2.2rem;
		margin-right: 0.4rem;
	}

	.picker {
		height: 0.586667rem;
	}

	.section {
		height: 1.173333rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		.font-dpr(28);
		color: #3b3b3b;
		padding-right: 4%;
	}

	.formtop {
		color: #a6a6a6;
		.font-dpr(24);
		height: 1.173333rem;
		line-height: 1.173333rem;
		padding-left: 4%;
	}

	.setBtn {
		margin: 0.72rem 5% 0;
	}

	.agreeBox {
		margin-top: 0.266667rem;
	}

	.warmTip {
		color: #a6a6a6;
		.font-dpr(24);
		padding: 0.266667rem 4%;
	}

	.httpsTip {
		// position: absolute;
		// z-index: 10;
		padding:2% 4% 0;
		color: #5f6783;
		.font-dpr(24);
		bottom: 3%;
		display: flex;
	}

	.httpsimg {
		height: 0.4rem;
		margin-right: 0.066667rem;
		color: #347e44;
		line-height: 0.426667rem;
		.font-dpr(32);
	}

	.pickers {
		height: 100%;
	}
</style>
