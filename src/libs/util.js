import md5 from 'js-md5'

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (item.children && item.children.length > 1) {
        obj.children = getMenuByRouter(item.children)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      res.push(obj)
    }
  })
  return res
}

// 获取随机盐值
export const getRandomStr = (length = 4) => {
  let result = Math.floor(Math.random() * 90 + 10).toString()
  for (let i = 0; i < length - 2; i++) {
    let ranNum = Math.ceil(Math.random() * 25)
    result += String.fromCharCode(65 + ranNum).toString()
  }
  return result
}

// 密码加密
export const hashPassWord = (password, salt) => {
  const hashSecretKey = (key) => {
    let secretKeyLength = key.length
    let hashVal = ''
    for (let i = 0; i < secretKeyLength; i++) {
      hashVal += i % 2 ? (key.charCodeAt(i) << 2).toString(16) : (key.charCodeAt(i) << 3).toString(16)
    }
    return hashVal
  }

  let secretKey1 = password + salt
  let secretKey2 = hashSecretKey(secretKey1)
  for (let i = 0; i < 10; i++) {
    secretKey2 = hashSecretKey(secretKey2)
  }
  return md5(secretKey2)
}

// 获取时间
export const getDate = () => {
  const getHandledValue = num => {
    return num < 10 ? '0' + num : num
  }
  const d = new Date()
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  return resStr
}

// 获取父级组件
export const findComponentUpward = (context, componentName, componentNames) => {
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }
  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}

/**
 * 文件流导出
 * @param {String} file
 * @param {String} name
 */
export function fileExport (file, name) {
  const downloadA = document.createElement('a')
  const blob = new Blob([file], { type: 'application/vnd.ms-excel;charset=utf-8' })
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
    window.navigator.msSaveOrOpenBlob(blob, `${name}.xlsx`)
  } else {
    downloadA.href = window.URL.createObjectURL(blob)
    downloadA.download = `${name}.xlsx`
    downloadA.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    window.URL.revokeObjectURL(downloadA.href)
  }
}

/**
 * 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}
