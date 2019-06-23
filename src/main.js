import Vue from 'vue'
import App from './App.vue'
import store from './store/index' // ./store 为什么不能直接加载index
import router from './router/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; //element-ui css

import '@/styles/index.scss'  // global css

import './permission'
Vue.use(ElementUI)

Vue.config.productionTip = false
process.env.NODE_ENV === 'development' && require('../mock/index.js')

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
