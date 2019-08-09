<template>
  <div class="app-container canvas">
    <div class="buttons">
      <el-button :type="isAddIcon ? 'success' : 'primary'" :plain="!isAddIcon" size="mini" @click="switchAddIcon()"> {{ isAddIcon ? '结束ICON编辑模式' : '开启ICON编辑模式' }}</el-button>

      <el-button :type="isAddArea ? 'success' : 'primary'" :plain="!isAddArea" size="mini" @click="switchAddArea()">  {{ isAddArea ? '结束编辑区域模式' : '开启编辑区域模式' }}</el-button>

      <el-button
        :type="isDeleteIcon ? 'danger' : 'primary'"
        :plain="!isDeleteIcon"
        size="mini"
        @click="switchDeleteIcon()"
      >
        {{ isDeleteIcon ? '结束删除ICON模式' : '开启删除ICON模式' }}
      </el-button>

      <el-tooltip class="item" effect="dark" content="开启删除模式后，鼠标双击删除元素" placement="right">
        <i class="el-icon-question" style="margin-left: 0px; margin-right: 10px;" />
      </el-tooltip>

      <el-button type="primary" plain size="mini" @click="drawer = true">显示icon列表</el-button>

      <img id="icon" src="../../assets/jizhan.png" alt="">
    </div>
    <canvas
      ref="myCanvas"
      :width="backgroundWidth"
      :height="backgroundHeight"
      @mousedown="mouseDown"
      @mousemove="moveIcon"
      @mouseup="mouseUp"
      @dblclick="deleteIcon"
    />

    <img id="map" src="../../assets/map.jpeg" width="1000" height="600">

    <el-drawer
      title="icon列表"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-table :data="icons">
        <el-table-column type="index" />
        <el-table-column label="name" prop="name" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteIcon($event, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="600px" custom-class="dialog-class">
      <el-form :model="dialogForm">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="dialogForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="横坐标" label-width="120px">
          <el-input v-model="dialogForm.x" autocomplete="off" />
        </el-form-item>
        <el-form-item label="纵坐标" label-width="120px">
          <el-input v-model="dialogForm.y" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveIconInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '@/utils/icon.js'

export default {
  data() {
    return {
      c: null,
      ctx: null,
      isAddIcon: false,
      isMoveIcon: false,
      isDeleteIcon: false,

      isAddArea: false,
      icons: [],
      currIcon: '',
      currIconIndex: null,

      areas: [],
      currAreaPoints: [], // 当前区域
      currAreaPoint: null, // 区域点
      isMovePoint: false, // 是否在移动区域点

      isMouseDown: false, // 鼠标是否点击下去

      dialogFormVisible: false,
      dialogForm: {
        name: '',
        id: ''
      },

      drawer: false

    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
    offsetLeft() {
      if (this.isAddIcon) {
        return this.sidebar.opened ? this.c.offsetLeft + 210 + 14 : this.c.offsetLeft + 54 + 14
      }
      return this.sidebar.opened ? this.c.offsetLeft + 210 : this.c.offsetLeft + 54
    },
    offsetTop() {
      if (this.isAddIcon) {
        return this.needTabsView ? this.c.offsetTop + 95 + 28 : this.c.offsetTop + 50 + 14
      }
      return this.needTabsView ? this.c.offsetTop + 95 : this.c.offsetTop + 50
    },
    backgroundWidth() {
      // return 1440 - 54 - 40
      return this.sidebar.opened ? document.documentElement.clientWidth - 210 - 60 : document.documentElement.clientWidth - 54 - 60
    },
    backgroundHeight() {
      return this.backgroundWidth * 4041 / 7184 // 图片长宽比
    }
  },
  watch: {
    'backgroundHeight'() {
      this.$nextTick(() => {
        this.drawIcon()
      })
    }
  },
  mounted() {
    this.init()
  },
  created() {

  },

  methods: {
    init() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
      this.drawBackground()
    },
    drawBackground() {
      // const map = document.getElementById('map')
      // this.ctx.drawImage(map, 0, 0, this.backgroundWidth, this.backgroundHeight)
    },
    /**
     * @description 切换icon编辑模式
     */
    switchAddIcon() {
      this.isAddIcon = !this.isAddIcon
      this.isDeleteIcon = false
      this.isAddArea = false
    },
    /**
     * @description 切换删除模式
     */
    switchDeleteIcon() {
      this.isDeleteIcon = !this.isDeleteIcon
      this.isAddIcon = false
      this.isAddArea = false
    },
    /**
     * @description 获取点击位置 判断点击的是否已经存在的元素
     */
    getIconPosition(event) {
      var mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      // 判断新增还是修改
      this.icons.forEach((item, index) => {
        if ((mouse.x >= item.x - 14 && mouse.x <= item.x + 14) && (mouse.y >= item.y - 28 && mouse.y <= item.y)) {
          this.currIcon = item
          this.currIconIndex = index
        }
      })
      return mouse
    },
    /**
     * @description mouseDown事件
     */
    mouseDown(event) {
      this.isMouseDown = true
      if (this.isAddIcon) {
        this.addOrMoveIcon(event)
      }
      if (this.isAddArea) {
        this.addOrMoveAreaPoint(event)
      }
    },
    /**
     * @description mousedown事件
     */
    addOrMoveIcon(event) {
      if (!this.isAddIcon) return
      const position = this.getIconPosition(event)
      if (!this.currIcon.name) { // 新增
        this.currIcon = new Icon(position.x, position.y, this.backgroundWidth, this.backgroundHeight)
      }
    },

    /**
     * @description 移动鼠标事件
     */
    mousemove(event) {
      if (this.isAddIcon) {
        this.moveIcon(event)
      }
      if (this.isAddArea) {
        this.movePoint(event)
      }
    },
    /**
     * @description 移动图标
     */
    moveIcon(event) {
      if (!this.isMouseDown || !this.icons.length) return
      this.isMoveIcon = true
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      // 边界值
      const leftNode = {
        x: 0,
        y: 0
      }
      const rightNode = {
        x: this.backgroundWidth - 28,
        y: this.backgroundHeight - 28
      }

      if (mouse.x <= leftNode.x) mouse.x = leftNode.x
      if (mouse.x >= rightNode.x) mouse.x = rightNode.x
      if (mouse.y <= leftNode.y) mouse.y = leftNode.y
      if (mouse.y >= rightNode.y) mouse.y = rightNode.y

      this.currIcon.move(mouse.x, mouse.y)
      this.drawIcon()
    },
    /**
     * @description 移动区域点
     */
    movePoint(event) {
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      this.currAreaPoint.move(mouse.x, mouse.y)
    },
    /**
     * @description 点击释放 isMoveIcon==false 有弹窗
     *              拖拽是否 isMoveIcon == true 没有弹窗
     */
    mouseUp() {
      if (this.isDeleteIcon) return

      if (!this.isMoveIcon && (this.currIcon.name || this.isAddIcon)) {
        this.showDialog(this.currIcon)
      }

      this.resetInfo()
    },
    /**
     * @description 一次动作完成重置信息
     */
    resetInfo() {
      this.isMoveIcon = false
      // this.isAddIcon = false
      this.isMouseDown = false
      this.currIcon = ''
    },
    /**
     * @description 显示每个icon信息
     * @param data {x,y,name}
     */
    showDialog(data) {
      this.dialogForm = data
      this.dialogFormVisible = true
    },
    /**
     * @description 保存弹层信息
     */
    saveIconInfo() {
      this.isMouseDown = false

      this.currIcon = this.dialogForm
      this.icons.push(this.currIcon)
      this.dialogFormVisible = false
      this.drawIcon()
      this.resetInfo()
    },
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     */
    drawIcon() {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
      this.drawBackground()
      const img = document.getElementById('icon')
      this.icons.forEach((item, index) => {
        const realX = item.x / item.width * this.backgroundWidth
        const realY = item.y / item.height * this.backgroundHeight
        this.ctx.drawImage(img, realX, realY, 28, 28)
        this.ctx.font = '14px'
        // 字体颜色
        this.ctx.fillStyle = '#2755a5'
        this.ctx.fillText(item.name, realX, realY)
      })
    },

    /**
     * @description 双击事件 删除元素
     */
    deleteIcon(e, index) {
      if (typeof index === 'number') {
        this.currIconIndex = index
      } else {
        this.getIconPosition(e)
      }
      if (this.currIconIndex != null) {
        this.icons.splice(this.currIconIndex, 1)
        this.currIcon = ''
        this.currIconIndex = null
      }
      this.drawIcon()
    },

    /**
     * @description 切换区域编辑模式
     */
    switchAddArea() {
      this.isAddArea = !this.isAddArea
      this.isAddIcon = false
      this.isDeleteIcon = false
      if (!this.isAddArea) {
        this.drawArea()
      }
    },

    /**
     *@description 添加区域点
     */
    addOrMoveAreaPoint(event) {
      const position = this.getPointPosition()

      if (!this.isMovePoint) { // 新增
        const areaPoint = new Icon(position.x, position.y)
        this.ctx.beginPath()
        this.ctx.arc(position.x, position.y, 4, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.currAreaPoints.push(areaPoint)
      }
    },

    /**
     * @description 画区域
     */
    drawArea() {
      this.ctx.beginPath()
      this.ctx.moveTo(this.currAreaPoints[0].x, this.currAreaPoints[0].y)
      this.currAreaPoints.forEach((item, index) => {
        if (index === 0) {
          this.ctx.moveTo(this.currAreaPoints[0].x, this.currAreaPoints[0].y)
        } else {
          this.ctx.lineTo(this.currAreaPoints[index].x, this.currAreaPoints[index].y)
        }
      })
      this.ctx.closePath()
      this.ctx.stroke()

      this.areas.push(this.currAreaPoints)
      // 清空
      this.currAreaPoints = []
    },
    /**
     * @description 获取point位置
     */
    getPointPosition() {
      const position = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      this.areas.forEach(item => {
        item.forEach(point => {
          const distance = Math.sqrt(Math.pow(point.x - position.x, 2) + Math.pow(point.y - position.y, 2)) / 2
          if (distance <= 4) {
            this.currAreaPoint = point
            this.isMovePoint = true
          }
        })
      })
      return position
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  .canvas{

    .buttons{
      margin-bottom: 10px;
    }
    #icon{
      width: 28px;
      display: none;
    }
    #map{
      display: none;
    }
    canvas{
      cursor: pointer;
      border: 1px solid #000000;
    }
  }

</style>
