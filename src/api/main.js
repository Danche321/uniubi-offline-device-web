import axios from '@/libs/api.request'
import qs from 'qs'

// 获取盐值
export const getSolt = (data) => {
  return axios.request({
    url: `/account/${data}/salt`,
    method: 'get'
  })
}

// 登录
export const login = (data) => {
  return axios.request({
    url: '/account/login',
    method: 'post',
    data
  })
}

// 退出
export const logout = () => {
  return axios.request({
    url: '/account/logout',
    method: 'get'
  })
}

// 首次登录设置新密码
export const firstSetPwd = (data) => {
  return axios.request({
    url: '/account/active',
    method: 'post',
    data,
    closeMsg: true
  })
}

// 获取登录密保问题
export const fetchQuestion = (userName) => {
  return axios.request({
    url: `/account/${userName}/question`,
    method: 'get'
  })
}

// 验证密保问题是否正确
export const validateQuestion = (userName, data) => {
  return axios.request({
    url: `/account/${userName}/question?${qs.stringify(data)}`,
    method: 'post'
  })
}

// 找回密码/修改密码
export const resetPwd = (data) => {
  return axios.request({
    url: '/account/reset/password',
    method: 'put',
    data
  })
}

// 用户修改密码（登陆后账户页面）
export const updatePwd = (data) => {
  return axios.request({
    url: '/account/password',
    method: 'put',
    data
  })
}

// 用户修改密保问题（登陆后账户页面）
export const updateSecret = (data) => {
  return axios.request({
    url: '/account/question',
    method: 'put',
    data
  })
}

// 上传图片
export const uploadImg = (data) => {
  return axios.request({
    url: '/file/image',
    method: 'post',
    data
  })
}

// 完善公司信息
export const createCompany = (data) => {
  return axios.request({
    url: '/organization',
    method: 'post',
    data
  })
}

// 获取公司信息
export const fetchCompany = (data) => {
  return axios.request({
    url: '/organization',
    method: 'get',
    data
  })
}

// 修改公司信息
export const updateCompany = (orzId, data) => {
  return axios.request({
    url: `/organization/${orzId}`,
    method: 'put',
    data
  })
}

// 获取客户端设置信息
export const fetchClientInfo = () => {
  return axios.request({
    url: '/device/server/info',
    method: 'get'
  })
}

// 获取设备是否存储
export const fetchIsStore = () => {
  return axios.request({
    url: '/device/image/store',
    method: 'get'
  })
}

// 设置设备是否存储
export const setIsStore = (data) => {
  return axios.request({
    url: `/device/image/store?${qs.stringify(data)}`,
    method: 'put'
  })
}
