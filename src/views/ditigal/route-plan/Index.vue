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
        <i class="el-icon-price-tag" />
        <span>点击icon添加路径</span>
      </div>
      <div class="icon-section_item">
        <img id="icon" width="18px" height="18px" src="../../../assets/icon.png">
        <span>所有icon</span>
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
        ref="myLineCanvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
        @mousedown="mapMouseDown"
        @mousemove="mapMousemove"
        @mouseup="mapMouseup"
      />
      <img id="map" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight">
    </div>
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

      lineC: null,
      lineCtx: null,

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

      startPoint: null,
      endPoint: null,

      lines: [],
      currLine: null, // 当前规划路径

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

      this.lineC = this.$refs.myLineCanvas
      if (this.lineC.getContext) {
        this.lineCtx = this.lineC.getContext('2d')
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

      this.selectedMapId = 1

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
      const res = this.includeIcons(e)
      console.log(res)

      if (this.currLine) return false // 转折点

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
    /**
     * @description 画线
     */
    drawLine(from, to, color) {
      console.log('drawLine', from, to)
      this.lineCtx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      this.lineCtx.moveTo(from.xpos, from.ypos)
      this.lineCtx.lineTo(to.xpos, to.ypos)
      this.lineCtx.strokeStyle = color || 'yellow'
      this.lineCtx.lineWidth = 4

      this.lineCtx.stroke()
    },

    resetInfo() {
      this.isMouseDown = false
      this.currLine = null
      this.startPoint = null
      this.endPoint = null
    },
    saveLine() {
      if (this.startPoint.id) { // 新路径 路径起点
        this.currLine = {
          id: this.lines.length,
          name: `${this.startPoint.id}-`,
          points: [this.startPoint]
        }
      } else if (!this.currLine) {
        this.$message.error('当前路径没有选择信标起点，请重新规划')
        this.resetInfo()
        return false
      }

      this.currLine.points.push(this.endPoint)

      if (this.endPoint.id) { // 路径结束
        this.currLine.name += this.endPoint.id
        if (this.isRepeat(this.currLine.name)) {
          this.clearLine(this.currLine)
          this.$message.error('请勿规划重复路径')
          return
        }
        this.drawLine(this.startPoint, this.endPoint)

        // TODO 调后台接口 保存数据
        const options = this.handlerLinsPoints(this.currLine)
        console.log(options)
        this.lines.push(this.currLine)
        this.resetInfo()
        this.$message.success('当前路径规划完成')

        for (let i = 0; i < options.length - 1; i++) {
          this.drawLine(options(i), options(i + 1), 'red')
        }

        // saveLine(options).then(response => {
        //   this.lines.push(this.currLine)
        //   this.resetInfo()
        //   this.$message.success('当前路径规划完成')
        // })
      } else { // 路径规划中 转折点
        this.drawLine(this.startPoint, this.endPoint)
        this.startPoint = this.endPoint
        this.$message.info('当前路径没有规划完成，请继续规划，结束点必须是信标')
      }
      console.log(this.lines)
    },
    /**
     * @description 处理要保存的数据
     */
    handlerLinsPoints(lineData) {
      const { id, name } = lineData
      const points = lineData.points
      const length = points.length
      const newArr = []
      for (let i = 0; i < length - 1; i++) {
        const start = points[i]
        const end = points[i + 1]
        const width = end.xpos - start.xpos
        const height = end.ypos - start.ypos
        const difference = width > 0 ? 10 : -10

        for (let j = 0; Math.abs(j * difference) < Math.abs(width); j++) {
          const xpos = (start.xpos + j * difference) / this.sizeRatio
          const ypos = (height * (j * difference) / width + start.ypos) / this.sizeRatio
          newArr.push({ xpos, ypos })
        }
      }

      return { id, name, points: newArr }
    },
    /**
     * @description 判断是否重复添加路径
     *
     */
    isRepeat(name) {
      const sameName = name.split('-').reverse().join('-')
      let arr = []
      arr = this.lines.filter(item => {
        return (item.name === name || item.name === sameName)
      })
      return !!arr.length
    },
    clearLine(data) {
      const points = data.points
      const length = points.length

      for (let i = 0; i < length - 1; i++) {
        const x = points[i].xpos
        const y = points[i].ypos
        const width = points[i + 1].xpos - x
        const height = points[i + 1].ypos - y
        this.lineCtx.clearRect(x, y, width, height)
      }
      this.resetInfo()
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
      font-size: 12px;
      .el-icon-price-tag{
        color: #e22b44;
        font-size:16px;
        margin: 0px 1px;
      }
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

