import {axios} from './axios'

export default {
  /**
   * 查询商品
   * @param {接口参数} parmas 
   */
  search (parmas) {
    return axios.post('smartShoes/web/shoes/query.json', parmas)
  }
}