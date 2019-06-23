import router from './router/index'
import store from './store/index'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie
import NProgress from 'nprogress' // progress bar

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

store.dispatch('permission/generateRoutes', ['admin'])