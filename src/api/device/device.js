import axios from '@/libs/api.request'
import qs from 'qs'

// 查询设备
export const deviceList = data => {
  return axios.request({
    url: `/device?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 重启设备
export const restartDevice = data => {
  return axios.request({
    url: `/device/restart`,
    method: 'put',
    data
  })
}

// 重置设备
export const resetDevice = data => {
  return axios.request({
    url: `/device/reset`,
    method: 'put',
    data
  })
}

// 删除设备
export const deleteDevice = data => {
  return axios.request({
    url: `/device/delete`,
    method: 'delete',
    data
  })
}

// 禁用
export const disabledDevice = data => {
  return axios.request({
    url: `/device/disable`,
    method: 'put',
    data
  })
}

// 修改密码
export const pswDevice = data => {
  return axios.request({
    url: `/device/reset/pwd`,
    method: 'put',
    data
  })
}

// 设备配置
export const configDevice = data => {
  return axios.request({
    url: `/device/config`,
    method: 'put',
    data
  })
}

// 启用拍照
export const enableDevice = data => {
  return axios.request({
    url: `/device/enable`,
    method: 'put',
    data
  })
}

// 刷新设备
export const refreshDevice = data => {
  return axios.request({
    url: `/device/refresh/${data}`,
    method: 'get'
  })
}

// wifi配置
export const wifiConfig = data => {
  return axios.request({
    url: `/device/wifiConfig`,
    method: 'put',
    data
  })
}

// 有线配置
export const wiredConfig = data => {
  return axios.request({
    url: `/device/netConfig`,
    method: 'put',
    data
  })
}

// 时间配置
export const timeConfig = data => {
  return axios.request({
    url: `/device/time/change`,
    method: 'put',
    data
  })
}

// 根据ip检测设备
export const fetchDeviceKey = data => {
  return axios.request({
    url: '/device/key',
    method: 'GET',
    params: data,
    closeLoading: true
  })
}

// 添加设备
export const createDevice = data => {
  return axios.request({
    url: '/device',
    method: 'post',
    data
  })
}

// 固件升级
export const deviceUpgrade = data => {
  return axios.request({
    url: `/device/upgrade`,
    method: 'post',
    data
  })
}

// 固件文件
export const upgradeFile = data => {
  return axios.request({
    url: `/device/upload`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 查询设备搜索结果
export const searchDeivceResult = () => {
  return axios.request({
    url: '/device/search/result',
    method: 'get',
    closeLoading: true
  })
}

// 添加设备组
export const createDeviceGroup = data => {
  return axios.request({
    url: '/device/group',
    method: 'post',
    data
  })
}

// 发起自动搜索设备
export const autoSearchDevice = () => {
  return axios.request({
    url: '/device/search',
    method: 'post',
    closeLoading: true
  })
}

// 修改设备组
export const updateDeviceGroup = (id, data) => {
  return axios.request({
    url: `/device/group/${id}`,
    method: 'put',
    data
  })
}

// 删除设备组
export const deleteDeviceGroup = data => {
  return axios.request({
    url: '/device/group',
    method: 'delete',
    data
  })
}

// 检查设备更新
export const checkDevice = () => {
  return axios.request({
    url: '/device/check/version',
    method: 'get',
    closeLoading: true
  })
}

// 设备启用
export const deviceEnable = data => {
  return axios.request({
    url: '/device/enable',
    method: 'put',
    data
  })
}

// 设备强制删除
export const deviceDeleteForce = key => {
  return axios.request({
    url: `/device/${key}/force`,
    method: 'delete'
  })
}

// 编辑设备
export const deviceUpdate = (key, data) => {
  return axios.request({
    url: `/device/${key}`,
    method: 'put',
    data
  })
}
