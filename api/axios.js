// 封装ajax请求方法
import axios from 'axios'
import { Message } from 'element-ui'

let AUTH_TOKEN = ''
if (process.browser) {
  AUTH_TOKEN = window.localStorage.getItem('token') || ''
}

const BASE_URL = process.env.baseUrl
// axios.defaults.baseURL = BASE_URL
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
var instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  responseType: 'json'
})
// 客户端请求设置token
if(process.browser && !!AUTH_TOKEN){
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
}
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  if (/^(post)|(put)|(delete)$/i.test(config.method)) { // 处理POST请求默认行为
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded'  
    config.transformRequest = [function (data) {
      let ret = ''
      for (let key in data) {
        if (Array.isArray(data[key])) {
          if (/(\[|\])/g.exec(JSON.stringify(data[key])).length === 2 && (data[key] + '').indexOf('object') === -1) {
            ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
          } else {
            ret += getFormData(key, key, data[key])
          }
        } else {
          ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
        }
      }
      return ret
    }]
  } else {
    config.headers['Content-Type'] = 'application/json' // 处理GET请求默认行为
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 获取状态看是否弹出提示
  let method = response.config.method
  let parmas = null
  if(method === 'get') {
    parmas = response.config.parmas
  } else {
    parmas = response.config.data
  }
  if (response.data.code !== 200) {
    // 请求失败是否弹出提示
    let errStatus = parmas.errorMsg && parmas.errorMsg !== 'none'
    if (errStatus) {
      Message({
        showClose: true,
        message: parmas.errorMsg,
        type: 'warning',
        center: true
      })
    }
  } else {
    // 请求成功是否弹出提示
    let sucStatus = parmas.successMsg && parmas.successMsg !== 'none'
    if (sucStatus) {
      Message({
        showClose: true,
        message: parmas.successMsg,
        type: 'success',
        center: true
      })
    }
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

export {
  instance as axios
}
