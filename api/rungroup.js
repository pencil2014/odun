import {axios} from './axios'

export default {
  /**
   * 获取我的跑团
   * @param {接口参数} parmas 
   */
  getRungroup (parmas) {
    return axios.post('smartShoes/web/personal/rungroup/list.json', parmas)
  },
  /**
   * 解散跑团
   * @param {接口参数} parmas 
   */
  cancleGroup (parmas) {
    return axios.post('smartShoes/web/rungroup/dissolved.json', parmas)
  },
  /**
   * 退出跑团
   * @param {接口参数} parmas 
   */
  outGroup (parmas) {
    return axios.post('smartShoes/web/rungroup/member-operation.json', parmas)
  },
  /**
   * 跑团详情
   * @param {接口参数} parmas 
   */
  groupInfo (parmas) {
    return axios.post('smartShoes/web/rungroup/detail.json', parmas)
  },
  /**
   * 跑团最近活动
   * @param {接口参数} parmas 
   */
  getActivity (parmas) {
    return axios.post('smartShoes/web/rungroup/activity.json', parmas)
  },
  /**
   * 导出团成员到excel
   * @param {接口参数} parmas 
   */
  exportNum (parmas) {
    return axios.post('smartShoes/web/rungroup/record/export.json', parmas)
  },
   /**
   * 获取跑团成员
   * @param {接口参数} parmas 
   */
  rungroupMember (parmas) {
    return axios.post('smartShoes/web/rungroup/member-list.json', parmas)
  },
  /**
   * 转让团长，设置副团长，剔除团员功能
   * @param {接口参数} parmas 
   */
  operationMember (parmas) {
    return axios.post('smartShoes/web/rungroup/manager-operation.json', parmas)
  },
  /**
   * 训练计划
   * @param {接口参数} parmas 
   */
  getTrain (parmas) {
    return axios.post('smartShoes/web/rungroup/train/list.json', parmas)
  },
  /**
   * 删除训练计划
   * @param {接口参数} parmas 
   */
  delTrain (parmas) {
    return axios.post('smartShoes/web/rungroup/train/delete.json', parmas)
  },
  /**
   * 加入训练计划
   * @param {接口参数} parmas 
   */
  joinTrain (parmas) {
    return axios.post('smartShoes/web/rungroup/train/join.json', parmas)
  },
  /**
   * 获取团相册
   * @param {接口参数} parmas 
   */
  getPhoto (parmas) {
    return axios.post('smartShoes/web/rungroup/photo/list.json', parmas)
  },
  /**
   * 删除团相册
   * @param {接口参数} parmas 
   */
  delPhoto (parmas) {
    return axios.post('smartShoes/web/rungroup/photo/delete.json', parmas)
  },
  /**
   * 跑团成员排行榜
   * @param {接口参数} parmas 
   */
  getRank (parmas) {
    return axios.post('smartShoes/web/rungroup/rank.json', parmas)
  }
}