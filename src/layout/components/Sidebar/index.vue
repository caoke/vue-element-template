<template>
    <div class="sidebar">
        <logo v-if="showLogo" :collapse="isCollapse"/>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu 
                :default-active="activeMenu"
                :collapse="isCollapse"
                :collapse-transition="false"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="variables.menuActiveText">
                <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path"></sidebar-item>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo'
import { mapGetters } from 'vuex'
export default {
    components: {
        SidebarItem,
        Logo
    },
    data() {
        return{

        }
    },
    computed: {
        ...mapGetters(['sidebar','permission_routes']),
        isCollapse() {
            return !this.sidebar.opened
        },
        activeMenu() {
            const route = this.$route
            const {meta, path} = route
            return meta.activeMenu ? meta.activeMenu : path
        },
        variables() {
            return variables
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        }
    }

}
</script>

<style>

</style>
