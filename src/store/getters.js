const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  sidebar: state => state.app.sidebar,
  permission_routes: state => state.permission.routes,
  needTabsView: state => state.settings.tabsView,
  showSettings: state => state.settings.showSettings,
  visitedViews: state => state.tabsView.visitedViews,
  fixedHeader: state => state.settings.fixedHeader
}
export default getters
  