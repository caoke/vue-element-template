<template>
  <div class="tabs-view">
    <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane
        v-for="(item) in visitedViews"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="!item.affix"
      />
    </el-tabs>
  </div>
</template>

<script>
import path from 'path'

import { mapGetters } from 'vuex'
export default {
  name: 'TabsView',
  components: {

  },
  data() {
    return {
      editableTabsValue: 'Home'
    }
  },
  computed: {
    ...mapGetters(['visitedViews']),
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route(nv) {
      const targetTab = this.filterTab(nv.name)
      if (targetTab) {
        this.editableTabsValue = nv.name
        this.$router.push({ path: nv.fullPath, query: nv.query, fullPath: nv.fullPath })
      } else {
        this.addTags()
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tabsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.editableTabsValue = name
        this.$store.dispatch('tabsView/addView', this.$route)
      }
      return false
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            affix: route.meta.affix,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    /**
    * 是否是当前展示的tab
    */
    isActive(view) {
      return view.fullPath === this.$route.path
    },
    filterTab(tabName) {
      let currTab = []

      if (tabName) {
        currTab = this.visitedViews.filter(view => {
          return view.name === tabName
        })
      }
      return currTab.length ? currTab[0] : undefined
    },
    clickTab(tab) {
      const tag = this.filterTab(tab.name)
      if (tag) {
        this.$router.push({ path: tag.fullPath, query: tag.query, fullPath: tag.fullPath })
      }
    },
    removeTab(tab) {
      const tag = this.filterTab(tab)
      if (!tag) return false
      this.$store.dispatch('tabsView/delView', tag).then(({ visitedViews }) => {
        if (this.isActive(tag)) {
          this.toLeastView(visitedViews, tag)
        }
      })
    },
    /**
         * 移动到最近的tab上
         */
    toLeastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Home') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.tabs-view{
    .el-tabs{
        .el-tabs__item{
            height: 34px;
            line-height: 34px;
        }
        .el-tabs__header{
            background: #ffffff;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
            margin-bottom: 10px;
        }
    }
}
</style>
