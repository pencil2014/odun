import {axios} from './axios'

export default {
  /**
   * 获取社区动态
   * @param {接口参数} parmas 
   */
  getNews (parmas) {
    return axios.get('smartShoes/web/dynamic/well-chosen.json', {
      parmas: parmas
    })
  }
}