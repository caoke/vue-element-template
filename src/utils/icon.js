/**
 * @description Icon 构造函数
 * @param x,y 相对画布的位置坐标
 *        width,heigt 画布的宽高
 *        name：icon的信息
 */
const Icon = function(x, y, width, height, name) {
  this.x = x
  this.y = y
  this.name = name
  this.width = width
  this.height = height
}

Icon.prototype = {
  move: function(x, y) {
    this.x = x
    this.y = y
  }
}
export default Icon
