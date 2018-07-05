import {axios} from './axios'

export default {
  /**
   * 创建跑团
   * @param {接口参数} parmas 
   */
  createRungroup (parmas) {
    return axios.post('smartShoes/web/rungroup/cou.json', parmas)
  },
    /**
   * 创建活动
   * @param {接口参数} parmas 
   */
  createActivity (parmas) {
    return axios.post('smartShoes/web/activity/city/cou.json', parmas)
  },
  /**
   * 创建训练计划
   * @param {接口参数} parmas 
   */
  createTrain (parmas) {
    return axios.post('smartShoes/web/rungroup/train/cou.json', parmas)
  },
  /**
   * 获取训练计划
   * @param {接口参数} parmas 
   */
  getTrain (parmas) {
    return axios.post('smartShoes/web/rungroup/train/detail.json', parmas)
  },
  // 获取活动详情
  getActivity (parmas) {
    return axios.post('smartShoes/web/activity/detail.json', parmas)
  },
  // 获取跑团详情
  getRungroup (parmas) {
    return axios.post('smartShoes/web/rungroup/detail.json', parmas)
  }
}