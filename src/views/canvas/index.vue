<template>
  <div class="app-container">
    <canvas id="myCanvas" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: null,
      ctx: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.c = document.getElementById('myCanvas')
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
      this.drawLine()
      this.drawCircle()
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
#myCanvas{
  width: 100%;
  height: 100%;
  border: 1px solid #000000;
}
</style>
