import axios from '@/libs/api.request'
import qs from 'qs'

// 获取部门详情
export const getDepartmentInfo = data => {
  return axios.request({
    url: `/dep/${data}`,
    method: 'get'
  })
}

// 部门新增
export const addDepartment = data => {
  return axios.request({
    url: '/dep',
    method: 'post',
    data
  })
}

// 部门编辑
export const editDepartment = data => {
  return axios.request({
    url: `/dep/${data.id}`,
    method: 'put',
    data
  })
}

// 获取部门树
export const getdepTree = data => {
  return axios.request({
    url: `/dep/tree?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 下级部门和人员列表
// export const getDepAndEmp = data => {
//   return axios.request({
//     url: `/dep/${data}/child`,
//     method: 'get'
//   })
// }

// 删除部门
export const deleteDepartment = data => {
  return axios.request({
    url: `/dep/${data}`,
    method: 'delete'
  })
}

// 部门移动
export const moveDepartment = data => {
  return axios.request({
    url: '/dep/sortDepartment',
    method: 'put',
    data
  })
}

// 获取子部门和员工
export const getAllDepAndEmp = data => {
  return axios.request({
    url: `/dep/treeWithEmp?${qs.stringify(data)}`,
    method: 'get'
  })
}
