<template>
  <div id="setting">
    <div class="setlist">
      <div v-for="(item,index) in list">
        <v-touch class="list-cells" @tap="href(item.url||'')">
          <div class="list-cell" :class="(list.length!=index+1)?'newBox':''">
            <div class="list-cell__bd">{{item.name}}</div>
            <div class="list-cell__ft" :class="item.arrow?'list-cell__ft_in-access':''"><span :class="item.arrow?'prompt':''" v-if="item.span">{{item.span}}</span></div>
          </div>
        </v-touch>
      </div>
    </div>
    <button @click="signOut" class="signOutBtn">安全退出</button>
    <logBase></logBase>
  </div>
</template>
<script>
import wepy from "../../utils/wepy";
import Api from "../../utils/Api";
import Http from "../../utils/Http";
import Tips from "../../utils/Tips";
import Utils from "../../utils/Utils";
import router from "../../router";
import logBase from '../logBase';
export default {
  name:"setting",
  components: {
    logBase
  },
  data () {
    return {
      list: [{
        name: '实名认证',
        span: '未认证'
      },{
        name: '手机认证',
        span: ''
      },{
        name: '银行卡绑定',
        span: '未绑定',
        url: '',
        arrow: true
      },{
        name: '账号安全',
        arrow: true,
        url: '/safe'
      }]
    }
  },
  methods: {
    href(url) {
      if(!Utils.tapHandler()){
        return
      }
      if(url) {
        if(url.indexOf('bankcard') >= 0) {
          this.$preload('setInfo',Http.post({
            url: Api.my.myBankcard,
            data: {}
          }))
        } else if(url.indexOf('safe') >= 0) {
          this.$preload('setInfo',Http.post({
            url: Api.user.getUserInfo,
            data: {}
          }))
        }
        this.$router.push({
          path: url
        })
      }
    },
    async signOut() {
      if(!Utils.tapHandler()){
        return
      }
      let res = await Http.post({
        url: Api.user.logout,
        data: {}
      })
      if(res.code == 10000) {
        wepy.$instance.globalData.userinfo = null
        wepy.$instance.globalData.session_id = null
        wepy.removeStorage({key: 'userinfo'})
        wepy.removeStorage({key: 'session_id'})
        wepy.removeStorage({key: 'isEye'})
        wepy.setStorage({
          key: 'userinfo',
          data: false
        });
        wepy.$instance.globalData['userinfo'] = false;
        this.$router.go(-1)
      }
    },
    async getUserInfos() {
      let res = await Http.post({
        url: Api.user.getUserInfo,
        data: {}
      })
      if(res.code==10000) {
        this.getUserInfoss(res.extendInfo)
      }
    },
    async getUserInfoss(extendInfo) {
      this.list[1].span = extendInfo.UserBasicInfo.phone
      if (extendInfo.UserBasicInfo.isRealVerifiedName == 1) {
        this.list[0].span = extendInfo.UserBasicInfo.nickname
      } else {
        this.list[0].span = '未认证'
      }
      if(extendInfo.UserBasicInfo.isBindCard == 1) {
        this.list[2].span = '1张'
        this.list[2].url = '/bankcard'
      } else {
        this.list[2].span = '未綁定'
        this.list[2].url = '/bindcard'
      }
    }
  },
  created(){
    this.getUserInfos()
  }
}
</script>
<style lang="less" scoped>
@import "../../style/utils.less";
.setlist {
  position:relative;
  .font-dpr(30);
}
.list-cell {
  margin-left: 0;
}
.signOutBtn {
  width: 90%;
  height: 1.2rem /* 90/75 */;
  line-height: 1.2rem /* 90/75 */;
  background: #fff;
  color: #3b3b3b;
  .font-dpr(33);
  margin-top: 1.133333rem /* 85/75 */;
  margin-left: 5%;
  border: none;
  border-style: none;
}

</style>

