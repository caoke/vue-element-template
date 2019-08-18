<template>
  <div class="area-aerial">
    <el-form :inline="true">
      <el-form-item label="选址地图">
        <el-cascader :props="props" />
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button :type="isDrawRect ? 'success' : 'primary'" plain size="mini" @click="addRect">{{ isDrawRect ? '结束新增矩形': '新增矩形' }}</el-button>
      <el-button :type="isDrawCircle ? 'success' : 'primary'" plain size="mini" @click="addCircle">{{ isDrawCircle ? '结束圆形': '新增圆形' }}</el-button>
      <el-button type="primary" plain size="mini" @click="drawer = true">显示已选icon列表</el-button>
    </div>

    <canvas
      ref="myCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="mousedown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    />

    <img id="map" ref="myMap" style="display: none;" src="../../../assets/map2.jpeg" width="1000" height="600">

    <el-drawer
      title="icon列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-table :data="areas">
        <el-table-column type="index" />
        <el-table-column label="name" prop="name" />
        <el-table-column label="类型" prop="type" />
        <el-table-column label="操作" width="200">
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
import Rect from '@/utils/rect.js'
import Circle from '@/utils/circle.js'

let id = 0
export default {
  data() {
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
              .map(item => ({
                value: ++id,
                label: `选项${id}`,
                leaf: level >= 2
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }, 1000)
        }
      },

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

      isDrawRect: false,
      isRotateRect: false,
      currRect: null,
      rects: [],

      isDrawCircle: false,
      isChangeCircle: false,
      currCircle: null,
      circles: [],

      dialogFormVisible: false,
      dialogForm: {
        name: '',
        type: ''
      },

      drawer: false

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
    areas() {
      return this.rects.concat(this.circles)
    }
  },
  watch: {
    'canvasHeight'() {
      this.$nextTick(() => {
        this.drawArea()
      })
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
      this.baseElement()
    },
    baseElement() {
      this.drawBackground()
      this.getAerial()
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

    },
    /**
     *@description canvas点击事件
     */
    mousedown(e) {
      this.currRect = null
      this.currCircle = null
      this.isMouseDown = true
      const mouse = {
        x: event.clientX + document.getElementById('areaAdd').scrollLeft - this.offsetLeft,
        y: event.clientY + document.getElementById('app').scrollTop - this.offsetTop
      }
      this.startPoint = mouse
      // 是否在矩形区域中
      this.rects.forEach(item => {
        const flag = item.isPointInRectPoint(item.points, mouse)
        if (flag) {
          this.currRect = item
          this.isZoomArea = true
        } else {
          if (item.isPointInRect(item, mouse)) {
            this.currRect = item
            this.isMoveArea = true
            this.downToStartDis.x = mouse.x - item.x
            this.downToStartDis.y = mouse.y - item.y
          }
        }
      })

      // 是否在圆形区域中
      if (!this.currRect) {
        this.circles.forEach(item => {
          const flag = item.isPointInCirclePoint(item.points, mouse)
          if (flag) {
            this.currCircle = item
            this.isZoomArea = true
          } else {
            if (item.isPointInCircle(item, mouse)) {
              this.isMoveArea = true
              this.currCircle = item
              this.downToStartDis.x = mouse.x - item.centerX
              this.downToStartDis.y = mouse.y - item.centerY
            }
          }
        })
      }
      // 新增
      if (!this.currRect && !this.currCircle) {
        this.isAddArea = true 
        if (this.isDrawRect) {
          this.currRect = new Rect(mouse.x, mouse.y, 0, 0, this.canvasWidth, this.canvasHeight)
          this.rects.push(this.currRect)
        }

        if (this.isDrawCircle) {
          this.currCircle = new Circle(0, 0, 0, this.canvasWidth, this.canvasHeight)
          this.circles.push(this.currCircle)
        }
      }
    },
    /**
     * @description 鼠标移动
     */
    mouseMove(e) {
      const mouse = {
        x: event.clientX + document.getElementById('areaAdd').scrollLeft - this.offsetLeft,
        y: event.clientY + document.getElementById('app').scrollTop - this.offsetTop
      }
      // 画矩形
      const width = mouse.x - this.startPoint.x
      const height = mouse.y - this.startPoint.y

      if (!this.isMouseDown) return
      if (this.isAddArea) {
        if (this.isDrawRect) {
          this.currRect.width = width
          this.currRect.height = height
        }

        // 画圆
        if (this.isDrawCircle) {
          const centerX = (this.startPoint.x + mouse.x) / 2
          const centerY = (this.startPoint.y + mouse.y) / 2
          const radius = Math.sqrt(Math.pow(mouse.x - centerX, 2) + Math.pow(mouse.y - centerY, 2))

          this.currCircle.centerX = centerX
          this.currCircle.centerY = centerY
          this.currCircle.radius = radius
        }
      }
      // 缩放
      if (this.isZoomArea) {
        if (this.currRect) {
          this.currRect.width = mouse.x - this.currRect.x
          this.currRect.height = mouse.y - this.currRect.y
        }
        if (this.currCircle) {
          const radius = Math.sqrt(Math.pow(mouse.x - this.currCircle.centerX, 2) + Math.pow(mouse.y - this.currCircle.centerY, 2))
          this.currCircle.radius = radius
        }
      }
      // 移动
      if (this.isMoveArea) {
        if (this.currRect) {
          this.ctx.clearRect(0, 0, this.c.width, this.c.height)
          this.currRect.move(mouse.x - this.downToStartDis.x, mouse.y - this.downToStartDis.y)
        }
        if (this.currCircle) {
          this.currCircle.move(mouse.x - this.downToStartDis.x, mouse.y - this.downToStartDis.y)
        }
      }

      this.drawArea()
    },
    /**
     * @description 鼠标弹起
     */
    mouseUp(e) {
      this.isMouseDown = false
      this.isAddArea = false
      this.isMoveArea = false
      this.isZoomArea = false
    },

    /**
     * @description 画矩形模式
     */
    addRect() {
      if (this.isDrawRect) {
        this.resetInfo()
      } else {
        this.resetInfo()
        this.isDrawRect = true
      }
    },
    /**
     * @description 画圆模式
     */
    addCircle() {
      if (this.isDrawCircle) {
        this.resetInfo()
      } else {
        this.resetInfo()
        this.isDrawCircle = true
      }
    },
    /**
     * @description 画区域
     */
    drawArea() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.baseElement()

      this.drawRects()
      this.drawCircles()
    },
    /**
     * @description 画矩形区域
     */
    drawRects() {
      this.rects.forEach(item => {
        const realX = item.x / item.canvasWidth * this.canvasWidth
        const realY = item.y / item.canvasHeight * this.canvasHeight
        this.ctx.beginPath()

        // 确定四角位置
        item.changePoints(realX, realY, item.width, item.height)
        this.ctx.setLineDash([5, 5])
        this.drawRectPoints(item.points)

        this.ctx.strokeRect(realX, realY, item.width, item.height)
        this.ctx.fillRect(realX, realY, item.width, item.height)
        this.ctx.fillStyle = item.fillStyle
        
        // this.ctx.fill()
        this.ctx.stroke()
      })
    },
    /**
     * @description 画圆形区域
     */
    drawCircles() {
      this.circles.forEach(item => {
        const realX = item.centerX / item.canvasWidth * this.canvasWidth
        const realY = item.centerY / item.canvasHeight * this.canvasHeight
        this.ctx.beginPath()
        item.changePoints(realX, realY, item.radius)
        this.ctx.setLineDash([5, 5])
        this.drawRectPoints(item.points)
        this.ctx.arc(realX, realY, item.radius, 0, 2 * Math.PI)
        this.ctx.fillStyle = item.fillStyle        
        this.ctx.fill()
        this.ctx.stroke()
      })
    },

    /**
     * @description 重置
     */
    resetInfo() {
      this.currRect = null
      this.currCircle = null
      this.isMoveArea = false
      this.isZoomArea = false
      this.isAddArea = false
      this.isDrawCircle = false
      this.isDrawRect = false
    },
    /**
     * @description 编辑模式给边框四个角添加方框
     */
    drawRectPoints(points) {
      points.forEach((point, index) => {
        this.ctx.beginPath()
        this.ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
        // this.ctx.stroke()
      })
    },
    /**
     *@description 清空画布
     */
    clear() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },  
    /**
     * @description 删除区域
     */
    deleteIcon(index) {

    }
  }
}
</script>

<style lang="scss" scoped>
.area-aerial{
  .buttons{
    float: right;
    margin-top: 10px;
  }
  .el-form{
    display: inline-block;
  }
  canvas{
    border: 1px solid #000;
  }
}
</style>
