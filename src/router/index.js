import Vue from 'vue'
import Router from 'vue-router'

import mainRouter from './modules/main'
import hrRouter from './modules/hr'
import authorizeRouter from './modules/authorize'
import deviceRouter from './modules/device'
import identifyRouter from './modules/identify'

Vue.use(Router)
export const routerList = [
  ...mainRouter,
  ...hrRouter,
  ...deviceRouter,
  ...authorizeRouter,
  ...identifyRouter
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: routerList
  // mode: 'histo\ry'
})
