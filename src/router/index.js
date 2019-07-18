import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [{
  path: '/login',
  component: () => import(/* webpackChunkName: "login" */ 'views/login/index'),
  meta: {
    title: '登录'
  },
  hidden: true
},

{
  path: '',
  component: Layout,
  redirect: 'home',
  children: [{
    path: 'home',
    component: () => import('@/views/home/index.vue'),
    name: 'Home',
    meta: {
      title: '首页',
      icon: 'el-icon-view',
      affix: true
    }
  }]
},

{
  path: '/profile',
  component: Layout,
  redirect: 'noRedirect',
  children: [{
    path: 'index',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人中心',
      icon: 'user',
      noCache: true
    },
    hidden: true
  }]
},

{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'Excel',
  meta: {
    title: 'excel',
    icon: 'el-icon-document'
  },
  children: [{
    path: 'export-excel',
    name: 'ExportExcel',
    component: () => import('@/views/excel/ExportExcel'),
    meta: {
      title: '导出Excel'
    }
  },
  {
    path: 'import-excel',
    name: 'ImportExcel',
    component: () => import('@/views/excel/ImportExcel'),
    meta: {
      title: '导入Excel'
    }
  }
  ]

},
{
  path: '/component',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Component',
  meta: {
    title: '组件',
    icon: 'el-icon-document'
  },
  children: [{
    path: 'split-pane',
    name: 'splitPane',
    component: () => import('@/views/components/SplitPane'),
    meta: {
      title: 'SplitPane'
    }
  },
  {
    path: 'drag-dialog',
    name: 'DragDialog',
    component: () => import('@/views/components/DragDialog'),
    meta: {
      title: '拖拽Dialog'
    }
  },
  {
    path: 'drag-select',
    name: 'DragSelect',
    component: () => import('@/views/components/DragSelect'),
    meta: {
      title: '拖拽select'
    }
  },
  {
    path: 'dnd-list',
    name: 'DndList',
    component: () => import('@/views/components/DndList'),
    meta: {
      title: '拖拽List'
    }
  },
  {
    path: 'board',
    name: 'Board',
    component: () => import('@/views/components/DragBoard'),
    meta: { title: '拖拽看板' }
  },
  {
    path: 'sticky',
    name: 'Sticky',
    component: () => import('@/views/components/Sticky'),
    meta: { title: '滚动吸顶' }
  }
  ]
},

{
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: 'charts',
    icon: 'el-icon-date'
  },
  children: [{
    path: 'keyboard',
    component: () => import('@/views/List.vue'),
    name: 'KeyboardChart',
    meta: {
      title: 'keyboardChart',
      noCache: true
    }
  },
  {
    path: 'line',
    component: () => import('@/views/Home.vue'),
    name: 'LineChart',
    meta: {
      title: 'lineChart',
      noCache: true
    }
  },
  {
    path: 'mix-chart',
    component: () => import('@/views/Home.vue'),
    name: 'MixChart',
    meta: {
      title: 'mixChart',
      noCache: true
    }
  }
  ]
}
]
export const asyncRoutes = []

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
