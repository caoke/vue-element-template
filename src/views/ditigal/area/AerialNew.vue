<template>
  <div class="app-container area-aerial">
    <div class="operate-wrap">
      <el-form :inline="true">
        <el-form-item label="选择地图">
          <el-select v-model="mapInfo.bid" @change="changeFloors">
            <el-option
              v-for="build in buildingList"
              :key="build.id"
              :label="`${build.name}`"
              :value="build.id"
            />
          </el-select>
          <el-select v-model="mapInfo.floor" placeholder="请先选择楼栋">
            <el-option v-for="n in selectedBuildFloors" :key="n" :label="n" :value="n" />
          </el-select>
        </el-form-item>
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
      <img id="map" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight">
    </div>

    <el-drawer
      title="icon列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-table :data="icons">
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
import { mapGetters } from 'vuex'
import { getBeacon } from '@/api/ditigal/map'
import { buildings } from '@/api/building'

export default {
  data() {
    return {
      areaId: '',
      iconC: null,
      iconCtx: null,

      areaC: null,
      areaCtx: null,

      mapInfo: {
        bid: '',
        floor: ''
      },

      buildingList: [], // 地图列表
      selectedBuildFloors: '', // 选中楼栋总层数
      selectedMapId: '', // 选中地图的id

      operateType: '', // 是否是可操作模式 single multiple

      icons: [],
      // 原始数据
      originIcons: [],

      currIcon: '',
      currIconIndex: null,

      currArea: null,

      drawer: false,

      bgImgSrc: require('../../../assets/map.jpeg'),

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
    }
  },
  mounted() {
    // 获取区域id
    const { id } = this.$route.params
    this.areaId = id
    this.windowWidth = document.body.clientWidth
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth
    }

    this.init()
  },
  created() {
    this.getBulidings()
  },

  methods: {
    init() {
      console.log('init')
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
     * @description 获取所有楼栋信息
     */
    getBulidings(page) {
      this.currentPage = page || this.currentPage
      buildings({
        currentPage: 1,
        pageSize: 100
      }).then(response => {
        this.buildingList = response.data
        if (this.buildingList.length) {
          // 设置初始值
          this.mapInfo.bid = this.buildingList[0].id
          this.selectedBuildFloors = this.buildingList[0].floors
          this.mapInfo.floor = 1
          // 查询地图
          this.getMapInfo()
        }
      })
    },
    changeFloors(selected) {
      const arr = this.buildingList.filter(item => {
        return item.id === selected
      })

      this.selectedBuildFloors = arr[0].floors
      this.getMapInfo()
    },

    /**
     * @description 根据楼栋和楼层 获取地图信息
     */
    getMapInfo() {
      // TODO 去查询map

      this.selectedMapId = 17

      const img = new Image()
      img.src = this.bgImgSrc
      img.onload = () => {
        console.log('onload')
        this.mapOriginWidth = img.width
        this.mapOriginHeight = img.height
        this.mapOriginAspectRatio = this.mapOriginWidth / this.mapOriginHeight
        this.backgroundHeight = this.backgroundWidth / this.mapOriginAspectRatio
        // 查询地图上所有的图标
        this.getMapBeacon()
      }
    },
    /**
     * @description 查询当前区域id 已经选中的信标
     */
    getAreaBeacon() {
      console.log('getBeacon')
    },
    /**
     * @description 根据地图id查询所有图标
     */
    getMapBeacon() {
      getBeacon(this.selectedMapId).then(response => {
        this.originIcons = response.data
        this.icons = this.responsePosition()
        this.drawIcon()
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
        console.log('single')
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
      if (this.operateType === 'multiple') {
        this.getSelectedIcons()
        this.areaCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      } else if (this.operateType === 'single') {
        this.originIcons[this.currIconIndex].selected = !this.originIcons[this.currIconIndex].selected
      }
      // TODO 为区域添加图标 调后台接口

      this.drawIcon()
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

      this.originIcons.forEach((item, index) => {
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

    /**
     * @description 获取已选择icon
     */
    getSelectedIcons() {
      this.originIcons.forEach(icon => {
        const flag = this.isPointInArea(this.currArea, icon)
        if (flag) {
          icon.selected = flag
        }
      })
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
        this.iconCtx.drawImage(img, realX, realY, 20, 20)
        if (item.selected) {
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
    // 获取icon自适应位置
    responsePosition() {
      const newIcons = JSON.parse(JSON.stringify(this.originIcons))
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
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .area-aerial{
    .operate-wrap{
      display:  flex;
      justify-content: space-between;
      align-items:center;
    }
    .el-form{
      width: 80%;
    }

    .icon-section{
      position: absolute;
      top: 91px;
      z-index: 4;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-left: 6px;
      background: #fff;
      padding: 10px;
      border-radius: 4px;
      box-shadow: 10px 10px 5px #888888;
      svg{
        width:28px;
        height: 28px;
      }
      &_item{
        display:flex;
        align-items: center;
      }

    }
    .canvas-wrapper{
      overflow: auto;
      cursor: pointer;
      position: relative;
      border: 1px solid #000000;
      canvas{
        position: absolute;
      }
    }
  }

</style>
