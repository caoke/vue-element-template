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
        <el-button type="primary" @click="getMapByBuilding">查询</el-button>
        <el-button type="primary" plain @click="drawer = true">显示路径列表</el-button>
        <el-button type="primary" plain @click="clearCanvas(lineCtx)">清空画布</el-button>
      </el-form>
      <div class="range-container">
        <input v-model="scaleValue" type="range" min="1" max="3.0" step="0.01" style="display: block;">
      </div>
    </div>

    <div class="icon-section">
      <div class="icon-section_item">
        <i class="el-icon-price-tag" />
        <span>点击icon添加路径</span>
      </div>
      <div class="icon-section_item">
        <img id="icon" width="18px" height="18px" src="../../../assets/icon.png">
        <span>所有icon</span>
      </div>
    </div>

    <div v-loading="isLoading" class="canvas-wrapper">
      <canvas
        ref="myIconCanvas"
        class="icon-canvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
      />
      <canvas ref="originalLineCanvas" class="original-line-canvas" :width="backgroundWidth" :height="backgroundHeight" />
      <canvas
        ref="myLineCanvas"
        class="draw-line-canvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
        @mousedown="mapMouseDown"
        @mousemove="mapMousemove"
        @mouseup="mapMouseup"
      />
      <img id="map" class="bg-image" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight">
    </div>

    <el-drawer
      title="路径列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-table :data="mapPaths">
        <el-table-column type="index" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deletePath(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getBeacon, getMapList, getMapById } from '@/api/ditigal/map'
import { getPathPlanningList, addPathPlanning, deletePathPlanning } from '@/api/ditigal/path'
import pageMixin from '@/mixins/page'

