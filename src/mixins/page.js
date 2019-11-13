import { buildings } from '@/api/building'
export default {
  filters: {
    filterStr(val, data) {
      return data.filters ? data.filters[val] : val
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      total: 0,
      buildings: [],
      floors: ''
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
    },
    /**
     * @description 设置楼层
     */
    setBuildFloors(bid) {
      const activeBuilding = this.buildings.filter(b => {
        return b.id === bid
      })
      if (activeBuilding.length) {
        this.floors = activeBuilding[0].floors
      }
    },
    /**
     * @description 获取所有楼栋
     */
    getBuildings() {
      console.log('getBuildings')
      buildings({
        currentPage: 1,
        pageSize: 100
      }).then(response => {
        this.buildings = response.data
      })
    }
  }
}
