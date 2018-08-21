import Vue from 'vue'
import Router from 'vue-router'
import Tab from '@/pages/Tab'
import Home from '@/pages/home/Home'
// import Sign from '@/pages/home/Sign'
// import Signdetail from '@/pages/home/Signdetail'
// import Current from '@/pages/finance/Current'
// import Regular from '@/pages/finance/Regular'
import productTn from '@/pages/finance/productTn'
// import productDetail from '@/pages/finance/productDetail'
// import Buy from '@/pages/finance/buy'
// import CouponList from '@/pages/finance/couponlist'
// import Result from '@/pages/finance/result'
import My from '@/pages/my/My'
// import bindcard from '@/pages/my/bindcard'
import setting from '@/pages/my/setting'
import Mycurrent from '@/pages/my/Mycurrent'
// import Mycurrentinfo from '@/pages/my/Mycurrentinfo'
import Myregular from '@/pages/my/Myregular'
// import Myregularinfo from '@/pages/my/Myregularinfo'
import Mycouponlist from '@/pages/my/Mycouponlist'
// import Mycoupondetails from '@/pages/my/Mycoupondetails'
import Mysurprised from '@/pages/my/Mysurprised'
import Help from '@/pages/my/Help'
import Message from '@/pages/my/Message'
import Letterview from '@/pages/my/Letterview'
// import Assetsdetail from '@/pages/my/Assetsdetail'
import safe from '@/pages/set/safe'
// import bankcard from '@/pages/set/bankcard'
// import bankDetails from '@/pages/set/bankDetails'
// import Feedback from '@/pages/set/Feedback'
// import Aboutus from '@/pages/set/Aboutus'
// import Login from '@/pages/user/Login'
// import Register from '@/pages/user/Register'
import setlogpwd from '@/pages/user/setlogpwd'
import setpaypwd from '@/pages/user/setpaypwd'
import findpwd from '@/pages/user/findpwd'
import Recharge from '@/pages/money/Recharge'
// import Results from '@/pages/money/Results'
import Withdrawals from '@/pages/money/Withdrawals'
// import Confirm from '@/pages/money/Confirm'
// import Redeem from '@/pages/money/Redeem'

