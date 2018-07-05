import {axios} from './axios'

export default {
  /**
   * 留言信息
   * @param {接口参数} parmas 
   */
  concatUs (parmas) {
    return axios.post('smartShoes/web/message/submit.json', parmas)
  }
}