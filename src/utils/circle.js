/**
 * @description Circle 构造函数
 * @param x,y 相对画布的位置坐标
 *        width,heigt 矩形的宽高
 *        name：icon的信息
 *        canvasWidth, canvasHeight 画布的宽高
 *        4个点的位置顺序是顺时针
 */
const Circle = function(centerX, centerY, radius, canvasWidth, canvasHeight) {
  this.centerX = centerX
  this.centerX = centerX
  this.radius = radius
  this.canvasWidth = canvasWidth
  this.canvasHeight = canvasHeight
  this.fillStyle = 'rgba(64,158,255,.5)'
  this.point = {
    x: this.centerX + radius,
    y: this.centerY
  }
}

Circle.prototype = {
  move: function(x, y) {
    this.centerX = x
    this.centerY = y
  },
  changePoints: function(x, y, radius) {
    this.points = {
      x: this.x + radius,
      y: this.x
    }
  },

  isPointInCirclePoint: function(point, mouse) {
    const dis = Math.sqrt(Math.pow(mouse.x - point.x, 2) + Math.pow(mouse.y - point.y, 2))
    return dis <= 10
  },

  isPointInCircle: function(Circle, mouse) {
    const dis = Math.sqrt(Math.pow(mouse.x - Circle.centerX, 2) + Math.pow(mouse.y - Circle.centerY, 2))
    return dis <= Circle.radius
  },

  fill: function(fillStyle) {
    this.fillStyle = fillStyle
  }
}

module.exports = Circle
