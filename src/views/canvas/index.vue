<template>
  <div class="app-container">
    <div>
      <el-button type="primary" plain size="mini" @click="add()">开启新增模式</el-button>
      <img id="icon" src="../../assets/jizhan.png" alt="">
      <el-button type="primary" plain size="mini" @click="stopAdd">结束新增模式</el-button>

    </div>
    <canvas
      ref="myCanvas"
      width="600"
      height="600"
      class="canvas"
      @mousedown="addOrMoveIcon"
      @mousemove="moveIcon"
      @mouseup="mouseUp"
    />

    <el-dialog title="新增" :visible.sync="dialogFormVisible">
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

const Icon = function(x, y, name) {
  this.x = x
  this.y = y
  this.name = name
}

Icon.prototype = {
  move: function(x, y) {
    this.x = x
    this.y = y
  }
}

export default {
  data() {
    return {
      c: null,
      ctx: null,
      isAdd: false,
      isMove: false,
      icons: [],
      currIcon: '',

      mouseDown: false, // 鼠标是否点击下去

      dialogFormVisible: false,
      dialogForm: {
        name: '',
        id: ''
      }

    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
    offsetLeft() {
      return this.sidebar.opened ? this.c.offsetLeft + 210 + 14 : this.c.offsetLeft + 54 + 14
    },
    offsetTop() {
      return this.needTabsView ? this.c.offsetTop + 95 + 28 : this.c.offsetTop + 50 + 14
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
    },
    add() {
      this.isAdd = true
    },
    stopAdd() {
      this.isAdd = false
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
      this.icons.forEach((item) => {
        if ((mouse.x >= item.x - 14 && mouse.x <= item.x + 14) && (mouse.y >= item.y - 28 && mouse.y <= item.y)) {
          this.isMove = true
          this.currIcon = item
        }
      })
      return mouse
    },
    /**
     * @description mousedown事件
     */
    addOrMoveIcon(event) {
      if (!this.isAdd) return
      this.mouseDown = true
      const position = this.getIconPosition(event)
      if (!this.isMove) { // 新增
        this.currIcon = new Icon(position.x, position.y)
      }
    },
    /**
     * @description 在mousedown的条件下移动鼠标
     */
    moveIcon(event) {
      if (!this.mouseDown || !this.icons.length) return
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
      const img = document.getElementById('icon')
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
        x: 600 - 28,
        y: 600 - 28
      }

      if (mouse.x <= leftNode.x) mouse.x = leftNode.x
      if (mouse.x >= rightNode.x) mouse.x = rightNode.x
      if (mouse.y <= leftNode.y) mouse.y = leftNode.y
      if (mouse.y >= rightNode.y) mouse.y = rightNode.y

      this.currIcon.move(mouse.x, mouse.y)
      this.drawIcon(img)
    },
    /**
     * @description 点击释放 isMove==false 有弹窗
     *              拖拽是否 isMove == true 没有弹窗
     */
    mouseUp() {
      if (!this.isMove && (this.currIcon.name || this.isAdd)) {
        this.showDialog(this.currIcon)
      }
      this.resetInfo()
    },
    /**
     * @description 一次动作完成重置信息
     */
    resetInfo() {
      this.isMove = false
      this.isAdd = true
      this.mouseDown = false
    },
    /**
     * @description 显示每个icon信息
     * @param data {x,y,name}
     */
    showDialog(data) {
      const { name, x, y } = data
      this.dialogForm = {
        name: name,
        x: x,
        y: y
      }
      this.dialogFormVisible = true
    },
    /**
     * @description 保存弹层信息
     */
    saveIconInfo() {
      this.mouseDown = false
      const img = document.getElementById('icon')
      const { name, x, y } = this.dialogForm
      this.currIcon = new Icon(x, y, name)
      this.icons.push(this.currIcon)
      this.dialogFormVisible = false
      this.drawIcon(img)
    },
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     */
    drawIcon(img) {
      this.icons.forEach((item) => {
        this.ctx.drawImage(img, item.x, item.y, 28, 28)
      })
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
    cursor: pointer;
    border: 1px solid #000000;
  }
</style>
