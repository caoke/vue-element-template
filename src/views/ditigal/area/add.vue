<template>
  <div class="app-container area">
    <el-form :inline="true">
      <el-form-item label="选址地图">
        <el-cascader :props="props" />
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button type="primary" plain size="mini" @click="isDrawRect = true">画矩形</el-button>
      <el-button type="primary" plain size="mini" @click="isEditRect = true">修改模式</el-button>
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
      isAdd: false,
      isDrawRect: false,
      isEditRect: false,
      currRect: null,
      rects: []

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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
      this.drawBackground()
      this.getAerial()
    },
    /**
     * @description 画背景图
     */
    drawBackground() {
      // const map = this.$refs.myMap
      // this.ctx.drawImage(map, 0, 0, this.canvasWidth, this.canvasHeight)
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
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      if (this.isDrawRect) {
        this.makeNewRect(mouse)
      }

      if (this.isEditRect) {
        this.rects.forEach(item => {
          if (item.isPointInPath(item, mouse)) {
            this.currRect = item
          }
        })
      }
    },
    /**
     * @description 鼠标移动
     */
    mouseMove(e) {
      if (this.isEditRect && this.currRect) {
        const mouse = {
          x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
          y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
        }
        this.currRect.move(mouse.x, mouse.y)
      }
    },
    /**
     * @description 鼠标弹起
     */
    mouseUp(e) {
      this.drawRects()
    },
    /**
     * @description 画矩形
     */
    makeNewRect(position) {
      this.currRect = new Rect(position.x, position.y, 150, 100, this.canvasWidth, this.canvasHeight)
      this.rects.push(this.currRect)
    },

    drawRects() {
      // 清除画布，准备绘制
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

      this.rects.forEach(item => {
        const realX = item.x / item.canvasWidth * this.canvasWidth
        const realY = item.y / item.canvasHeight * this.canvasHeight
        this.ctx.rect(realX, realY, item.width, item.height)
        this.ctx.stroke()
      })
      this.isDrawRect = false
      this.isEditRect = false
      this.currRect = null
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
