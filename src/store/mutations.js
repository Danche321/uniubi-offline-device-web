
const mutations = {
  updateIsActive (state, isActive) {
    state.isActive = isActive
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  updatePassword (state, adminPass) {
    localStorage.setItem('adminPass', adminPass)
    state.adminPass = adminPass
  }
}

export default mutations
