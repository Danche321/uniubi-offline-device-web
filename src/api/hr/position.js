import axios from '@/libs/api.request'
import qs from 'qs'

// 获取列表
export const roleList = data => {
  return axios.request({
    url: `/role?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 删除职位
export const delRole = data => {
  return axios.request({
    url: `/role/${data}`,
    method: 'delete'
  })
}

// 批量删除职位
export const delRoleList = data => {
  return axios.request({
    url: `/role/delRoleList?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 编辑
export const editRole = data => {
  return axios.request({
    url: `/role/${data.id}?name=${data.name}`,
    method: 'put'
  })
}

// 添加
export const addRole = data => {
  return axios.request({
    url: `/role?${qs.stringify(data)}`,
    method: 'post'
  })
}