import axios from '@/libs/api.request'
import qs from 'qs'

// 获取员工列表
export const empList = data => {
  return axios.request({
    url: `/employee/list?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 获取员工列表
export const searchEmpList = data => {
  return axios.request({
    url: `/employee/empList?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 批量删除
export const delEmpList = data => {
  return axios.request({
    url: `/employee/delEmpList?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 批量删除
export const delEmpInfo = data => {
  return axios.request({
    url: `/employee/delEmp/${data.empTaskId}?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 批量删除
export const updateEmpInfo = data => {
  return axios.request({
    url: `/employee/updateEmp/${data.empId}?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 删除人员
export const delEmp = data => {
  return axios.request({
    url: `/employee/${data}`,
    method: 'delete'
  })
}

// 批量调整部门
export const batchDep = data => {
  return axios.request({
    url: `/employee/batch/department`,
    method: 'put',
    data
  })
}

// 导入人员
export const updateEmp = (data) => {
  return axios.request({
    url: `/employee/batchAddEmp`,
    method: 'post',
    closeLoading: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 进度查询
export const progress = data => {
  return axios.request({
    url: `/task/query/${data}`,
    method: 'get',
    closeLoading: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 历史上传记录查询
export const historyList = data => {
  return axios.request({
    url: `/employee/historyList?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 删除历史记录
export const deleteHistory = data => {
  return axios.request({
    url: `/employee/historyList?recordId=${data}`,
    method: 'delete'
  })
}

// 批量删除历史记录
export const batchDeleteHistory = data => {
  return axios.request({
    url: `/employee/historyListBatch?${data}`,
    method: 'delete'
  })
}

// 历史详情
export const historyDetail = data => {
  return axios.request({
    url: `/employee/historyDetail?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 批量删除人员列表
export const getDelEmpList = data => {
  return axios.request({
    url: `/employee/delList?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 信息变更列表
export const getUpdateEmpList = data => {
  return axios.request({
    url: `/employee/updateList?${qs.stringify(data)}`,
    method: 'get'
  })
}

// 已删人员信息
export const dimission = data => {
  return axios.request({
    url: `/employee/dimission/${data}`,
    method: 'get'
  })
}

// 添加员工
export const addEmployee = data => {
  return axios.request({
    url: `/employee`,
    method: 'post',
    data
  })
}

// 编辑员工
export const editEmployee = data => {
  return axios.request({
    url: `/employee/${data.id}`,
    method: 'put',
    data
  })
}

// 获取员工信息
export const getEmployee = data => {
  return axios.request({
    url: `/employee/${data}`,
    method: 'get'
  })
}

// 上传图片
export const updateImg = data => {
  return axios.request({
    url: `/file/image`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data
  })
}

// 上传人脸图片
export const updateFaceImg = data => {
  return axios.request({
    url: `/file/faceImage`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data
  })
}

// 开启设备拍照
export const devicePhoto = data => {
  return axios.request({
    url: `/device/take/photo/${data.deviceKey}/${data.empId}`,
    method: 'put'
  })
}

// 开启设备卡号
export const deviceCard = data => {
  return axios.request({
    url: `/device/take/card/${data.deviceKey}/${data.empId}`,
    method: 'put'
  })
}

// 获取设备任务详情
export const getTaskData = data => {
  return axios.request({
    url: `/device/task/${data}`,
    method: 'get',
    closeLoading: true
  })
}

// 下载excel
export const exportExcel = data => {
  return axios.request({
    url: `/employee/exportHistory?type=${data.type}&recordId=${data.id}`,
    method: 'get'
  })
}
