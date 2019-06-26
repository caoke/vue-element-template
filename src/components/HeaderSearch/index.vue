<template>
  <div :class="{'show': show}" class="header-search">
    <i class="el-icon-search"></i>
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data() {
    return {
      show: false,
      search: ''
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  methods: {
    querySearch() {

    },
    change() {
      
    }
  }
}
</script>

<style>

</style>
