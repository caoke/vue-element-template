<template>
  <div class="app-container area">
    <el-form :inline="true">
      <el-form-item label="选址地图">
        <el-cascader :props="props" />
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button :type="isDrawRect ? 'success' : 'primary'" plain size="mini" @click="addModel">{{ isDrawRect ? '结束新增模式': '开启新增模式' }}</el-button>
      <el-button :type="isDrawCircle ? 'success' : 'primary'" plain size="mini" @click="addCircleModel">{{ isDrawCircle ? '结束圆形模式': '开启圆形模式' }}</el-button>
      <el-button :type="isEditRect ? 'success' : 'primary'" plain size="mini" @click="editModel">{{ isEditRect ? '结束修改模式' : '开启修改模式' }}</el-button>
      <el-button type="primary" plain size="mini" @click="clear">清空</el-button>
    </div>

    <canvas
      ref="myCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="mousedown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
    />

    <img id="map" ref="myMap" style="display: none;" src="../../../assets/map.jpeg" width="1000" height="600">
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

      // mousedown的位置到左上角距离
      downToStartDis: {
        x: 0,
        y: 0
      },

      // 当前方框的原始长宽
      currRectOriginalWidth: 0,
      currRectOriginalHeight: 0,

      isDrawRect: false,
      isEditRect: false,
      isMouseDown: false,
      isMoveRect: false,
      isChangeRect: false,
      isRotateRect: false,
      currRect: null,
      rects: [],

      isDrawCircle: false,
      currCircle: null,
      circles: []

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
    }
  },
  watch: {
    'canvasHeight'() {
      this.$nextTick(() => {
        this.drawRects()
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
      // this.drawBackground()
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
      this.isMouseDown = true
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      this.startPoint = mouse

      if (this.isDrawRect) {
        this.currRect = new Rect(this.startPoint.x, this.startPoint.y, 0, 0, this.canvasWidth, this.canvasHeight, '')
        this.rects.push(this.currRect)
      }

      if (this.isEditRect) {
        this.rects.forEach(item => {
          const flag = item.isPointInRectPoint(item.points, mouse)
          if (flag) {
            this.currRect = item
            this.isMoveRect = false
            if (flag === 'change') {
              this.isChangeRect = true
            }
            if (flag === 'rotate') {
              this.isRotateRect = true
            }
            this.currRectOriginalWidth = item.width
            this.currRectOriginalHeight = item.height
          }

          if (!this.isChangeRect) {
            if (item.isPointInRect(item, mouse)) {
              this.currRect = item
              this.isMoveRect = true
              this.isChangeRect = false

              this.downToStartDis.x = mouse.x - item.x
              this.downToStartDis.y = mouse.y - item.y
            }
          }
        })
      }

      if (this.isDrawCircle) {
        this.currCircle = new Circle(this.startPoint.x, this.startPoint.y, 0, this.canvasWidth, this.canvasHeight)
        this.circles.push(this.currCircle)
      }
    },
    /**
     * @description 鼠标移动
     */
    mouseMove(e) {
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      const width = mouse.x - this.startPoint.x
      const height = mouse.y - this.startPoint.y

      if (!this.isMouseDown) return

      if (this.isDrawRect) {
        this.currRect.width = width
        this.currRect.height = height
        var radius = Math.sqrt(Math.pow(mouse.x - this.startPoint.x, 2) + Math.pow(mouse.y - this.startPoint.y, 2)) / 2
        var startAngle = mouse.y > this.startPoint.y ? Math.acos((mouse.x - this.startPoint.x) / (2 * radius)) : Math.acos((this.startPoint.x - mouse.x) / (2 * radius))
        this.currRect.angle = startAngle
      }

      if (this.isChangeRect && this.currRect) {
        this.currRect.width = this.currRectOriginalWidth + width
        this.currRect.height = this.currRectOriginalHeight + height
      }

      if (this.isMoveRect && this.currRect) {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        this.currRect.move(mouse.x - this.downToStartDis.x, mouse.y - this.downToStartDis.y)
      }

      if (this.isDrawCircle) {

      }
      this.drawRects()
    },
    /**
     * @description 鼠标弹起
     */
    mouseUp(e) {
      if (this.isDrawRect) {
        this.makeNewRect()
      }

      this.isMouseDown = false
      this.isDrawRect = false
      this.isChangeRect = false
    },

    /**
     * @description 画矩形
     */
    addModel() {
      if (!this.isDrawRect) {
        this.isDrawRect = true
        this.isEditRect = false
        this.isDrawCircle = false
      } else {
        this.isDrawRect = false
      }
    },
    /**
     * @description 画圆
     */
    addCircleModel() {
      if (!this.isDrawCircle) {
        this.isDrawCircle = true
        this.isDrawRect = false
        this.isEditRect = false
      } else {
        this.isDrawCircle = false
      }
    },
    /**
     * @description 画矩形
     */
    makeNewRect() {
      this.drawRects()
    },

    drawRects() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.baseElement()
      this.rects.forEach(item => {
        const realX = item.x / item.canvasWidth * this.canvasWidth
        const realY = item.y / item.canvasHeight * this.canvasHeight

        this.ctx.beginPath()

        if (this.isEditRect) {
          this.ctx.setLineDash([5, 5])
          this.drawRectPoints(item.points)
        } else {
          this.ctx.setLineDash([])
        }

        this.ctx.strokeRect(realX, realY, item.width, item.height)
        this.ctx.fillRect(realX, realY, item.width, item.height)
        this.ctx.fillStyle = item.fillStyle

        item.changePoints(item.x, item.y, item.width, item.height)
      })
    },

    /**
     * @description 编辑模式
     */
    editModel() {
      if (!this.isEditRect) {
        this.isEditRect = true
      } else {
        this.isEditRect = false
        this.isMoveRect = false
        this.isChangeRect = false
      }
      this.drawRects()
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
     *@description 清空画布
     */
    clear() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    }
  }
}
</script>

<style lang="scss" scoped>
.area{
  .buttons{
    margin-bottom: 10px;
  }
  canvas{
    border: 1px solid #000;
  }
}
</style>
