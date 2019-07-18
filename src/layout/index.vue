<template>
  <div class="app-warpper" :class="classObj">
    <!-- 左侧菜单栏 -->
    <sidebar class="sidebar-container" />

    <div :class="{hasTagsView:needTabsView}" class="main-container">

      <!-- 头部 和 标签页 -->
      <div :class="{'fixed-header': fixedHeader}">
        <navbar />
        <tabs-view v-if="needTabsView" />
      </div>

      <!-- 内容区域 -->
      <app-main />

      <!-- 右边设置区域 -->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>

  </div>
</template>

<script>
import { Sidebar } from './components'
import AppMain from './components/AppMain'
import Navbar from './components/Navbar'
import TabsView from './components/TabsView'
import RightPanel from '@/components/RightPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain,
    Navbar,
    TabsView,
    RightPanel
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView', 'showSettings', 'fixedHeader']),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened
      }
    }
  },
  mounted() {
    // console.log(this.fixedHeader)
  }
}
</script>

<style lang="scss">
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .fixed-header{
        position: fixed;
        top: 0px;
        right: 0px;
        width: calc(100% - #{$sideBarWidth});
        z-index: 9;
        transition: width 0.28s;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }

</style>

