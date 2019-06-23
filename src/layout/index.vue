<template>
    <div class="app-warpper">
        <sidebar class="sidebar-container"/>
        <div class="main-container">
            <nav-bar/>
            <app-main/> 
        </div>
    </div>
</template>

<script>
import Sidebar  from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import NavBar from './components/NavBar.vue'
export default {
    components: {
        NavBar,
        AppMain,
        Sidebar
    }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";

 .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
</style>
