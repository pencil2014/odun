import axios from 'axios'
import { getCookie } from '../tools/index'

export default function ({store, req }) {
  let token = null
  if (process.server && req) {
    token = getCookie('token',req.headers.cookie)
  } else {
    token = getCookie('token')
  }
  if(!!token){
    axios.defaults.headers.common['Authorization'] = token
    store.commit('SETTOKEN', token)
  }
}