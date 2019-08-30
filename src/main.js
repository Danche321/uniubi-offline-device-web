/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store/index'
import i18n from '@/locale'
import MPagination from './components/m-pagination'
import ExpandForm from './components/expand-form'
import LeftClear from '@/directives/left-clear'
import './assets/icons/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/reset.css'
import './assets/style/common.scss'
import './permission'

const { 
  VUE_APP_CURRENTMODE,
  VUE_APP_BASE_API,
  VUE_APP_VERSION_INFO } = process.env

Vue.config.productionTip = false
Vue.prototype.baseUrl = VUE_APP_BASE_API
Vue.use(ElementUI, { 
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(LeftClear.directive)
Vue.component('MPagination', MPagination)
Vue.component('ExpandForm', ExpandForm)

if (VUE_APP_CURRENTMODE === 'inner' || VUE_APP_CURRENTMODE === 'test') {
  console.log(VUE_APP_VERSION_INFO)
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
