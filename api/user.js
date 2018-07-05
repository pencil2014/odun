import {axios} from './axios'

export default {
  /**
   * 获取个人信息
   * @param {接口参数} parmas 
   */
  getUserInfo (parmas) {
    return axios.post('smartShoes/web/personal/myinfo.json', parmas)
  },
  /**
   * 更新个人信息
   * @param {接口参数} parmas 
   */
  update (parmas) {
    return axios.post('smartShoes/web/personal/update.json', parmas)
  }
}