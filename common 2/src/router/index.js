import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/pages/Hello'
import VeriCode from '@/components/pages/VeriCode'
import Rem from '@/components/pages/Rem'
import Req from '@/components/pages/Req'
import Other from '@/components/pages/Other'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/vericode',
      name: 'vericode',
      component: VeriCode
    },
    {
      path: '/rem',
      name: 'rem',
      component: Rem
    },
    {
      path: '/req',
      name: 'req',
      component: Req
    },
    {
      path: '/other',
      name: 'other',
      component: Other
    }
  ]
})
