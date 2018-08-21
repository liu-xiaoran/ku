export default {
  home: '/actives1/public/home',
  notice: '/notice1/app/index_top.json',
  investPrepose: '/zybusiness/order/invest/prepose',
  rewardStatusForInvest: '/platform1/Member/rewardStatusForInvest',
  receiveRewardForInvest: '/platform1/Member/receiveRewardForInvest',
  getShareParams: '/actives1/Public/getShareParams',
  getRegularProductList: '/actives1/product/getRegularProductList',
  getCurrentDetail: '/actives1/product/getCurrentDetail',  //掌薪宝详情
  getRegularDetail: '/actives1/product/getRegularDetail',  //定期详情
  invest: '/zybusiness/order/invest',
  getIncome: '/zybusiness/order/invest/getIncome',
  user: {
    getUserInfo: '/platform1/Member/info',
    login: '/platform1/Userpub/login',
    getVericode: '/platform1/Userpub/sendsms',
    checkVericode: '/platform1/Userpub/checksms',
    setLoginPwd: {
      find: '/platform1/userpub/forgetpwd',
      change: '/platform1/userpub/updpwd',
      set: '/platform1/userpub/setpwd'
    },
    paypwd: {
      reset: '/payment/account/resetPayPwd',
      set: '/payment/account/setPayPwd'
    },
    logout: '/platform1/Userpub/logout'
  },
  my: {
    myAsset: '/payment/account/myAsset',
    myBankcard: '/payment/account/myBankcard',
    myCurrent: '/zybusiness/user/myCurrent/app',
    myCurrentInfo: '/zybusiness/user/myCurrentInfo/app',
    myRegular: '/zybusiness/user/myRegular',
    myRegularInfo: '/zybusiness/user/myRegularInfo',
    myCoupon: '/zybusiness/coupon/myCoupon',
    investRewardList: '/platform1/Member/investRewardList',
    useRedPacket: '/zybusiness/coupon/useRedPacket',
    couponDetail: '/actives1/coupon/detail',
    queryBankOrder: '/payment/trade/queryBankOrder',
    myTrad: '/zybusiness/user/myTrad/app',
    checkInvest: '/zybusiness/user/check/invest',
    letterList: '/platform1/letter/list',
    letterView: '/platform1/letter/view',
    moneyRecord:'/platform1/Usercapital/moneyRecord', //资金记录
    moneyDetail:'/platform1/Usercapital/moneyDetail'  //资金详情
  },
  money: {
    recharge: '/payment/trade/rechargePreVerify',
    withdrawals: '/payment/trade/withdrawPreVerify',
    getRechCode: '/payment/trade/validRecharge',
    goRecharge: '/payment/trade/recharge',
    goWithdrawals: '/payment/trade/withdraw',
    withdrawFee: '/payment/trade/withdrawFee',
    redeemPrepose: '/zybusiness/order/redeem/prepose',
    redeemFee: '/zybusiness/order/redeem/getFee',
    redeem: '/zybusiness/order/redeem'
  },
  coupon: {
    newhistory: '/actives1/daysign/newhistory',
    newdosign: '/actives1/daysign/newdosign',
    receivelist: '/actives1/daysign/receivelist'
  },
  set: {
    sendFeedBack: '/actives1/public/sendFeedBack',
    unbindBankCard: '/payment/account/unbindBankCard'
  },
  text: {
    agreement: '/actives1/static/protocolDetail'
  },
  productDetail: {
    current: '/actives1/product/getCurrentIntro',
    currentIncome: '/actives1/product/getCurrentIncome',
    regular: '/actives1/product/getRegularIntro',
    regularIncome: '/actives1/product/getRegularIncome',
    investRecord: '/actives1/product/getInvestRecord'
  }
}
