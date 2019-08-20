import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Loading, Message } from 'element-ui'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
    this.message = {}
    this.loadingInstance = ''
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {},
      timeout: 8000 // request timeout
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    setTimeout(() => {
      if (!Object.keys(this.queue).length) {
        this.loadingInstance && this.loadingInstance.close()
      }
    }, 100)
  }
  interceptors (instance, url, closeLoading) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading
      if (!closeLoading) {
        this.queue[url] = true
      }
      if (Object.keys(this.queue).length) {
        this.loadingInstance = Loading.service({
          text: '加载中···'
        })
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data } = res
      const { closeMsg } = res.config
      if (typeof data === 'object' && !data.success) {
        if (data.code === 'ARES-ACCOUNT-000') {
          store.dispatch('handleLogout').then(() => {
            router.push('/login')
          })
        }
        this.message.close && this.message.close()
        if (!closeMsg) {
          this.message = Message.error(data.msg)
        }
      }
      return data
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      let errTip = ''
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        errTip = '网络请求超时,请刷新页面重试'
      }
      Message({
        message: errTip || error,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url, options.closeLoading)
    return instance(options)
  }
}
export default HttpRequest
