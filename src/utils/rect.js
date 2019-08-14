/**
 * @description Rect 构造函数
 * @param x,y 相对画布的位置坐标
 *        width,heigt 矩形的宽高
 *        name：icon的信息
 *        canvasWidth, canvasHeight 画布的宽高
 */
const Rect = function(x, y, width, height, canvasWidth, canvasHeight, name) {
  this.x = x
  this.y = y
  this.name = name
  this.width = width
  this.height = height
  this.canvasWidth = canvasWidth
  this.canvasHeight = canvasHeight
}

Rect.prototype = {
  move: function(x, y) {
    this.x = x
    this.y = y
  },
  isPointInPath: function(rect, mouse) {
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

module.exports = Rect
