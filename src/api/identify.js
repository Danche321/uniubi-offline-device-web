import axios from '@/libs/api.request'

// 识别记录
export const fetchList = (data) => {
  return axios.request({
    url: '/recognition/records',
    method: 'get',
    params: data
  })
}

// 导出
export const exportList = (data) => {
  return axios.request({
    url: '/recognition/output',
    method: 'get',
    data
  })
}
