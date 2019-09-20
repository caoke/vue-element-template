<template>
  <div
    v-loading="loading"
    class="area-aerial"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="header-section">
      <el-form :inline="true">
        <el-form-item label="选址地图">
          <el-select v-model="mapInfo">
            <el-option
              v-for="map in mapOptions"
              :key="map.src"
              :label="map.buildingname + map.floor + '层'"
              :value="map.buildingname-map.floor"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="icon-section">
        <span class="all"><img id="icon" width="18px" height="18px" src="../../../assets/icon.png">所有icon</span>
        <span class="selected"><img id="selectedIcon" width="18px" height="18px" src="../../../assets/select-icon.png">已选中icon</span>
      </div>

      <div class="buttons">
        <el-dropdown @command="handleCommand">
          <el-button type="primary" plain size="mini">
            选择工具<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="rect">矩形</el-dropdown-item>
            <el-dropdown-item command="circle">圆形</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" plain size="mini" style="margin-left: 10px;" @click="drawer = true">显示已选icon列表</el-button>
      </div>
    </div>

    <img id="map" ref="myMap" style="display: none;" src="../../../assets/map2.jpeg" @load="baseElement">

    <canvas
      ref="myCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="mousedown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @dblclick="deleteArea($event)"
    />

    <el-drawer
      title="已选icon列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <div class="select-icon">
        <label>选择icon</label>
        <el-select v-model="addIcons" filterable multiple>
          <el-option v-for="(icon, index) in icons" :key="icon.name" :value="index" :label="icon.name" />
        </el-select>
        <el-button type="primary" size="small" style="margin-left: 10px;" @click="addIcon">添加</el-button>
      </div>

      <el-table :data="selectedIcons">
        <el-table-column type="index" />
        <el-table-column label="name" prop="name" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteIcon(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Rect from '@/utils/rect.js'
import Circle from '@/utils/circle.js'

import { getMapList } from '@/api/map.js'

export default {
  data() {
    return {
      loading: true,
      mapInfo: '',
      mapOptions: [
        {
          buildingname: '15hao',
          floor: 23,
          src: 'http://120.24.54.8/yyServer/file/'
        }
      ],

      c: null,
      ctx: null,

      // mousedown的坐标
      startPoint: {
        x: 0,
        y: 0
      },

      // mousedown的位置到左上角距离 或者 中心点位置
      downToStartDis: {
        x: 0,
        y: 0
      },

      isAddArea: false,
      isEditArea: false,
      isMouseDown: false,
      isMoveArea: false,
      isZoomArea: false,

      areaType: 'rect',
      currArea: null,
      currAreaIndex: null,
      areas: [],

      drawer: false,
      icons: [],

      // 手动添加icon
      addIcons: []

    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
    offsetLeft() {
      return this.sidebar.opened ? this.c.offsetLeft + 210 : this.c.offsetLeft + 54
    },
    offsetTop() {
      return this.needTabsView ? this.c.offsetTop + 95 : this.c.offsetTop + 50
    },
    canvasWidth() {
      return this.sidebar.opened ? document.documentElement.clientWidth - 210 - 40 : document.documentElement.clientWidth - 54 - 40
    },
    canvasHeight() {
      return this.canvasWidth * 4041 / 7184 // 图片长宽比
    },
    selectedIcons() {
      return this.icons.filter(item => {
        return item.selected
      })
    },
    mapSrc() {
      const arr = this.mapOptions.filter(map => {
        if (`${map.buildingname}-${map.floor}` === this.mapInfo) {
          return map.src
        }
      })
      return arr.length ? arr[0] : '../../../assets/map2.jpeg'
    }
  },
  watch: {
    'canvasHeight'() {
      this.$nextTick(() => {
        this.drawArea()
        this.drawIcon()
      })
    },
    'selectedIcons'() {
      this.drawIcon()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
    },
    /**
     * @description 基本元素
     */
    baseElement() {
      this.drawBackground()
      this.getAerial()
      this.loading = false
    },
    /**
     * @description 查询所有楼栋
     */
    getMaps() {
      getMapList({ currentPage: 1, pageSize: 100 }).then(response => {
        this.mapOptions = response.data
      })
    },
    /**
     * @description 画背景图
     */
    drawBackground() {
      const map = this.$refs.myMap
      this.ctx.drawImage(map, 0, 0, this.canvasWidth, this.canvasHeight)
    },
    /**
     * @description 获取地图的天线
     */
    getAerial() {
      this.icons = [

        { 'x': 621, 'y': 460, 'name': '9', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 759, 'y': 349, 'name': '10', 'width': 1670, 'height': 939.375, selected: false },

        { 'x': 883, 'y': 532, 'name': '13', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 983, 'y': 527, 'name': '14', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 1049, 'y': 400, 'name': '15', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 1080, 'y': 346, 'name': '16', 'width': 1670, 'height': 939.375, selected: false },

        { 'x': 374, 'y': 510, 'name': '23', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 432, 'y': 375, 'name': '24', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 523, 'y': 378, 'name': '25', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 721, 'y': 574, 'name': '26', 'width': 1670, 'height': 939.375, selected: false },
        { 'x': 774, 'y': 456, 'name': '27', 'width': 1670, 'height': 939.375, selected: false },

        { 'x': 913, 'y': 377, 'name': '29', 'width': 1670, 'height': 939.375, selected: false }
      ]
      this.drawIcon()
    },
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        canvasWidth 当前画布宽度
     *        canvasHeight 当前画布高度
     */
    drawIcon() {
      const img = document.getElementById('icon')
      const selectedImg = document.getElementById('selectedIcon')
      this.icons.forEach((item, index) => {
        const realX = item.x / item.width * this.canvasWidth
        const realY = item.y / item.height * this.canvasHeight
        if (item.selected) {
          this.ctx.drawImage(selectedImg, realX, realY, 28, 28)
        } else {
          this.ctx.drawImage(img, realX, realY, 28, 28)
        }
        // 设置字体
        this.ctx.font = '14px'
        this.ctx.textAlign = 'left'
        this.ctx.fillText(item.name, realX, realY)
      })
    },
    /**
     *@description canvas点击事件
     */
    mousedown(e) {
      this.currArea = null
      this.currAreaIndex = null
      this.isMouseDown = true

      const mouse = {
        x: event.clientX + document.getElementById('areaAdd').scrollLeft - this.offsetLeft,
        y: event.clientY + document.getElementById('app').scrollTop - this.offsetTop
      }
      this.startPoint = mouse

      this.areas.forEach((item, index) => {
        const flag = item.isPointInAreaPoint(item.points, mouse)
        if (flag) {
          this.currArea = item
          this.isZoomArea = true
        } else {
          if (item.isPointInArea(item, mouse)) {
            this.currArea = item
            this.currAreaIndex = index
            this.isMoveArea = true
            this.downToStartDis.x = mouse.x - item.x
            this.downToStartDis.y = mouse.y - item.y
          }
        }
      })

      // 新增
      if (!this.currArea) {
        this.isAddArea = true
        if (this.areaType === 'rect') {
          this.currArea = new Rect(mouse.x, mouse.y, 0, 0, this.canvasWidth, this.canvasHeight)
        } else {
          this.currArea = new Circle(0, 0, 0, this.canvasWidth, this.canvasHeight)
        }
        this.currArea.type = this.areaType
        this.areas.push(this.currArea)
      }
    },

    handleCommand(command) {
      this.areaType = command
    },
    /**
     * @description 鼠标移动
     */
    mouseMove(e) {
      const mouse = {
        x: event.clientX + document.getElementById('areaAdd').scrollLeft - this.offsetLeft,
        y: event.clientY + document.getElementById('app').scrollTop - this.offsetTop
      }

      if (!this.isMouseDown) return

      if (this.isAddArea) {
        // 画矩形
        if (this.areaType === 'rect') {
          const width = mouse.x - this.startPoint.x
          const height = mouse.y - this.startPoint.y

          this.currArea.width = width
          this.currArea.height = height
        }

        // 画圆
        if (this.areaType === 'circle') {
          const x = (this.startPoint.x + mouse.x) / 2
          const y = (this.startPoint.y + mouse.y) / 2
          const radius = Math.sqrt(Math.pow(mouse.x - x, 2) + Math.pow(mouse.y - y, 2))

          this.currArea.x = x
          this.currArea.y = y
          this.currArea.radius = radius
        }
      }
      // 缩放
      if (this.isZoomArea) {
        if (this.currArea.type === 'rect') {
          this.currArea.width = mouse.x - this.currArea.x
          this.currArea.height = mouse.y - this.currArea.y
        }
        if (this.currArea.type === 'circle') {
          const radius = Math.sqrt(Math.pow(mouse.x - this.currArea.x, 2) + Math.pow(mouse.y - this.currArea.y, 2))
          this.currArea.radius = radius
        }
      }
      // 移动
      if (this.isMoveArea) {
        if (this.currArea.type === 'rect') {
          this.ctx.clearRect(0, 0, this.c.width, this.c.height)
          this.currArea.move(mouse.x - this.downToStartDis.x, mouse.y - this.downToStartDis.y)
        }
        if (this.currArea.type === 'circle') {
          this.currArea.move(mouse.x - this.downToStartDis.x, mouse.y - this.downToStartDis.y)
        }
      }

      this.drawArea()
    },
    /**
     * @description 画区域
     */
    drawArea() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.baseElement()

      this.areas.forEach(item => {
        const realX = item.x / item.canvasWidth * this.canvasWidth
        const realY = item.y / item.canvasHeight * this.canvasHeight
        this.ctx.beginPath()
        this.ctx.setLineDash([5, 5])

        // 确定四角位置
        if (item.type === 'rect') {
          item.changePoints(realX, realY, item.width, item.height)
          this.drawRectPoints(item.points)

          this.ctx.strokeRect(realX, realY, item.width, item.height)
          this.ctx.fillRect(realX, realY, item.width, item.height)
          this.ctx.fillStyle = item.fillStyle
        } else {
          item.changePoints(realX, realY, item.radius)
          this.drawRectPoints(item.points)
          this.ctx.arc(realX, realY, item.radius, 0, 2 * Math.PI)
          this.ctx.fillStyle = item.fillStyle
          this.ctx.fill()
        }
        this.ctx.stroke()
      })
    },
    /**
     * @description 鼠标弹起
     */
    mouseUp(e) {
      if (this.isAddArea && (!this.currArea.width && !this.currArea.height) && !this.currArea.radius) {
        this.areas.pop()
      } else {
        this.getSelectedIcons()
      }
      this.isAddArea = false
      this.isMouseDown = false
      this.isMoveArea = false
      this.isZoomArea = false
    },
    /**
     * @description 获取已选择icon
     */
    getSelectedIcons() {
      this.icons.forEach(icon => {
        if (!icon.selected) {
          this.areas.forEach(area => {
            const realX = icon.x / icon.width * this.canvasWidth
            const realY = icon.y / icon.height * this.canvasHeight
            const flag = area.isPointInArea(area, { x: realX, y: realY })
            if (flag) {
              icon.selected = flag
            }
          })
        }
      })
    },

    /**
     * @description 编辑模式给边框四个角添加方框
     */
    drawRectPoints(points) {
      points.forEach((point, index) => {
        this.ctx.beginPath()
        this.ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
        this.ctx.stroke()
      })
    },
    /**
     * @description 删除区域
     */
    deleteArea(e) {
      if (this.currAreaIndex != null) {
        this.areas.splice(this.currAreaIndex, 1)
      }
      this.drawArea()
    },
    /**
     * @description 手动添加
     */
    addIcon() {
      this.addIcons.forEach(item => {
        this.icons[item].selected = true
      })
    },
    /**
     * @description 从以选中删除
     */
    deleteIcon(data) {
      this.icons.forEach(item => {
        if (item.name === data.name) {
          item.selected = false
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.area-aerial{
  .header-section{
    display:  flex;
    justify-content: space-between;
    .icon-section{
      margin-top: 10px;
      svg{
        width:28px;
        height: 28px;
      }
      span{
        margin: 10px;
      }
      .all{
        color: rgb(0, 174, 255);
      }
      .selected{
        color: rgb(243, 59, 13);
      }
    }

  }

  canvas{
    border: 1px solid #000;
  }
}
</style>
<style lang="scss">

  .el-dialog__wrapper{
    .select-icon{
      margin: 0px 10px;
      label{
        font-size: 14px;
        margin-right: 8px;
      }
    }
    .el-table{
      max-height: 90vh;
      overflow-y:auto;
    }
  }

</style>

