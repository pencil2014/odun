import {axios} from './axios'

export default {
  /**
   * 获取推荐跑团
   * @param {接口参数} parmas 
   */
  getRungroup (parmas) {
    return axios.post('smartShoes/web/rungroup/list.json', parmas)
  },
  /**
   * 获取推荐活动
   * @param {接口参数} parmas 
   */
  getActivitygroup (parmas) {
    return axios.post('smartShoes/web/activity/list.json', parmas)
  },
  /**
   * 加入跑团
   * @param {接口参数} parmas 
   */
  joinGroup (parmas) {
    return axios.post('smartShoes/web/rungroup/member-operation.json', parmas)
  },
  /**
   * 加入活动
   * @param {接口参数} parmas 
   */
  joinActivity (parmas) {
    return axios.post('smartShoes/web/activity/city/join.json', parmas)
  },
   /**
   * 获取我的活动
   * @param {接口参数} parmas 
   */
  getMyActivity (parmas) {
    return axios.post('smartShoes/web/activity/city/my-activity.json', parmas)
  },
  /**
   * 导出活动成员
   * @param {接口参数} parmas 
   */
  exportNum (parmas) {
    return axios.post('smartShoes/web/activity/member/export.json', parmas)
  },
  /**
   * 取消活动
   * @param {接口参数} parmas 
   */
  cancleActivity (parmas) {
    return axios.post('smartShoes/web/activity/city/cancel.json', parmas)
  },
  /**
   * 取消活动
   * @param {接口参数} parmas 
   */
  activityInfo (parmas) {
    return axios.post('smartShoes/web/activity/detail.json', parmas)
  },
  /**
   * 活动成员列表
   * @param {接口参数} parmas 
   */
  activityNumber (parmas) {
    return axios.post('smartShoes/web/activity/city/member/list.json', parmas)
  },
   /**
   * 踢出成员
   * @param {接口参数} parmas 
   */
  deleteMember (parmas) {
    return axios.post('smartShoes/web/activity/delete.json', parmas)
  },
  /**
   * 审核报名成员
   * @param {接口参数} parmas 
   */
  verifyMember (parmas) {
    return axios.post('smartShoes/web/activity/verify.json', parmas)
  }
}