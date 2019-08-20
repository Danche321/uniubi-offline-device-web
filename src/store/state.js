const state = {
  isActive: localStorage.getItem('isActive') || 0, // 账户是否激活，设置密码+创建公司
  userInfo: localStorage.getItem('userInfo'),
  adminPass: localStorage.getItem('adminPass'),
  username: 'Admin' // 接口接收用户名参数，TODO 单用户先写死
}

export default state
