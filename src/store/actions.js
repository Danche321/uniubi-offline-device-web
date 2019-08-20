import { login, logout } from '@/api/main'
const actions = {
  // 登录
  handleLogin ({ commit }, params) {
    return new Promise((resolve, reject) => {
      login(params).then(res => {
        if (res.success) {
          const userInfo = JSON.stringify(res.data)
          commit('setUserInfo', userInfo)
          localStorage.setItem('userInfo', userInfo)
          const isActive = (userInfo.active && userInfo.orgId) ? 1 : 0
          commit('updateIsActive', isActive ? 1 : 0)
          localStorage.setItem('isActive', isActive)
          resolve(res)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 退出登录
  handleLogout ({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        if (res.success) {
          commit('setUserInfo', null)
          localStorage.removeItem('userInfo')
          resolve()
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default actions
