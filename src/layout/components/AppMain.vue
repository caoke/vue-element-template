<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { buildings } from '@/api/building'
export default {
  name: 'AppMain',
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
  },
  mounted() {

  },
  created() {
    this.getBuildings()
  },
  methods: {
    /**
     * @description 获取所有楼栋
     */
    getBuildings() {
      console.log('getBuildings')
      buildings({
        currentPage: 1,
        pageSize: 100
      }).then(response => {
        this.$store.dispatch('area/setBuildings', response.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main{
    width: 100%;
    overflow: auto;
    position: relative;
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
