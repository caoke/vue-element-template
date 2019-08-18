/**
 * @description Rect 构造函数
 * @param x,y 相对画布的位置坐标
 *        width,heigt 矩形的宽高
 *        name：icon的信息
 *        canvasWidth, canvasHeight 画布的宽高
 *        4个点的位置顺序是顺时针
 */
const Rect = function(x, y, width, height, canvasWidth, canvasHeight) {
  this.x = x
  this.y = y
  this.name = name
  this.width = width
  this.height = height
  this.canvasWidth = canvasWidth
  this.canvasHeight = canvasHeight
  this.fillStyle = 'rgba(64,158,255,.5)'
  this.points = []
}

Rect.prototype = {
  move: function(x, y) {
    this.x = x
    this.y = y
  },
  changePoints: function(x, y, width, height) {
    this.points = [
      {
        x: x + width,
        y: y + height,
        type: 'change'
      }
    ]
  },

  isPointInRectPoint: function(points, mouse) {
    let flag = false
    points.forEach(point => {
      const dis = Math.sqrt(Math.pow(mouse.x - point.x, 2) + Math.pow(mouse.y - point.y, 2))
      if (dis <= 10) flag = point.type
    })
    return flag
  },

  isPointInRect: function(rect, mouse) {
    const leftX = rect.x
    const leftY = rect.y
    const rightX = rect.x + rect.width
    const rightY = rect.y + rect.height
    if (mouse.x >= leftX && mouse.x <= rightX && mouse.y >= leftY && mouse.y <= rightY) {
      return true
    } else {
      return false
    }
  }
}

export default Rect
