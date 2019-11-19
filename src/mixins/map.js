import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      scaleValue: 1, // 地图缩放比例
      windowWidth: '', // 窗口宽度
      bgImgSrc: require('../assets/map2.jpeg'), // 地图背景图片

      backgroundHeight: '', // 地图背景高度 可变

      mapOriginWidth: '', // 地图原始宽度
      mapOriginHeight: '', // 地图原始高度
      mapOriginAspectRatio: '', // 原始地图长宽比 不会变

      floors: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView', 'buildings']),
    backgroundWidth() {
      return this.sidebar.opened ? this.scaleValue * (this.windowWidth - 210 - 40) : this.scaleValue * (this.windowWidth - 54 - 40)
    },
    //  显示地图/地图原图 会变
    sizeRatio() {
      return this.mapOriginWidth ? this.backgroundWidth / this.mapOriginWidth : 1
    }
  },
  watch: {
    sizeRatio(nv) {
      this.$nextTick(() => {
        this.drawIcon()
      })
    },
    backgroundWidth: {
      handler(nv) {
        if (this.mapOriginAspectRatio) this.backgroundHeight = nv / this.mapOriginAspectRatio
      },
      immediate: true
    },
    buildings: {
      handler(nv) {
        // 获取区域对应的地图
        const building = this.buildings.length ? this.buildings[0] : ''
        if (building) {
          const bid = building.id
          this.floors = building.floors
          // 获取地图的信标
          this.getMapByBuilding({ bid, floor: 1 })
        }
      },
      immediate: true
    },
    'buildingInfo.bid'(nv) {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.windowWidth = document.body.clientWidth
      window.onresize = () => {
        this.windowWidth = document.body.clientWidth
      }
    },
    // 加载地图
    onloadImage(mapInfo) {
      // 地图src
      // this.bgImgSrc = mapInfo.src
      const img = new Image()
      img.src = this.bgImgSrc
      img.onload = () => {
        console.log('onload')
        this.mapOriginWidth = img.width
        this.mapOriginHeight = img.height
        this.mapOriginAspectRatio = this.mapOriginWidth / this.mapOriginHeight
        this.backgroundHeight = this.backgroundWidth / this.mapOriginAspectRatio
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
