import {axios} from './axios'

export default {
  /**
   * 查询走步数据
   * @param {接口参数} parmas 
   */
  getStep (parmas) {
    return axios.post('smartShoes/web/step/mine.json', parmas)
  },
  /**
   * 查询走步详情数据
   * @param {接口参数} parmas 
   */
  getDetail (parmas) {
    return axios.post('smartShoes/web/step/stepDataList.json', parmas)
  },
  /**
   * 导出数据
   * @param {接口参数} parmas 
   */
  downLoad (parmas) {
    return axios.post('smartShoes/web/step/record/export.json', parmas)
  }
}