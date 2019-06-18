import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/login',
      name: 'home',
      component: () => import('@/views/login/index.vue'),
      meta: {
        id: '0'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        id: '1'
      }
    },
    {
      path: "/data/echart",
      name: "dataEchart",
      component: () => import(/*webpackChunkName: "dataEchart" */ './views/data/Echart.vue'),
      meta: {
        id: '2-1'
      }
    },
    {
      path: "/data/list",
      name: "dataList",
      component: () => import(/*webpackChunkName: "dataEchart" */ './views/data/List.vue'),
      meta: {
        id: '2-1'
      }
    }
  ]
})
