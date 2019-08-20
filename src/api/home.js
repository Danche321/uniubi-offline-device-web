import axios from '@/libs/api.request'
import qs from 'qs'

// 获取快捷入口
export const getQuickEnter = data => {
  return axios.request({
    url: `/home/entrance`,
    method: 'get'
  })
}

// 获取快捷操作
export const getQuickBtn = data => {
  return axios.request({
    url: `/home/operation`,
    method: 'get'
  })
}

// 编辑快捷入口
export const putQuickEnter = data => {
  return axios.request({
    url: `/home/entrance`,
    method: 'put',
    data
  })
}

// 编辑快捷操作
export const putQuickBtn = data => {
  return axios.request({
    url: `/home/operation`,
    method: 'put',
    data
  })
}

// 识别记录
export const overview = data => {
  return axios.request({
    url: `/recognition/overview`,
    method: 'get'
  })
}