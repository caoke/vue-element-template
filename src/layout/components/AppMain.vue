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
    width: 100%;
    overflow: hidden;
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main{
    padding-top: 50px;
}

.hasTagsView{
    .app-main {
        /* 100 = navbar + tags-view = 50 + 50 */
        min-height: calc(100vh - 100px);
    }
    .fixed-header + .app-main{
        padding-top: 100px;
    }
 }
</style>
