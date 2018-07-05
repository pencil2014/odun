import {axios} from './axios'

export default {
  /**
   * 获取注册总用户数
   * @param {接口参数} parmas 
   */
  getTotal (parmas) {
    return axios.get('smartShoes/web/user/total.json', {
      parmas: parmas
    })
  },
  /**
   * 获取当前用户信息
   * @param {接口参数} parmas 
   */
  getUserinfo (parmas) {
    return axios.get('smartShoes/web/personal/myinfo.json', {
      parmas: parmas
    })
  },
  /**
   * 获取登录二维码
   * @param {接口参数} parmas 
   */
  getQrcode (parmas) {
    return axios.get('smartShoes/web/user/qrcode.json', {
      parmas: parmas
    })
  },
  /**
   * 用户登录
   * @param {接口参数} parmas 
   */
  loginAccount (parmas) {
    return axios.post('smartShoes/web/user/login.json', parmas)
  },
  /**
   * 退出登录
   * @param {接口参数} params 
   */
  loginOut (params) {
    return axios.post('smartShoes/web/user/logout.json', params)
  },
  /**
   * 轮训是否扫码登录
   * @param {接口参数} params 
   */
  checkLogin (params) {
    return axios.post('smartShoes/web/user/qrcheck.json', params)
  }
}