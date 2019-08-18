<template>
  <div class="app-container canvas">
    <div class="buttons">
      <el-button
        :type="isAddIcon ? 'success' : 'primary'"
        :plain="!isAddIcon"
        size="mini"
        @click="switchAddIcon()"
      >
        {{ isAddIcon ? '结束ICON编辑模式' : '开启ICON编辑模式' }}
      </el-button>

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

      <img id="icon" src="../../../assets/jizhan.png" alt="">
    </div>
    <canvas
      ref="myCanvas"
      :width="backgroundWidth"
      :height="backgroundHeight"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @dblclick="deleteIcon"
    />

    <img id="map" src="../../../assets/map.jpeg" width="1000" height="600">

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
      isMouseDown: false, // 鼠标是否点击下去

      icons: [],
      currIcon: '',
      currIconIndex: null,

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
      return this.sidebar.opened ? this.c.offsetLeft + 210 + 14 : this.c.offsetLeft + 54 + 14
    },
    offsetTop() {
      return this.needTabsView ? this.c.offsetTop + 95 + 28 : this.c.offsetTop + 50 + 28
    },
    backgroundWidth() {
      return this.sidebar.opened ? document.documentElement.clientWidth - 210 - 40 : document.documentElement.clientWidth - 54 - 40
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
    /**
     * @description 画背景图
     */
    drawBackground() {
      const map = document.getElementById('map')
      this.ctx.drawImage(map, 0, 0, this.backgroundWidth, this.backgroundHeight)
    },
    /**
     * @description 切换icon编辑模式
     */
    switchAddIcon() {
      this.isAddIcon = !this.isAddIcon
      this.isDeleteIcon = false
      this.isMouseDown = false
    },
    /**
     * @description 切换删除模式
     */
    switchDeleteIcon() {
      this.isDeleteIcon = !this.isDeleteIcon
      this.isAddIcon = false
      this.isMouseDown = false
    },
    /**
     * @description 获取点击位置 判断点击的是否已经存在的元素
     */
    getIconPosition(event, eventType) {
      const mouse = {
        x: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        y: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }

      try {
        // 获取点击的地方是否已经存在icon
        this.icons.forEach((item, index) => {
          if ((mouse.x >= item.x - 14 && mouse.x <= item.x + 14) && (mouse.y >= item.y - 28 && mouse.y <= item.y)) {
            this.currIcon = item
            this.currIconIndex = index
            throw new Error(this.currIconIndex)
          }
        })
      } catch (e) {
        console.log(e)
      }
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
    },
    /**
     * @description mousedown事件
     */
    addOrMoveIcon(event) {
      const position = this.getIconPosition(event, 'add')
      if (!this.currIcon.name) { // 新增
        this.currIcon = new Icon(position.x, position.y, this.backgroundWidth, this.backgroundHeight)
      }
    },

    /**
     * @description 移动鼠标事件
     */
    mouseMove(event) {
      if (this.isAddIcon && this.isMouseDown) {
        this.moveIcon(event)
      }
    },
    /**
     * @description 移动图标
     */
    moveIcon(event) {
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
     * @description 点击释放事件
     *              是否移动icon isMoveIcon==false 有弹窗
     *                          isMoveIcon == true 没有弹窗
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
      // this.isMouseDown = false
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
        // 设置字体
        this.ctx.font = '14px'
        this.ctx.textAlign = 'left'
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
        if(!this.isDeleteIcon) return 
        this.getIconPosition(e, 'delete')
      }
      if (this.currIconIndex != null) {
        this.icons.splice(this.currIconIndex, 1)
        this.currIcon = ''
        this.currIconIndex = null
      }
      this.drawIcon()
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
