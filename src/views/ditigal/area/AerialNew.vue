<template>
  <div class="app-container area-aerial">
    <div class="operate-wrap">
      <el-form :inline="true">
        <el-form-item label="选择地图">
          <el-select v-model="mapInfo.bid" placeholder="请选择楼栋" @change="setBuildFloors">
            <el-option
              v-for="building in buildings"
              :key="building.id"
              :value="building.id"
              :label="building.name"
            />
          </el-select>
          <el-select v-model="mapInfo.floor" placeholder="请选择楼层">
            <el-option v-for="n in floors" :key="n" :value="n" :label="`${n}层`" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getBeaconByMap">查询</el-button>
      </el-form>
      <div class="range-container">
        <input v-model="scaleValue" type="range" min="1" max="3.0" step="0.01" style="display: block;">
      </div>
    </div>

    <div class="icon-section">
      <div class="icon-section_item">
        <img id="icon" width="18px" height="18px" src="../../../assets/icon.png">
        <span>所有icon</span>
      </div>
      <div class="icon-section_item">
        <img id="selectedIcon" width="18px" height="18px" src="../../../assets/select-icon.png">
        <span>已选中icon</span>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas
        ref="myIconCanvas"
        class="icon-canvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
      />
      <canvas
        ref="myAreaCanvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
        @mousedown="mapMouseDown"
        @mousemove="mapMousemove"
        @mouseup="mapMouseup"
      />
      <el-image id="map" :src="bgImgSrc" :style="{width: backgroundWidth, height: backgroundHeight}">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </div>

    <el-drawer
      title="icon列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-table :data="areaIcons">
        <el-table-column type="index" />
        <el-table-column label="名称" prop="sn" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteIcon(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

  </div>

</template>

<script>
import pageMixin from '@/mixins/page'
import { mapGetters } from 'vuex'
import { getBeacon, getMapList, deleteBeacon } from '@/api/ditigal/map'
import { getBeaconByAera, addBeaconToArea } from '@/api/ditigal/area'

export default {
  mixins: [pageMixin],
  data() {
    return {
      areaId: '',
      iconC: null,
      iconCtx: null,
      areaC: null,
      areaCtx: null,

      mapInfo: {
        bid: '',
        floor: 1
      },

      operateType: '', // 是否是可操作模式 single multiple

      // 原始数据
      mapIcons: [],
      // 当前区域选中的icon
      areaIcons: [],

      currIcon: '',
      currIconIndex: null,

      currArea: null,

      drawer: false,

      bgImgSrc: '',

      scaleValue: 1,

      windowWidth: '',
      backgroundHeight: '',

      mapOriginWidth: '',
      mapOriginHeight: '',
      mapOriginAspectRatio: '' // 原始地图长宽比 不会变
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
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
          this.mapInfo.bid = building.id
          this.floors = building.floors
          // 获取地图的信标
          this.getBeaconByMap()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getBuildings()
  },
  mounted() {
    this.init()
  },

  methods: {
    /**
     * @description 初始化canvas
     */
    init() {
      console.log('init')
      // 获取区域id
      const { id } = this.$route.params
      this.areaId = id
      this.windowWidth = document.body.clientWidth
      window.onresize = () => {
        this.windowWidth = document.body.clientWidth
      }
      // 获取区域选中信标
      this.getBeaconByArea()
      // 初始化canvas
      this.iconC = this.$refs.myIconCanvas
      if (this.iconC.getContext) {
        this.iconCtx = this.iconC.getContext('2d')
      }

      this.areaC = this.$refs.myAreaCanvas
      if (this.areaC.getContext) {
        this.areaCtx = this.areaC.getContext('2d')
      }
    },

    /**
     * @description 根据楼栋和楼层 获取地图信息
     */
    getBeaconByMap() {
      console.log('getBeaconByMap')
      getMapList({
        currentPage: 1,
        pageSize: 100,
        bid: this.mapInfo.bid,
        floor: this.mapInfo.floor
      }).then(response => {
        const mapList = response.data
        if (mapList.length) {
          const mapInfo = mapList[0]
          this.onloadImage(mapInfo)
          // 查询地图上所有的图标
          getBeacon(mapInfo.id).then(response => {
            this.mapIcons = response.data
            this.drawIcon()
          })
        }
      })
    },
    onloadImage(mapInfo) {
      // 地图src
      this.bgImgSrc = mapInfo.src
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
     * @description 查询当前区域id 已经选中的信标
     */
    getBeaconByArea() {
      console.log('getBeaconByArea')
      getBeaconByAera({ areaId: this.areaId }).then(response => {
        this.areaIcons = response.data
      })
    },

    /** ******* Map S*************/
    mapMouseDown(e) {
      this.isMouseDown = true
      this.resetCurrentIcon()

      const res = this.includeIcons(e)
      console.log(res)

      if (!res) {
        this.operateType = ''
        this.currArea = {
          xpos: e.offsetX,
          ypos: e.offsetY
        }
      } else {
        this.operateType = 'single' // single 当前选中或者取消选中
        console.log('single', res)
        const { seclectIcon, seclectIndex } = res
        this.currIcon = seclectIcon
        this.currIconIndex = seclectIndex
      }
    },
    mapMousemove(e) {
      if (this.isMouseDown) { // 鼠标按下移动并且没有点中图标则为画区域
        this.operateType = 'multiple'
        const width = (e.offsetX - this.currArea.xpos)
        const height = (e.offsetY - this.currArea.ypos)
        this.currArea.width = width
        this.currArea.height = height
        this.drawArea(this.currArea.xpos, this.currArea.ypos, width, height)
      }
    },
    mapMouseup(e) {
      console.log('mouseup')
      this.isMouseDown = false
      let newAreaIcons = []
      if (this.operateType === 'multiple') {
        newAreaIcons = this.getSelectedIcons()
        this.areaCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      } else if (this.operateType === 'single') {
        if (this.isInAreaIcons(this.currIcon)) { // 从区域中删除icon
          this.removeBeaconFromArea()
        } else { // 向区域添加icon
          newAreaIcons.push(this.currIcon)
        }
      }
      // TODO 为区域添加图标 调后台接口
      if (newAreaIcons.length) {
        this.addBeaconToArea(newAreaIcons)
      }
    },
    /**
     * @description 获取点击位置 判断点击的是否已经存在的元素
     */
    includeIcons(e) {
      const mouse = {
        xpos: e.offsetX,
        ypos: e.offsetY
      }

      let seclectIcon = null
      let seclectIndex = null

      this.mapIcons.forEach((item, index) => {
        const realX = item.xpos * this.sizeRatio
        const realY = item.ypos * this.sizeRatio
        if ((mouse.xpos >= realX - 10 && mouse.xpos <= realX + 10) && (mouse.ypos >= realY - 20 && mouse.ypos <= realY)) {
          if (!seclectIcon) {
            seclectIcon = item // 获取的是源数据
            seclectIndex = index
          }
        }
      })
      if (seclectIcon) {
        return { seclectIcon, seclectIndex }
      } else {
        return false
      }
    },

    /**
     * @description 获取已选择icon
     */
    getSelectedIcons() {
      const arr = []
      this.mapIcons.forEach(icon => {
        const flag = this.isPointInArea(this.currArea, icon)
        if (flag && !this.isInAreaIcons(icon)) {
          arr.push(icon)
        }
      })
      return arr
    },
    /**
     * @description 在区域中的icon
     */
    isPointInArea(rect, icon) {
      const leftX = rect.xpos / this.sizeRatio
      const leftY = rect.ypos / this.sizeRatio
      const rightX = (rect.xpos + rect.width) / this.sizeRatio
      const rightY = (rect.ypos + rect.height) / this.sizeRatio
      console.log(rect, icon)
      if (icon.xpos >= leftX && icon.xpos <= rightX && icon.ypos >= leftY && icon.ypos <= rightY) {
        return true
      } else {
        return false
      }
    },

    /** ******* Map E*************/
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     *
     */
    drawIcon() {
      console.log('drawIcon')
      const icons = this.responsePosition()
      this.iconCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      const img = document.getElementById('icon')
      const selectedImg = document.getElementById('selectedIcon')

      icons.forEach((item, index) => {
        const realX = item.xpos - 10
        const realY = item.ypos - 20
        if (this.isInAreaIcons(item)) {
          this.iconCtx.drawImage(selectedImg, realX, realY, 20, 20)
        } else {
          this.iconCtx.drawImage(img, realX, realY, 20, 20)
        }
        // 设置字体
        this.iconCtx.font = 'italic small-caps bold 12px arial'
        this.iconCtx.textAlign = 'left'
        this.iconCtx.fillStyle = item.selected ? 'red' : '#2755a5'
        this.iconCtx.fillText(item.sn, realX, realY)
      })
    },
    // 判断icon是否在areaIcons中
    isInAreaIcons(icon) {
      const areaIconIds = this.areaIcons.map(icon => icon.id)
      return areaIconIds.includes(icon.id)
    },
    // 获取icon自适应位置
    responsePosition() {
      const newIcons = JSON.parse(JSON.stringify(this.mapIcons))
      newIcons.forEach(item => {
        item.xpos = item.xpos * this.sizeRatio
        item.ypos = item.ypos * this.sizeRatio
      })
      return newIcons
    },

    drawArea(x, y, width, height) {
      this.areaCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      this.areaCtx.beginPath()
      this.areaCtx.setLineDash([5, 5])
      this.areaCtx.strokeRect(x, y, width, height)
      this.areaCtx.fillRect(x, y, width, height)
      this.areaCtx.fillStyle = 'rgba(64,158,255,.5)'
    },

    resetCurrentIcon() {
      this.currIcon = null
      this.currIconIndex = ''
    },
    resetInfo() {
      this.isMouseDown = false
    },
    addBeaconToArea(newAreaIcons) {
      const beaconIds = newAreaIcons.map(icon => icon.id).join(',')
      addBeaconToArea({ beaconIds, areaId: this.areaId }).then((response) => {
        // this.$message.success('add success')
        this.areaIcons = this.areaIcons.concat(newAreaIcons)
        this.drawIcon()
      })
    },
    /**
     * @description 区域删除信标
     */
    removeBeaconFromArea() {
      deleteBeacon({ beaconId: this.currIcon.id, type: 2, id: this.areaId }).then(response => {
        console.log(response)
        this.areaIcons.splice(this.areaIcons.findIndex(item => item.id === this.currIcon.id), 1)
        // this.$message.success('delete success')
        this.drawIcon()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
</style>
