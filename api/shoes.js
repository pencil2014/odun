import {axios} from './axios'

export default {
  /**
   * 查询鞋子
   * @param {接口参数} parmas 
   */
  getShoes (parmas) {
    return axios.post('smartShoes/web/shoes/mine.json', parmas)
  }
}