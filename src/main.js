import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/css/index.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false
process.env.NODE_ENV === 'development' && require('../mock/index.js')



new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
