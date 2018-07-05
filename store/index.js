import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// state
let state = {
  token: '', // 登录token
  userInfo: {}, // 用户信息
  total: '' // 注册人数
}

// getters
const getters = {
  userInfo: state => state.userInfo,
  total: state => state.total,
  token: state => state.token
}

// actions
const actions = {
}

// mutations
const mutations = {
  GETUSERINFOT (state, data) {
    state.userInfo = data
  },
  GETTOTAL (state, data) {
    state.total = data
  },
  SETTOKEN (state, data) {
    state.token = data
  }
}

const createStore = () => {
  return new Vuex.Store({
    state,
    actions,
    getters,
    mutations
  })
}
export default createStore