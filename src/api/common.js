import axios from '@/libs/api.request'

// 获取所有设备组
export const fetchDeviceGroupAll = (data) => {
  return axios.request({
    url: '/device/group',
    method: 'get',
    params: data
  })
}

// 设备组列表分页
export const fetchDeviceGroupList = (data) => {
  return axios.request({
    url: '/device/group/page',
    method: 'get',
    params: data
  })
}
