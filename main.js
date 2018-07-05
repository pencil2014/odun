import Vue from 'vue'
import filters from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 注册全局filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})