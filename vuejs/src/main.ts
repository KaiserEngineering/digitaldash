import Vue from 'vue'
import './plugins/axios'
import Ionic from '@ionic/vue';
import App from './App.vue'
import store from './utils/store'
import router from './utils/router'
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import { addIcons } from "ionicons"
import { speedometer, create, cog, logOut, save, trash, add, arrowBack, checkmark } from 'ionicons/icons'
import axios from 'axios'

// Config

Vue.config.productionTip = false

// Plugins

Vue.use(Ionic)

// Prototypes
Vue.prototype.$api = axios.create({
  baseURL: 'http://localhost:3000/api/'
});

// Components

Vue.component('ion-row-col', () => import('@/components/rowCol.vue'))
Vue.component('ion-main-header', () => import('@/components/mainHeader.vue'))
Vue.component('ion-main-menu', () => import('@/components/mainMenu.vue'))
Vue.component('list-items', () => import('@/components/listItems.vue'))
Vue.component('view-items', () => import('@/components/viewItems.vue'))

// Icons

addIcons({
    'ios-speedometer': speedometer.ios,
    'md-speedometer': speedometer.md,
    'ios-create': create.ios,
    'md-create': create.md,
    'ios-cog': cog.ios,
    'md-cog': cog.md,
    'ios-log-out': logOut.ios,
    'md-log-out': logOut.md,
    'ios-save': save.ios,
    'md-save': save.md,
    'ios-add': add.ios,
    'md-add': add.md,
    'ios-trash': trash.ios,
    'md-trash': trash.md,
    'ios-arrow-back': arrowBack.ios,
    'md-arrow-back': arrowBack.md,
    'ios-checkmark': checkmark.ios,
    'md-checkmark': checkmark.md,
})

// Render

new Vue({
	router,
	store,
  render: (h) => h(App)
}).$mount('#app')