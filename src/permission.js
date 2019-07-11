import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie
import NProgress from 'nprogress' // progress bar 头部进度条
import defaultSettings from '@/settings'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

store.dispatch('permission/generateRoutes', ['admin'])

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to.meta.title ?  `${to.meta.title}-${defaultSettings.title}` : defaultSettings.title

  // determine whether the user has logged in
  const hasToken = getToken()

  if(hasToken) {
    if(to.path === '/login'){
      next({ path: '/'})
      NProgress.done()
    } else {

      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if(hasRoles) {
        next()
      }else {
        const { roles } = await store.dispatch('user/getInfo')
                
        // 根据角色 获取对应的菜单
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // 动态添加路由
        router.addRoutes(accessRoutes)

        next({ ...to, replace: true })
      }
    }
  }else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})