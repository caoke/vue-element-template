/**
 * @description Circle 构造函数
 * @param x,y 相对画布的位置坐标
 *        width,heigt 矩形的宽高
 *        name：icon的信息
 *        canvasWidth, canvasHeight 画布的宽高
 *        4个点的位置顺序是顺时针
 */
const Circle = function(x, y, radius, canvasWidth, canvasHeight) {
  this.x = x
  this.y = y
  this.radius = radius
  this.canvasWidth = canvasWidth
  this.canvasHeight = canvasHeight
  this.fillStyle = 'rgba(64,158,255,.5)'
  this.points = [
    {
      x: x,
      y: y,
      type: 'move'
    },
    {
      x: x + radius,
      y: y,
      type: 'change'
    }
  ]
}

Circle.prototype = {
  move: function(x, y) {
    this.x = x
    this.y = y
  },
  changePoints: function(x, y, radius) {
    this.radius = radius
    this.points = [
      {
        x: x,
        y: y,
        type: false
      },
      {
        x: x + radius,
        y: y,
        type: 'change'
      }
    ]
  },

  isPointInAreaPoint: function(points, mouse) {
    let flag = false
    points.forEach(point => {
      const dis = Math.sqrt(Math.pow(mouse.x - point.x, 2) + Math.pow(mouse.y - point.y, 2))
      if (dis <= 10) flag = point.type
    })
    return flag
  },

  isPointInArea: function(Circle, mouse) {
    const dis = Math.sqrt(Math.pow(mouse.x - Circle.x, 2) + Math.pow(mouse.y - Circle.y, 2))
    return dis <= Circle.radius
  }
}

export default Circle
