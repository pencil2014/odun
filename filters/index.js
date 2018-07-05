/**
 * 时间分段显示-相对于设备当前时间
 * 小于60分钟，            显示：XX分钟前；
 * 1小时到24小时之内，      显示：：xx小时前
 * 24小时以上到48小时之内， 显示：1天前
 * 48小时以上到72小时之内， 显示：2天前
 * 72小时以上到96小时之内， 显示：3天前
 * 96小时以上到一年前，     显示：XX月XX日；//(达到4天的) 同年，不同年显示下面的
 * 一年以上，              显示：XXXX年XX月XX日
 */
function formatTime (date) {
  if (!date) return ''
  let nowDate = new Date()
  date = date.toString()
  date = date.replace(/-/g, '/')
  date = new Date(date)
  let intervalTime = nowDate - date
  let intervalTimeDate = new Date(intervalTime)
  if (intervalTime < (60 * 1000)) { // XX分钟前
    return '刚刚'
  } else if ((60 * 1000) <= intervalTime && intervalTime < (60 * 60 * 1000)) {
    return intervalTimeDate.getMinutes() + '分钟前'
  } else if ((60 * 60 * 1000) <= intervalTime && intervalTime < (24 * 60 * 60 * 1000)) { // xx小时前
    return `${Math.floor(intervalTimeDate / 1000 / 60 / 60)}小时前`
  } else if ((24 * 60 * 60 * 1000) <= intervalTime && intervalTime < (4 * 24 * 60 * 60 * 1000)) { // 1-3天前
    return `${Math.floor(intervalTimeDate / 1000 / 60 / 60 / 24)}天前`
  } else if ((4 * 24 * 60 * 60 * 1000) <= intervalTime) { // XX月XX日
    if (date.getFullYear() === nowDate.getFullYear()) {
      return `${date.getMonth() + 1}月${date.getDate()}日`
    } else { // XXXX年XX月XX日
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
  } else {
    return '请准确的设置系统时间'
  }
}

/**
 * 格式化时间
 * @param {秒} time 
 */
function formatSecnd (time) {
  let h = Math.floor(time / 3600) < 10 ? '0'+Math.floor(time / 3600) : Math.floor(time / 3600)
  let m = Math.floor((time / 60 % 60)) < 10 ? '0' + Math.floor((time / 60 % 60)) : Math.floor((time / 60 % 60))
  let s = Math.floor((time % 60)) < 10 ? '0' + Math.floor((time % 60)) : Math.floor((time % 60))
  return `${h}:${m}:${s}`
}

export default {
  formatTime,
  formatSecnd
}
