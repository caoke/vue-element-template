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
  this.centerY = centerY
  this.radius = radius
  this.canvasWidth = canvasWidth
  this.canvasHeight = canvasHeight
  this.fillStyle = 'rgba(64,158,255,.5)'
  this.points = [
    {
      x: centerX,
      y: centerY,
      type: 'move'
    },
    {
      x: centerX + radius,
      y: centerY,
      type: 'change'
    }
  ]
}

Circle.prototype = {
  move: function(x, y) {
    this.centerX = x
    this.centerY = y
  },
  changePoints: function(centerX, centerY, radius) {
    this.radius = radius
    this.points = [
      {
        x: centerX,
        y: centerY,
        type: false
      },
      {
        x: centerX + radius,
        y: centerY,
        type: 'change'
      }
    ]
  },

  isPointInCirclePoint: function(points, mouse) {
    let flag = false
    points.forEach(point => {
      const dis = Math.sqrt(Math.pow(mouse.x - point.x, 2) + Math.pow(mouse.y - point.y, 2))
      if (dis <= 10) flag = point.type
    })
    return flag
  },

  isPointInCircle: function(Circle, mouse) {
    const dis = Math.sqrt(Math.pow(mouse.x - Circle.centerX, 2) + Math.pow(mouse.y - Circle.centerY, 2))
    return dis <= Circle.radius
  }
}

export default Circle
