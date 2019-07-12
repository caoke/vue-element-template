import Vue from 'vue'
import permission from './permission/permission'
import elDragDialog from './el-drag-dialog'

// 注册全部指令
Vue.directive('permission', permission)
Vue.directive('elDragDialog', elDragDialog)
