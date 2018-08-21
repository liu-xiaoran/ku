import Http from './Http'
import Api from './Api'
import Tips from './Tips'
import Vue from 'vue'
export default {
  //修复JS浮点的加减乘除运算 Fadd加 Fsub减 Fmul乘 Fdiv除
  Fadd(a, b) {
      var c, d, e;
      try {
          c = a.toString().split(".")[1].length;
      } catch (f) {
          c = 0;
      }
      try {
          d = b.toString().split(".")[1].length;
      } catch (f) {
          d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (this.Fmul(a, e) + this.Fmul(b, e)) / e;
  },
  Fsub(a, b) {
      var c, d, e;
      try {
          c = a.toString().split(".")[1].length;
      } catch (f) {
          c = 0;
      }
      try {
          d = b.toString().split(".")[1].length;
      } catch (f) {
          d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (this.Fmul(a, e) - this.Fmul(b, e)) / e;
  },

  Fmul(a, b) {
      var c = 0,
          d = a.toString(),
          e = b.toString();
      try {
          c += d.split(".")[1].length;
      } catch (f) {}
      try {
          c += e.split(".")[1].length;
      } catch (f) {}
      return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  },

  Fdiv(a, b) {
      var c, d, e = 0,
          f = 0;
      try {
          e = a.toString().split(".")[1].length;
      } catch (g) {}
      try {
          f = b.toString().split(".")[1].length;
      } catch (g) {}
      return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.Fmul(c / d, Math.pow(10, f - e));
  },
  formatCurrency(num) {
      num = num?num.toString().replace(/\$|\,/g, ''):0;
      if (isNaN(num))
          num = "0";
      const sign = (num == (num = Math.abs(num)));
      num = Math.floor(this.Fmul(num, 100));
      let cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10)
          cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
          num = num.substring(0, num.length - (4 * i + 3)) + ',' +
          num.substring(num.length - (4 * i + 3));
      return (((sign) ? '' : '-') + num + '.' + cents);
  },
  formatIntCurrency(num) {
      num = parseInt(num.toString().replace(/\$|\,/g, '')).toString();
      if (isNaN(num))
          num = "0";
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
          num = num.substring(0, num.length - (4 * i + 3)) + ',' +
          num.substring(num.length - (4 * i + 3));
      return num;
  },
  formatFloatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0";
    const sign = (num == (num = Math.abs(num)));
    num = Math.floor(this.Fmul(num, 100));
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    return (((sign) ? '' : '-') + num + '.' + cents);
  },
  //格式化时间格式
  /*param{
   * time:0,
   * showtime:"true"
   * }
   *
   *
   * */
  formatTimestamp(param) {
    var d = new Date();
    // d.setTime(param && param.time || d);
    var timeNum=param && param.time || d.getTime();
    timeNum=parseInt(timeNum);
    if(d.getTimezoneOffset()!=null)
    timeNum=timeNum+d.getTimezoneOffset()*60000+480*60000
    d.setTime(timeNum);
    var datetime = null;
    var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
    var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

    if (!param.showtime) {
        datetime = x + y;
    } else {
        datetime = x;
    }
    return datetime;
  },
  //格式化时间格式
  /**
   *年月日
   * */
  formatDateToString(param) {
      if (param == null || param == "") {
        return "暂无";
      }
      var dateString = param.substring(0, 4) + "年" + param.substring(5, 7) + "月" + param.substring(8, 10) + "日"
      return dateString;
  },
  tapHandler(){
    if(!this._tapHandler){
      this._tapHandler=1;
      setTimeout(()=>{
        this._tapHandler=0;
      },500);
      return true
    }else{
      return false
    }
  },
  //从url中获取参数
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  async goBuyCheck(itemName,target){
    const productId=itemName.productOid||itemName.productId
    let res = await Http.post({
      url: Api.investPrepose,
      data: {
        productId: productId+""
      },
      extendInfo:["UserBasicInfo"],
      localCache:1
    })
    target.$preload(productId+"_investPrepose",res.data);
    if(res.code == 10000) {
      if(res.extendInfo&&res.extendInfo.UserBasicInfo&&!res.extendInfo.UserBasicInfo.isBindCard){
        target.$router.push({ name: 'bindcard'})
        return false
      }else if(res.extendInfo&&res.extendInfo.UserBasicInfo&&!res.extendInfo.UserBasicInfo.isPayPwd){
        target.$router.push({ name: 'setpaypwd'})
        return false
      }
      if (!res.data.valid&&res.data.validDesc) {
        Tips.toast(res.data.validDesc)
        return false
      }
      target.$preload(productId+"_investPrepose",res.data);
      let detail = await Http.post({
        url: itemName.productType=="CURRENT"?Api.getCurrentDetail:Api.getRegularDetail,
        data: {
          productOid: productId+""
        },
        login:1,
        localCache:1
      })
      if(detail.code == 10000) {
        target.$preload(productId,detail);
        
        target.$router.push({ name: 'Buy', params: { productId: productId,productType:itemName.productType }})
      }
    }
  }
}