import depositRecord from '@/pages/my/depositRecord'
// import recordDetail from '@/pages/my/recordDetail'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    redirect: '/pages/home'
  }, {
    path: '/pages',
    name: 'Tab',
    component: Tab,
    children: [{
      path: "home",
      name: 'Home',
      component: Home
    }, {
      path: 'current',
      name: 'Current',
      // component: Current
      component: resolve => require(['@/pages/finance/Current'], resolve), //懒加载
    }, {
      path: 'regular',
      name: 'Regular',
      // component: Regular
      component: resolve => require(['@/pages/finance/Regular'], resolve), //懒加载
    }, {
      path: 'my',
      name: 'My',
      component: My
    }]
  }, {
    path: '/login',
    name: 'Login',
    component: resolve => require(['@/pages/user/Login'], resolve), //懒加载
  }, {
    path: '/productDetail',
    name: 'productDetail',
    // component: productDetail
    component: resolve => require(['@/pages/finance/productDetail'], resolve), //懒加载
  }, {
    path: '/productTn',
    name: 'productTn',
    component: productTn
  }, {
    path: '/setlogpwd',
    name: 'setlogpwd',
    component: setlogpwd
  }, {
    path: '/setpaypwd',
    name: 'setpaypwd',
    component: setpaypwd
  }, {
    path: '/findpwd',
    name: 'findpwd',
    component: findpwd
  }, {
    path: '/setting',
    name: 'setting',
    component: setting
  }, {
    path: '/safe',
    name: 'safe',
    component: safe
  }, {
    path: '/depositRecord',
    name: 'depositRecord',
    component: depositRecord
  }, {
    path: '/recordDetail',
    name: 'recordDetail',
    component: resolve => require(['@/pages/my/recordDetail'], resolve), //懒加载
  }, {
    path: '/timeSelect',
    name: 'timeSelect',
    component: resolve => require(['@/pages/my/timeSelect'], resolve), //懒加载
  }, {
    path: '/bankcard',
    name: 'bankcard',
    component: resolve => require(['@/pages/set/bankcard'], resolve), //懒加载
  }, {
    path: '/bindcard',
    name: 'bindcard',
    component: resolve => require(['@/pages/my/bindcard'], resolve), //懒加载
  }, {
    path: '/bankDetails',
    name: 'bankDetails',
    component: resolve => require(['@/pages/set/bankDetails'], resolve), //懒加载
  }, {
    path: '/register',
    name: 'Register',
    component: resolve => require(['@/pages/user/Register'], resolve), //懒加载
  }, {
    path: '/buy/:productId/:productType',
    name: 'Buy',
    // component: Buy
    component: resolve => require(['@/pages/finance/Buy'], resolve), //懒加载
  }, {
    path: '/recharge',
    name: 'Recharge',
    component: Recharge
  }, {
    path: '/couponlist',
    name: 'CouponList',
    component: resolve => require(['@/pages/finance/couponlist'], resolve), //懒加载
  }, {
    path: '/result',
    name: 'Result',
    // component: Result
    component: resolve => require(['@/pages/finance/result'], resolve), //懒加载
  }, {
    path: '/results',
    name: 'Results',
    component: resolve => require(['@/pages/money/Results'], resolve), //懒加载
  }, {
    path: '/withdrawals',
    name: 'Withdrawals',
    component: Withdrawals
  }, {
    path: '/confirm',
    name: 'Confirm',
    component: resolve => require(['@/pages/money/Confirm'], resolve), //懒加载
  }, {
    path: '/mycurrent',
    name: 'Mycurrent',
    component: Mycurrent
  }, {
    path: '/mycurrentinfo',
    name: 'Mycurrentinfo',
    component: resolve => require(['@/pages/my/Mycurrentinfo'], resolve), //懒加载
  }, {
    path: '/redeem',
    name: 'Redeem',
    component: resolve => require(['@/pages/money/Redeem'], resolve), //懒加载
  }, {
    path: '/myregular',
    name: 'Myregular',
    component: Myregular
  }, {
    path: '/myregularinfo',
    name: 'Myregularinfo',
    component: resolve => require(['@/pages/my/Myregularinfo'], resolve), //懒加载
  }, {
    path: '/mycouponlist',
    name: 'Mycouponlist',
    component: Mycouponlist
  }, {
    path: '/mycoupondetails',
    name: 'Mycoupondetails',
    component: resolve => require(['@/pages/my/Mycoupondetails'], resolve), //懒加载
  }, {
    path: '/mysurprised',
    name: 'Mysurprised',
    component: Mysurprised
  }, {
    path: '/help',
    name: 'Help',
    component: Help
  }, {
    path: '/message',
    name: 'Message',
    component: Message
  }, {
    path: '/letterview',
    name: 'Letterview',
    component: Letterview
  }, {
    path: '/assetsdetail',
    name: 'Assetsdetail',
    component: resolve => require(['@/pages/my/Assetsdetail'], resolve), //懒加载
  }, {
    path: '/feedback',
    name: 'Feedback',
    component: resolve => require(['@/pages/set/Feedback'], resolve), //懒加载
  }, {
    path: '/aboutus',
    name: 'Aboutus',
    component: resolve => require(['@/pages/set/Aboutus'], resolve), //懒加载
  }, {
    path: '/sign',
    name: 'Sign',
    component: resolve => require(['@/pages/home/Sign'], resolve), //懒加载
  }, {
    path: '/signdetail',
    name: 'Signdetail',
    component: resolve => require(['@/pages/home/Signdetail'], resolve), //懒加载
  }]
})
