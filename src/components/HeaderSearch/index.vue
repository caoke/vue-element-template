<template>
    <div :class="['header-search', {'show': show}]">
        <i class="el-icon-search"></i>
        <el-select
            ref="headerSearchSelect"
            v-model="search"
            :remote-method="querySearch"
            filterable
            default-first-option
            placeholder="Search"
            class="header-search-select"
            @change="change">
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
      options: []
    }
  },
  methods: {
    querySearch(query) {
      if(query.trim()){
        this.options = []
      }
    },
    change(val) {

    }
  }
}
</script>

<style>

</style>
