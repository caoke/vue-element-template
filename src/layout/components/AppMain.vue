<template>
    <section class="app-main"> 
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view key="key"/>
            </keep-alive>
        </transition>
    </section>
</template>

<script>
export default {
    name: "AppMain",
    data() {
        return {

        }
    },
    computed: {
        cachedViews() {
            return this.$store.state.tabsView.cachedViews
        },
        key() {
            return this.$route.path
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main{
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
}
</style>
