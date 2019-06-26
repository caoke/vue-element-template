<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="right-menu">
            <search id="header-search" class="right-menu-item" />
        </div>
    </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import Search from '@/components/HeaderSearch'

import { mapGetters } from 'vuex'
export default {
    name: 'Navbar',
    components: {
        Hamburger,
        Breadcrumb,
        Search
    },
    computed: {
        ...mapGetters([
            'sidebar'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar{
    height: 50px;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    .hamburger-container{
        line-height: 46px;
        height: 100%;
        cursor: pointer;
        float: left;
        transition: background .3s;
        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }
    .right-menu{
        float: right;
        height: 100%;
        line-height: 50px;
    }
}
</style>
