import axios from '@/libs/api.request'

// 员工授权查询
export const fetchEmployeeAuth = (data) => {
  return axios.request({
    url: '/device/auth',
    method: 'get',
    params: data
  })
}

// 销权
export const cancelAuth = (id) => {
  return axios.request({
    url: `/device/auth/${id}`,
    method: 'delete'
  })
}

// 批量销权
export const cancelAuthBatch = (data) => {
  return axios.request({
    url: '/device/auth/delete/batch',
    method: 'delete',
    data
  })
}

// 批量授权
export const batchAuth = (data) => {
  return axios.request({
    url: '/device/auth/batch',
    method: 'post',
    data
  })
}

// 部门和门员工查询
export const deptAndEmpList = (data) => {
  return axios.request({
    url: `/dep/treeWithEmp`,
    method: 'get',
    data
  })
}

// 历史授权记录
export const fetchHistoryList = (data) => {
  return axios.request({
    url: '/device/auth/record',
    method: 'get',
    params: data
  })
}

// 获取授权进度详情
export const authDetailProgress = (id) => {
  return axios.request({
    url: `/device/auth/details/${id}`,
    method: 'get',
    closeLoading: true
  })
}

// 获取授权操作详情-头部信息
export const authDetailInfo = id => {
  return axios.request({
    url: `/device/auth/record/${id}`,
    method: 'get'
  })
}

// 获取授权操作详情-设备表格
export const authDetailDevice = (id, data) => {
  return axios.request({
    url: `/device/auth/record/device/${id}`,
    method: 'get',
    params: data
  })
}

// 获取授权操作详情-人员表格
export const authDetailEmpoyee = (id, data) => {
  return axios.request({
    url: `/device/auth/record/person/${id}`,
    method: 'get',
    params: data
  })
}

// 获取设备授权详情-成功人员
export const authDetailSuccess = (id, data) => {
  return axios.request({
    url: `/device/auth/record/success/person/${id}`,
    method: 'get',
    params: data
  })
}

// 获取设备授权人员详情信息
export const deviceDetailInfo = (operatorId, deviceOperatorId) => {
  return axios.request({
    url: `/device/auth/record/device/${operatorId}/${deviceOperatorId}`,
    method: 'get'
  })
}

// 删除授权记录
export const recordDelete = (operatorId) => {
  return axios.request({
    url: `/device/auth/record/${operatorId}`,
    method: 'delete'
  })
}
