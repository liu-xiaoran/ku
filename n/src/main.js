// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Preload from './utils/Preload'
import VueResource from 'vue-resource'

import wepy from './utils/wepy'
wepy.$instance.globalData.userinfo=(localStorage.getItem("userinfo")=='false'?eval(localStorage.getItem("userinfo")):localStorage.getItem("userinfo"))||""

var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

Vue.use(VueResource)
Vue.use(Preload)


Vue.config.productionTip = false
window.globalData = {
  // host:"http://106.14.236.8",
  // host:"http://106.14.236.168",
  //  "host" : 'http://test.zhangyuelicai.com',
  host:"https://www.zhangyuelicai.com",
  // "contractId" : "100720170310300000"
  contractId:"120620170712234580"
}


/* eslint-disable no-new */
global.vue=new Vue()
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
