<template>
    <div class="app-warpper" :class="classObj">
        <sidebar class="sidebar-container"/>
        <div :class="{hasTagsView:needTabsView}" class="main-container">
            <div :class="{'fixed-header': fixedHeader}">
                <navbar/>
                <tabs-view v-if="needTabsView"/>
            </div>
            <app-main v-if="!needTabsView"/>
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>

    </div>
</template>

<script>
import  { Sidebar }  from './components'
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
        ...mapGetters(['sidebar', 'needTabsView', 'showSettings']),
        fixedHeader() {
            return false
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened
            }
        }
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
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
</style>
