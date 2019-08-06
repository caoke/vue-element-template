<template>
  <div class="app-container">
    <img id="icon" src="../../assets/jizhan.png" alt="" @click="add()">
    <canvas ref="myCanvas" class="canvas" @click="addIcon" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: null,
      ctx: null,
      isAdd: false
    }
  },
  mounted() {
    this.init()
    console.log(`{$sideBarWidth}`)
  },
  methods: {
    init() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
    },
    add() {
      this.isAdd = true
    },
    addIcon(event) {
      const img = document.getElementById('icon')
      var mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.c.offsetLeft - 210 - 14,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.c.offsetTop - 95 - 28
      }
      console.log(mouse, event.clientX, this.c.offsetTop)
      // this.ctx.drawImage(img, 100, 20, 28, 28)
      this.ctx.drawImage(img, mouse.x, mouse.y, 28, 28)
    },
    mousedown(e) {
      const startDot = {
        x: e.clientX + document.body.scrollLeft - this.c.offsetLeft,
        y: e.clientY + document.body.scrollHeight - this.c.offsetTop
      }

      if (this.isAdd) {
        this.drawIcon(startDot.x, startDot.y)
      }
    },
    drawIcon(x, y) {
      const img = document.getElementById('icon')
      this.ctx.drawImage(img, x, y, 18, 18)
    },
    drawLine() {
      this.ctx.beginPath() // 开始路径绘制
      this.ctx.moveTo(20, 20) // 设置路径起点，坐标为(20,20)
      this.ctx.lineTo(200, 20) // 绘制一条到(200,20)的直线
      this.ctx.lineWidth = 1.0 // 设置线宽
      this.ctx.strokeStyle = '#CC0000' // 设置线的颜色
      this.ctx.stroke() // 进行线的着色，这时整条线才变得可见
    },
    drawCircle() {
      this.ctx.beginPath()
      this.ctx.arc(60, 60, 50, 0, Math.PI * 2, true)
      this.ctx.fillStyle = ''
      this.ctx.filled = 'rgba(0,0,0,.5)'
      this.ctx.fill()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  img{
      width: 28px;
    }
  .canvas{
    width: 100%;
    height: 100%;
    border: 1px solid #000000;
  }
</style>
