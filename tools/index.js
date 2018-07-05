/**
 * 存储cooki值
 * @param {cookie名称} name 
 * @param {cookie值} value 
 * @param {cookie有效天数} days 
 */
export function setCookie (name, value, days) {
  if (process.browser) {
    let d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    let url = window.location.hostname
    window.document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString() + ';domain=' + url
    alert(window.document.cookie)
  }
}

/**
 * 获取cookie值
 * @param {cookie名称} name 
 * @param {cookie数据} cookies 
 */
export function getCookie (name, cookies) {
  if (process.browser) {
    cookies = window.document.cookie
  }
  let v = cookies && cookies.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}
/**
 * 删除cookie值
 * @param {cookie名称} name 
 */
export function delCookie (name) {
  setCookie(name, '', -1)
}
/**
 * 获取地址id
 * @param {地址名称} provinceName 
 */

export function getAreaId (provinceName, cityName) {
  let data = require('static/area.json')
  let proviceData = data.province.filter(el => {
    return el.title === provinceName
  })
  let cityData = data.city[proviceData[0].areaId].filter(el => {
    return el.title === cityName
  })
  if (!cityData.length) {
    cityData = data.city[proviceData[0].areaId]
  }
  return [proviceData[0].areaId, cityData[0].areaId]
}
/**
 * 格式化时间
 * @param {地址名称} data 
 */
export function formatDate (date, type) {
  if (!date) return ''
  date = date.toString()
  date = date.replace(/-/g, '/') // 2017-12-20 00:00:00 这样的格式换成ie可以new Date的格式
  date = new Date(date)
  // date = typeof date === 'number' ? new Date(date) : date
  type = type || 'yyyy-MM-dd HH:mm:ss'
  let obj = {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }
  let week = ['天', '一', '二', '三', '四', '五', '六']
  for (let i in obj) {
    type = type.replace(new RegExp(i + '+', 'g'), function (m) {
      let val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (let j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return type
}
/**
 * 获取个人中心地址
 * @param {地址名称} data 
 */
 export function getArea2 () {
    let data = require('static/area2.json')
    let area = []
    let country = [], province = [], city = []
    let keys = Object.keys(data)
    keys.forEach(element => {
      let item = element.split('_')
      if (item.length === 1) {
        country.push({value:element, label: data[element]})
      } else if (item.length === 2) {
        province.push({value:element, label: data[element], children: []})
      } else {
        city.push({value:element, label: data[element]})
      }
    })
    country.forEach(e => {
      let proviceData = province.filter(x => {
        return x.value.split('_')[0] === e.value
      })
      area.push({value: e.value, label: e.label, children: proviceData})
    })
    area.forEach(c => {
      if (c.children.length > 0) {
        c.children.forEach(y => {
          let cityData = city.filter(j => {
            let q = j.value.split('_')
            let t = y.value.split('_')
            return (q[0] === t[0]) && (q[1] === t[1])
          })
          y.children = cityData
        })
      }
    })
    let res = area.filter(m => {
      return m.children.length > 0 &&  m.children[0].children.length > 0
    })
    return res
 }