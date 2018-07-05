import {axios} from './axios'

export default {
  /**
   * 获取契约跑套餐
   * @param {接口参数} parmas 
   */
  getOfficial (parmas) {
    return axios.get('smartShoes/web/activity/official.json', {
      parmas: parmas
    })
  }
}