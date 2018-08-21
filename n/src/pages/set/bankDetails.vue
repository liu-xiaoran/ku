<template>
  <div id="bankDetails">
    <div class="mylist">
      <div class="list-cells">身份证信息</div>
      <div class="list-cell newBox">
        <div class="list-cell__bd">姓名</div>
        <div class="list-cell__ft">{{message.realName}}</div>
      </div>
      <div class="list-cell">
        <div class="list-cell__bd">身份证号</div>
        <div class="list-cell__ft">{{message.idCardNo}}</div>
      </div>
      <div class="list-cells">银行卡信息</div>
      <div class="list-cell newBox">
        <div class="list-cell__bd">开户行</div>
        <div class="list-cell__ft">{{message.bankName}}</div>
      </div>
      <div class="list-cell newBox">
        <div class="list-cell__bd">储蓄卡号</div>
        <div class="list-cell__ft">{{message.bankCardNo}}</div>
      </div>
      <div class="list-cell">
        <div class="list-cell__bd">手机号</div>
        <div class="list-cell__ft">{{message.bankPhone}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import wepy from "../../utils/wepy";
  import Api from "../../utils/Api";
  import Http from "../../utils/Http";
  import Tips from "../../utils/Tips";
  import Utils from "../../utils/Utils";
  import router from "../../router";
  export default {
    name:"bankDetails",
    data () {
      return {
        message: ''
      }
    },
    methods: {
      async getBankcard(){
        let res = await Http.post({
          url: Api.my.myBankcard,
          data: {}
        })
        if(res.code==10000) {
          this.message = res.data
        }
      }
    },
    created () {
       this.getBankcard()
    }
  }
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.list-cells {
  background-color: #f0f0f0;
  height: .866667rem /* 65/75 */;
  line-height: .866667rem /* 65/75 */;
  color: #a6a6a6;
  .font-dpr(30);
}
</style>

