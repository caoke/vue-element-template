import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/Layout'

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

export const constantRoutes = [
  {
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
    path: '/ditigal',
    component: Layout,
    redirect: '/ditigal/building',
    name: 'ditigal',
    meta: {
      title: '电子地图管理',
      icon: 'iconfont icon-dituguanli'
    },
    children: [
      {
        path: 'building',
        component: () => import('@/views/ditigal/building/index'),
        name: 'DitigalBuilding',
        meta: {
          title: '楼栋管理'
        }
      },
      {
        path: 'map',
        component: () => import('@/views/ditigal/map/index'),
        name: 'DitigalMap',
        redirect: '/ditigal/map/list',
        meta: {
          title: '地图管理'
        },
        children: [
          {
            path: 'list',
            component: () => import('@/views/ditigal/map/index'),
            name: 'DitigalMapIndex',
            meta: {
              title: '地图列表'
            },
            children: [
              {
                path: '',
                component: () => import('@/views/ditigal/map/list'),
                name: 'DitigalMapList',
                meta: {
                  title: '地图列表',
                  breadcrumb: false
                }
              },
              {
                path: 'aerial/:id',
                redirect: '',
                component: () => import('@/views/ditigal/map/aerial'),
                name: 'DitigalMapAerial',
                hidden: true,
                meta: {
                  title: '天线管理',
                  activeMenu: '/ditigal/map/list'
                }
              }
            ]
          },
          {
            path: 'add',
            component: () => import('@/views/ditigal/map/add'),
            name: 'DitigalMapAdd',
            meta: {
              title: '导入地图'
            }
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/ditigal/map/add'),
            name: 'DitigalMapEdit',
            hidden: true,
            meta: {
              title: '导入地图'
            }
          },
          {
            path: 'aerial/:id',
            component: () => import('@/views/ditigal/map/aerial'),
            name: 'DitigalMapAerial',
            hidden: true,
            meta: {
              title: '天线管理',
              activeMenu: '/ditigal/map/list'
            }
          }
        ]
      },
      {
        path: 'area',
        component: () => import('@/views/ditigal/area/index'),
        redirect: '/ditigal/area/list',
        name: 'DitigalArea',
        meta: {
          title: '区域管理'
        },
        children: [
          {
            path: 'list',
            component: () => import('@/views/ditigal/area/list'),
            name: 'DitigalAreaList',
            meta: {
              title: '区域列表'
            }
          },
          {
            path: 'add',
            component: () => import('@/views/ditigal/area/add'),
            name: 'DitigalAreaAdd',
            hidden: true,
            meta: {
              title: '新增区域',
              activeMenu: '/ditigal/area/list'
            }
          },
          {
            path: 'edit/:id',
            component: () => import('@/views/ditigal/area/add'),
            name: 'DitigalAreaEdit',
            hidden: true,
            meta: {
              title: '编辑区域',
              activeMenu: '/ditigal/area/list'
            }
          }
        ]
      }
    ]
  },

  {
    path: '/medical',
    component: Layout,
    name: 'medical',
    redirect: '/medical/staff/list',
    meta: {
      title: '医疗基本信息管理',
      icon: 'iconfont icon-yiliao'
    },
    children: [
      {
        path: 'staff',
        component: () => import('@/views/medical/staff/List.vue'),
        name: 'StaffList',
        meta: {
          title: '医护人员信息',
          icon: ''
        }
      },
      {
        path: 'patient',
        component: () => import('@/views/medical/patient/List.vue'),
        name: 'patient',
        meta: {
          title: '患者信息',
          icon: ''
        }
      },
      {
        path: 'label',
        component: () => import('@/views/medical/label/List.vue'),
        name: 'label',
        meta: {
          title: '标签信息',
          icon: ''
        }
      }
    ]
  }
]
export const asyncRoutes = []

const createRouter = () => new Router({
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
