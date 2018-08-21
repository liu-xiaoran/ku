import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
// import record from '@/pages/record'

Vue.use(Router)
let router=new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/record',
      name: 'record',
      // component: record
      component: resolve => require(['@/pages/record'], resolve), //懒加载
    },
  ]
})
export default router
