<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters } from 'vuex'
export default {
    name: 'Navbar',
    components: {
        Hamburger,
        Breadcrumb
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
}
</style>
