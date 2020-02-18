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
      component: () => import(/* webpackChunkName: "layout" */'@/views/home/index.vue'),
      name: 'Home',
      meta: {
        title: '首页',
        icon: 'el-icon-view',
        affix: true
      }
    }]
  },

  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    meta: { title: '监控管理', icon: 'iconfont icon-jiankongzhongxin' },
    children: [
      {
        path: 'real-time',
        name: 'RealTime',
        component: () => import(/* webpackChunkName: "monitor" */'@/views/monitor/RealTime'),
        meta: {
          title: '实时监控',
          icon: ''
        }

      },
      {
        path: 'track-playback',
        name: 'TrackPlayback',
        component: () => import(/* webpackChunkName: "monitor" */'@/views/monitor/TrackPlayback'),
        meta: {
          title: '轨迹回放',
          icon: ''
        }
      }
    ]
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
        component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/building/index'),
        name: 'DitigalBuilding',
        meta: {
          title: '楼栋管理'
        }
      },
      {
        path: 'map',
        component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/map/index'),
        name: 'DitigalMap',
        redirect: '/ditigal/map/list',
        meta: {
          title: '地图管理'
        },
        children: [
          {
            path: 'list',
            component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/map/list'),
            name: 'DitigalMapIndex',
            meta: {
              title: '地图管理'
            }
          },
          {
            path: 'add',
            component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/map/add'),
            name: 'DitigalMapAdd',
            hidden: true,
            meta: {
              title: '导入地图',
              activeMenu: '/ditigal/map/list'
            }
          },
          {
            path: 'edit/:id',
            component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/map/add'),
            name: 'DitigalMapEdit',
            hidden: true,
            meta: {
              title: '修改地图',
              activeMenu: '/ditigal/map/list'
            }
          },
          {
            path: 'aerial/:id',
            component: () => import(/* webpackChunkName: "ditigal" */'@/views/ditigal/map/aerial'),
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
        component: () => import(/* webpackChunkName: "area" */'@/views/ditigal/area/index'),
        redirect: '/ditigal/area/list',
        name: 'DitigalArea',
        meta: {
          title: '区域管理'
        },
        children: [
          {
            path: 'list',
            component: () => import(/* webpackChunkName: "area" */'@/views/ditigal/area/list'),
            name: 'DitigalAreaList',
            meta: {
              title: '区域管理'
            }
          },
          {
            path: 'aerial/:id',
            component: () => import(/* webpackChunkName: "area" */'@/views/ditigal/area/aerial'),
            name: 'DitigalAreaAerial',
            hidden: true,
            meta: {
              title: '管理天线',
              activeMenu: '/ditigal/area/list'
            }
          }
        ]
      },
      {
        path: 'route-plan',
        component: () => import(/* webpackChunkName: "route-plan"*/'@/views/ditigal/route-plan/Index.vue'),
        redirect: '',
        name: 'DitigalRoutePlan',
        meta: {
          title: '路径规划'
        }
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
        component: () => import(/* webpackChunkName: "medical" */'@/views/medical/staff/List.vue'),
        name: 'StaffList',
        meta: {
          title: '医护人员信息',
          icon: ''
        }
      },
      {
        path: 'patient',
        component: () => import(/* webpackChunkName: "medical" */'@/views/medical/patient/List.vue'),
        name: 'patient',
        meta: {
          title: '患者信息',
          icon: ''
        }
      },
      {
        path: 'label',
        component: () => import(/* webpackChunkName: "medical" */'@/views/medical/label/List.vue'),
        name: 'label',
        meta: {
          title: '标签信息',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/warn',
    component: Layout,
    name: 'warn',
    meta: { title: '告警管理', icon: 'el-icon-warning-outline' },
    children: [
      {
        path: 'record',
        name: 'Record',
        component: () => import(/* webpackChunkName: "warn" */'@/views/warn/record/Index'),
        meta: {
          title: '告警记录',
          icon: ''
        }
      },
      {
        path: 'type',
        name: 'WarnType',
        component: () => import(/* webpackChunkName: "warn" */'@/views/warn/type/Index'),
        meta: {
          title: '告警方式',
          icon: ''
        }
      },
      {
        path: 'message-type',
        name: 'MessageType',
        component: () => import(/* webpackChunkName: "warn" */'@/views/monitor/index'),
        meta: {
          title: '告警消息类型',
          icon: ''
        }
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import(/* webpackChunkName: "warn" */'@/views/warn/device/Index'),
        meta: {
          title: '告警设备',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import(/* webpackChunkName: "system" */'@/views/monitor/index'),
        meta: {
          title: '用户管理',
          icon: ''
        }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import(/* webpackChunkName: "system" */'@/views/monitor/index'),
        meta: {
          title: '权限管理',
          icon: ''
        }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import(/* webpackChunkName: "system" */'@/views/monitor/index'),
        meta: {
          title: '操作日志',
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
