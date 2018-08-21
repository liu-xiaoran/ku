
<template>
  <div id="setting">
    <div class="setlist">
      <div v-for="(item,index) in list">
        <div class="list-cells" @click="href(item.url||'')">
          <div class="list-cell" :class="{margin:(index==0),newBox:(list.length!=index+1)}">
            <div class="list-cell__bd">{{item.name}}</div>
            <div class="list-cell__ft list-cell__ft_in-access"><span class="prompt" :class="item.span=='可重置'?'prompts':''" v-if="item.span">{{item.span}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Tips from "../../utils/Tips";
import Utils from "../../utils/Utils";
import router from "../../router";
export default {
  name: "safe",
  data() {
    return {
      message: "",
      list: [
        {
          name: "登录密码",
          url: "/setlogpwd?key=set",
          span: "去设置"
        },
        {
          name: "交易密码",
          url: "/setpaypwd",
          span: "去设置"
        }
      ]
    }
  },
  created() {
    this.getUserInfos();
  },
  methods: {
    href(url) {
      if (!Utils.tapHandler()) {
        return;
      }
      if (url) {
        this.$router.push({
          path:url
        })
      }
    },
    async getUserInfos() {
      let res = await Http.post({
        url: Api.user.getUserInfo,
        data: {}
      });
      if (res.code == 10000) {
        this.getUserInfoss(res.extendInfo);
      }
    },
    async getUserInfoss(extendInfo) {
      if (extendInfo.UserBasicInfo.isPwd == 1) {
        this.list[0].span = "可重置";
        this.list[0].url = "/setlogpwd?key=change";
      }
      if (extendInfo.UserBasicInfo.isPayPwd == 1) {
        this.list[1].span = "可重置";
        this.list[1].url = `/findpwd?key=payPwdUpdate&phone=${extendInfo.UserBasicInfo.phone}`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.setlist {
  position: relative;
  .font-dpr(30);
}
.margin {
  margin-top: 0.266667rem;
}
.list-cell {
  margin-left: 0;
}
.prompts {
  color: #e45038;
}
</style>
