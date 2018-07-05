import {axios} from './axios'

export default {
  /**
   * 获取筛选条件
   * @param {接口参数} parmas 
   */
  getRecordMonth (parmas) {
    return axios.post('smartShoes/web/run/record-month.json', parmas)
  },
  /**
   * 获取跑步记录
   * @param {接口参数} parmas 
   */
  getHistory (parmas) {
    return axios.post('smartShoes/web/run/history.json', parmas)
  },
  /**
   * 导出数据
   * @param {接口参数} parmas 
   */
  downLoad (parmas) {
    return axios.post('smartShoes/web/run/record/export.json', parmas)
  }
}