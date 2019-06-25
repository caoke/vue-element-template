const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    sidebar: state => state.app.sidebar,
    permission_routes: state => state.permission.routes,
    needTabsView: state => state.settings.tabsView,
    visitedViews: state => state.tabsView.visitedViews
  }
  export default getters
  