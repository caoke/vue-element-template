export const pageMixin = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      total: 0
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryList()
    }
  }
}
