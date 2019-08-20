import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userInfo = localStorage.getItem('userInfo')
  const isActive = localStorage.getItem('isActive')
  if (userInfo) { // 已登录
    if (isActive === '0') { // 未激活
      if (['newPassword', 'completeCompany'].includes(from.name) && to.name !== 'completeCompany') { // 设置密码、创建公司
        localStorage.removeItem('userInfo')
        next(`/login`)
        NProgress.done()
      } else {
        next()
        NProgress.done()
      }
    } else {
      next()
      NProgress.done()
    }
  } else { // 未登录
    if (to.meta.noLogin) {
      next()
      NProgress.done()
    } else {
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
