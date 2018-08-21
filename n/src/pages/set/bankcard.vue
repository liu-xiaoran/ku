<template>
  <div id="bankcard">
    <v-touch class="bankBoxs" :style="{background:message.bgColor}" @tap="toBankDetails">
      <img v-if="message.bankLogo" class="bankLogo" :src="message.bankLogo" />
      <div class="bankCons" v-if="message">
        <span>{{message.bankName}}</span>
        <span class="bankCardNos">{{message.bankCardNo}}</span>
        <span style="font-size: 22rpx;">充值限额:{{message.payOneLimit/10000}}万/笔,{{message.payDayLimit/10000?(message.payDayLimit/10000+'万'):'无限额'}}/日</span>
      </div>
    </v-touch>
    <span class="tishi">用户申请解绑时 , 无在投资金 , 账户余额为0</span>
    <button class="comBtn" @click="relieveBankCard">解绑银行卡</button>
    <div class="model" v-if="model">
        <div class="confimBox">
          <p class="title">提示</p>
          <p class="context">确认解绑该银行卡?</p>
          <div class="btn"><button class="cancel" @click="cancel">取消</button><button @click="relieve">确认</button></div>
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
    name:"bankcard",
    data () {
      return {
        host: Http.host,
        message: '',
        model:false
      }
    },
    methods: {
      relieveBankCard() {
        this.model = true;
      },
      cancel(){
        this.model =false;
      },
      toBankDetails() {
        if(!Utils.tapHandler()){
          return
        }
        this.$preload('bankDetails',this.message)
        this.$router.push({
          path: "/bankDetails"
        })
      },
      async relieve() {
        if(!Utils.tapHandler()){
          return
        }
        let res = await Http.post({
          url: Api.set.unbindBankCard,
          data: {}
        })
        if(res.code==10000) {
         this.$router.replace({
           name:"setting"
         })
        }
        this.model =false;
      },
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
 #bankcard {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .bankBoxs {
    width: 94%;
    height: 2.346667rem /* 176/75 */;
    border-radius: .08rem /* 6/75 */;
    margin-top:.36rem /* 27/75 */;
    display: flex;
    justify-content: center;
    padding-top:.4rem /* 30/75 */;
  }
  .bankLogo {
    /*margin: 0 38rpx;*/
    margin: 0 .266667rem /* 20/75 */;
  }
  .bankCons {
    display: flex;
    flex-direction: column;
    flex: 1;
    color: #fff;
    .font-dpr(30);
  }
  .bankCardNos {
    .font-dpr(40);
    margin-bottom: .08rem /* 6/75 */;
  }
  .tishi {
    margin:.426667rem /* 32/75 */ 0;
    color: #a6a6a6;
    .font-dpr(24);
  }
  .comBtn {
    width: 86%;
    border-radius: .08rem /* 6/75 */;
  }
  .model{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5)
  }
  .confimBox{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-80%);
    background: #ffffff;
    width: 70%;
    height: 2.666667rem /* 200/75 */;
    border-radius:.16rem /* 12/75 */;
    overflow: hidden;
    display: flex;
    flex-direction:column;
    align-items:center;
  }
  .title{
    height: .666667rem /* 50/75 */;
    .font-dpr(30);
    font-weight: bold;
    padding-top: .266667rem /* 20/75 */;
  }
  .context{
    height:.666667rem /* 50/75 */;
    .font-dpr(24);
  }
  .btn{
    height: 1.066667rem /* 80/75 */;
    margin-top: .266667rem /* 20/75 */;
    border-top: .013333rem /* 1/75 */ solid #dddddd;
    width: 100%;
    display: flex;
    flex-direction:row;
    button{
      background: #ffffff;
      border: none;
      border-style: none;
      flex-grow:1;
      .font-dpr(30);
      color:#0066cc;
    }
    .cancel{
      border-right: .013333rem /* 1/75 */ solid #dddddd;
    }
  }
</style>
