import Vue from 'vue'
import App from './App.vue'
import store from './store/index' // ./store 为什么不能直接加载index
import router from './router/index'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import VueKonva from 'vue-konva'
import 'element-ui/lib/theme-chalk/index.css' // element-ui css
import Icon from 'vue-svg-icon/Icon.vue'

import '@/styles/index.scss' // global css

import './permission'
import './directive'

Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.use(VueKonva)
Vue.component('icon', Icon) // 注册

Vue.config.productionTip = false
// process.env.NODE_ENV === 'development' && require('../mock/index.js')

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