export default {
  name: 'DitigalRoutePlan',
  mixins: [pageMixin],
  data() {
    return {
      isLoading: false,
      areaId: '',
      iconC: null,
      iconCtx: null,

      oLineC: null,
      oLineCtx: null,

      lineC: null,
      lineCtx: null,

      mapInfo: {
        bid: '',
        floor: 1
      },
      selectedMapId: '', // 选中地图的id

      icons: [],
      // 原始数据
      mapIcons: [],
      mapPaths: [],

      startPoint: null,
      endPoint: null,

      lines: [],
      currLine: null, // 当前规划路径
      drawer: false,

      bgImgSrc: require('../../../assets/map.jpeg'),

      scaleValue: 1, // 显示缩放比

      windowWidth: '',
      backgroundHeight: '',

      mapOriginWidth: '',
      mapOriginHeight: '',
      mapOriginAspectRatio: '' // 原始地图长宽比 不会变

      // sizeRatio: '' // 显示地图/地图原图 会变

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
      console.log(nv)
      this.$nextTick(() => {
        this.drawIcon()
        this.getOriginalLine()
      })
    },
    backgroundWidth: {
      handler(nv) {
        if (this.mapOriginAspectRatio) this.backgroundHeight = nv / this.mapOriginAspectRatio
        // if (this.mapOriginWidth) this.sizeRatio = nv / this.mapOriginWidth
      },
      immediate: true
    },
    buildings: {
      handler(nv) {
        // 获取区域对应的地图
        const building = this.buildings.length ? this.buildings[0] : ''
        if (building && !this.$route.query.id) {
          this.mapInfo.bid = building.id
          this.floors = building.floors
          // 获取地图的信标
          this.getMapByBuilding()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
    this.windowWidth = document.body.clientWidth
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth
    }
    // 获取地图id
    const { id } = this.$route.query
    if (id) {
      this.selectedMapId = id
      this.getMapByMapId()
      this.getBeaconByMap()
      this.getOriginalLine()
    }
  },
  created() {
    this.getBuildings()
  },

  methods: {
    init() {
      console.log('init')
      this.iconC = this.$refs.myIconCanvas
      if (this.iconC.getContext) {
        this.iconCtx = this.iconC.getContext('2d')
      }

      this.oLineC = this.$refs.originalLineCanvas
      if (this.oLineC.getContext) {
        this.oLineCtx = this.oLineC.getContext('2d')
      }

      this.lineC = this.$refs.myLineCanvas
      if (this.lineC.getContext) {
        this.lineCtx = this.lineC.getContext('2d')
      }
    },
    /**
     * @description 根据楼栋和楼层 获取地图信息
     */
    getMapByBuilding() {
      console.log('getMapByBuilding')
      this.isLoading = true
      this.clearCanvas(this.lineCtx)
      this.clearCanvas(this.iconCtx)
      this.clearCanvas(this.oLineCtx)
      getMapList({
        currentPage: 1,
        pageSize: 100,
        bid: this.mapInfo.bid,
        floor: this.mapInfo.floor
      }).then(response => {
        const mapList = response.data
        if (mapList.length) {
          const mapInfo = mapList[0]
          this.selectedMapId = mapInfo.id
          this.onloadImage(mapInfo)
          this.getBeaconByMap()
          this.getOriginalLine()
        } else {
          this.isLoading = false
          this.$message.error('当前楼层没有地图，请上传地图')
        }
      })
        .catch(err => {
          console.log(err)
          this.isLoading = false
        })
    },
    /**
     * @description 根据地图ID获取地图详情
     */
    getMapByMapId() {
      getMapById(this.selectedMapId).then(response => {
        const { building, floor } = response.data
        this.mapInfo.bid = building
        this.mapInfo.floor = floor
        this.onloadImage(response.data)
      })
    },

    onloadImage(mapInfo) {
      // 地图src
      this.bgImgSrc = mapInfo.src
      const img = new Image()
      img.src = this.bgImgSrc
      img.onload = () => {
        this.isLoading = false
        console.log('onload')
        this.mapOriginWidth = img.width
        this.mapOriginHeight = img.height
        this.mapOriginAspectRatio = this.mapOriginWidth / this.mapOriginHeight // 长宽比
        this.backgroundHeight = this.backgroundWidth / this.mapOriginAspectRatio // 根据长宽比获取显示高度
        // this.sizeRatio = this.backgroundWidth / this.mapOriginWidth // 显示地图宽度/原始地图宽度 缩放比例 根据显示宽度的变化会变
      }
    },
    getBeaconByMap() {
      // 查询地图上所有的图标
      getBeacon(this.selectedMapId).then(response => {
        this.mapIcons = response.data
        this.drawIcon()
      })
    },
    /**
     * @ description 获取已有的路径
     */
    getOriginalLine() {
      console.log('getOriginalLine')
      getPathPlanningList(this.selectedMapId).then(response => {
        this.mapPaths = response.data
        this.drawOriginalLine()
      })
    },

    /** ******* Map S*************/
    mapMouseDown(e) {
      this.isMouseDown = true
      if (this.currLine) return false // 转折点

      const res = this.includeIcons(e)
      if (!res) {
        this.startPoint = {
          xpos: e.offsetX,
          ypos: e.offsetY
        }
      } else {
        const { xpos, ypos, sn, id } = res.seclectIcon
        this.startPoint = {
          xpos: xpos * this.sizeRatio,
          ypos: ypos * this.sizeRatio,
          sn,
          id
        }
      }
    },
    mapMousemove(e) {
      if (this.isMouseDown) { // 鼠标按下移动 画线
        const res = this.includeIcons(e)
        if (!res) {
          this.endPoint = {
            xpos: e.offsetX,
            ypos: e.offsetY
          }
        } else {
          const { xpos, ypos, sn, id } = res.seclectIcon
          this.endPoint = {
            xpos: xpos * this.sizeRatio,
            ypos: ypos * this.sizeRatio,
            sn,
            id
          }
        }
      }
    },
    mapMouseup(e) {
      console.log('mouseup')
      this.isMouseDown = false

      this.saveLine()
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
      this.iconCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      const img = document.getElementById('icon')

      this.mapIcons.forEach((icon, index) => {
        const item = this.responsePosition(icon)
        const realX = item.xpos - 10
        const realY = item.ypos - 20
        this.iconCtx.drawImage(img, realX, realY, 20, 20)
        // 设置字体
        this.iconCtx.font = 'italic small-caps bold 12px arial'
        this.iconCtx.textAlign = 'left'
        this.iconCtx.fillStyle = item.selected ? 'red' : '#2755a5'
        this.iconCtx.fillText(item.sn, realX, realY)
      })
    },
    drawOriginalLine() {
      this.clearCanvas(this.oLineCtx)
      this.clearCanvas(this.lineCtx)
      this.mapPaths.forEach(line => {
        for (let i = 0; i < line.points.length - 1; i++) {
          const from = this.responsePosition(line.points[i])
          const to = this.responsePosition(line.points[i + 1])
          this.drawLine(this.oLineCtx, from, to)
        }
      })
    },
    drawNewLine() {
      this.clearCanvas(this.lineCtx)

      this.lines.forEach(line => {
        const endLine = line.points[line.points.length - 1]
        if (endLine.id) {
          for (let i = 0; i < line.points.length - 1; i++) {
            const from = line.points[i]
            const to = line.points[i + 1]
            if (form && to) {
              this.drawLine(this.lineCtx, from, to)
            }
          }
        }
      })
    },
    // 获取icon自适应位置
    responsePosition(data) {
      const item = JSON.parse(JSON.stringify(data))
      item.xpos *= this.sizeRatio
      item.ypos *= this.sizeRatio
      return item
    },
    /**
     * @description 画线
     */
    drawLine(lineCtx, from, to, color) {
      lineCtx.beginPath()
      lineCtx.moveTo(from.xpos, from.ypos)
      lineCtx.lineTo(to.xpos, to.ypos)
      lineCtx.strokeStyle = color || 'yellow'
      lineCtx.lineWidth = 2
      lineCtx.stroke()
    },

    resetInfo() {
      this.isMouseDown = false
      this.currLine = null
      this.startPoint = null
      this.endPoint = null
    },
    saveLine() {
      if (this.startPoint && this.startPoint.id) { // 新路径 路径起点
        this.currLine = {
          name: `${this.startPoint.sn}-`,
          points: [this.startPoint]
        }
      } else {
        if (!this.currLine) {
          this.$message.error('当前路径没有选择信标起点，请重新规划')
          this.resetInfo()
          return false
        }
      }

      if (this.endPoint && this.endPoint.sn) { // 路径结束
        const name = this.currLine.name + this.endPoint.sn
        if (this.isRepeat(name)) { // 重复规划路径
          this.resetInfo()
          this.drawNewLine()
          this.$message.error('请勿规划重复路径')
          return
        } else {
          this.currLine.name = name

          this.currLine.points.push(this.endPoint)

          // TODO 调后台接口 保存数据
          const options = this.handlerLinsPoints(this.currLine)
          this.submitLine(options)
        }
      } else { // 路径规划中 转折点
        this.drawLine(this.lineCtx, this.startPoint, this.endPoint)
        this.startPoint = this.endPoint
        this.$message.info('当前路径没有规划完成，请继续规划，结束点必须是信标')
        this.currLine.points.push(this.endPoint)
      }
    },
    /**
     * @description 处理要保存的数据
     */
    handlerLinsPoints(lineData) {
      const { name } = lineData
      const points = lineData.points
      const length = points.length
      const newArr = []
      for (let i = 0; i < length - 1; i++) {
        const start = points[i]
        const end = points[i + 1]
        const width = end.xpos - start.xpos
        const height = end.ypos - start.ypos
        const widthDifference = width >= 0 ? 10 : -10
        const heightDifference = height >= 0 ? 10 : -10
        const absWidth = Math.abs(width)
        const absHeight = Math.abs(height)

        if (absWidth >= absHeight) { // 用宽度分割
          for (let j = 0; Math.abs(j * widthDifference) < absWidth; j++) {
            const xpos = (start.xpos + j * widthDifference) / this.sizeRatio
            const ypos = (absHeight * (j * heightDifference) / absWidth + start.ypos) / this.sizeRatio
            newArr.push({ xpos, ypos })
          }
        } else { // 用高度分割
          for (let j = 0; Math.abs(j * heightDifference) < absHeight; j++) {
            const xpos = (absWidth * (j * widthDifference) / absHeight + start.xpos) / this.sizeRatio
            const ypos = (start.ypos + j * heightDifference) / this.sizeRatio
            newArr.push({ xpos, ypos })
          }
        }
        newArr.push({ xpos: end.xpos / this.sizeRatio, ypos: end.ypos / this.sizeRatio })
      }

      return { name, points: newArr }
    },
    /**
     * @description 判断是否重复添加路径
     *
     */
    isRepeat(name) {
      const sameName = name.split('-').reverse().join('-')// 1-2 2-1是同一条路径
      let arr = []
      arr = this.lines.concat(this.mapPaths).filter(item => {
        return (item.name === name || item.name === sameName)
      })
      return !!arr.length
    },
    /**
     * @description 向后台提交数据
     */
    submitLine(options) {
      options.mapId = this.selectedMapId
      addPathPlanning(options).then(response => {
        this.clearCanvas(this.lineCtx)
        this.getOriginalLine()
        this.$message.success('当前路径规划完成')
      })
    },
    deletePath(data) {
      deletePathPlanning(data.id).then(response => {
        this.getOriginalLine()
        this.$message.success('删除成功！')
      })
    },
    clearCanvas(ctx) {
      ctx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      this.resetInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

</style>

