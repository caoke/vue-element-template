<template>
    <div class="app-warpper">
        <sidebar class="sidebar-container"/>
        <div class="main-container">
            <div :class="{'fixed-header': fixedHeader}">
                <navbar/>
            </div>
            <app-main/> 
        </div>
    </div>
</template>

<script>
import  { Sidebar }  from './components'
import AppMain from './components/AppMain'
import Navbar from './components/Navbar'
export default {
    name: 'Layout',
    components: {
        Sidebar,
        AppMain,
        Navbar
    },
    computed: {
        fixedHeader() {
            return false
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
