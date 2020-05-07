import Vue from 'vue'
import { IonicVueRouter } from '@ionic/vue'

Vue.use(IonicVueRouter)

export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () =>
        import(/* webpackChunkName: "auth" */ '@/pages/Auth.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(/* webpackChunkName: "settings" */ '@/pages/Settings.vue')
    },
    {
      path: '/',
      name: 'config',
      component: () =>
        import(/* webpackChunkName: "config" */ '@/pages/Config.vue')
    },
    {
      path: '/view',
      name: 'view',
      component: () =>
        import(/* webpackChunkName: "view" */ '@/pages/View.vue')
    },
    {
      path: '/gauge',
      name: 'gauge',
      component: () =>
        import(/* webpackChunkName: "gauge" */ '@/pages/Gauge.vue')
    },
    {
      path: '/dynamic_parm',
      name: 'dynamic_parm',
      component: () =>
        import(/* webpackChunkName: "dynamic_parm" */ '@/pages/ExtendedForm.vue')
		},
    {
      path: '/alert',
      name: 'alert',
      component: () =>
        import(/* webpackChunkName: "alert" */ '@/pages/ExtendedForm.vue')
    },
  ]
});