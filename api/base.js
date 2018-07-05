import {axios} from './axios'

export default {
  /**
   * 获取基本信息
   * @param {接口参数} parmas 
   */
  getBaseInfo (parmas) {
    return axios.post('smartShoes/web/personal/maininfo.json', parmas)
  }
}