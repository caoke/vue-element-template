import { mapGetters } from 'vuex'
import { getMapList } from '@/api/ditigal/map'

export default {
  data() {
    return {
      buildingInfo: {
        bid: '',
        floor: 1
      },

      scaleValue: 1, // 地图缩放比例
      windowWidth: '', // 窗口宽度
      bgImgSrc: require('../assets/map.jpeg'), // 地图背景图片

      backgroundHeight: '', // 地图背景高度 可变

      mapOriginWidth: '', // 地图原始宽度
      mapOriginHeight: '', // 地图原始高度
      mapOriginAspectRatio: '', // 原始地图长宽比 不会变

      floors: '',
      sizeRatio: '',
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView', 'buildings']),
    backgroundWidth() {
      return this.sidebar.opened ? this.scaleValue * (this.windowWidth - 210 - 40) : this.scaleValue * (this.windowWidth - 54 - 40)
    }
  },
  watch: {
    backgroundWidth: {
      handler(nv) {
        if (this.mapOriginAspectRatio) this.backgroundHeight = nv / this.mapOriginAspectRatio
        if (this.mapOriginWidth) this.sizeRatio = nv / this.mapOriginWidth
      },
      immediate: true
    },
    buildings: {
      handler(nv) {
        // 获取区域对应的地图
        const building = this.buildings.length ? this.buildings[0] : ''
        if (building) {
          this.buildingInfo.bid = building.id
          this.floors = building.floors
          // 获取地图的信标
          this.getMapByBuilding()
        }
      },
      immediate: true
    },
    'buildingInfo.bid'(nv) {

    }
  },

  created() {
    this.initWindow()
  },
  methods: {
    initWindow() {
      this.windowWidth = document.body.clientWidth
      window.onresize = () => {
        this.windowWidth = document.body.clientWidth
      }
    },
    /**
     * @description 根据楼栋和楼层 获取地图信息
     */
    getMapByBuilding() {
      this.isLoading = true
      getMapList({
        currentPage: 1,
        pageSize: 100,
        bid: this.buildingInfo.bid,
        floor: this.buildingInfo.floor
      }).then(response => {
        const mapList = response.data
        if (mapList.length) {
          this.mapInfo = mapList[0]
          this.onloadImage(this.mapInfo)
          this.getMapCallback(this.mapInfo)
        } else {
          this.isLoading = false
          this.$message.error(`该楼层没有上传地图，请上传地图`)
        }
      })
    },
    // 加载地图
    onloadImage(mapInfo) {
      // 地图src
      this.bgImgSrc = mapInfo.src
      const img = new Image()
      img.src = this.bgImgSrc
      img.onload = () => {
        console.log('onload')
        this.isLoading = false
        this.mapOriginWidth = img.width
        this.mapOriginHeight = img.height
        this.mapOriginAspectRatio = this.mapOriginWidth / this.mapOriginHeight
        this.backgroundHeight = this.backgroundWidth / this.mapOriginAspectRatio
        this.sizeRatio = this.backgroundWidth / this.mapOriginWidth
      }
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
    }
  }
}
