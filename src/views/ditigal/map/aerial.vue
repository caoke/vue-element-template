<template>
  <div class="app-container canvas">
    <div class="buttons">
      <el-button
        :type="operateModel ? 'success' : 'primary'"
        :plain="!operateModel"
        size="mini"
        @click="switchAddIcon()"
      >
        {{ operateModel ? '结束ICON编辑模式' : '开启ICON编辑模式' }}
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

      <img id="icon" src="../../../assets/icon.png" alt="">
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
        <el-table-column label="名称" prop="sn" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteIcon($event, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="600px" custom-class="custom-dialog">
      <el-form :model="dialogForm">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="dialogForm.sn" autocomplete="off" />
        </el-form-item>
        <el-form-item label="横坐标" label-width="120px">
          <el-input v-model="dialogForm.xpos" autocomplete="off" />
        </el-form-item>
        <el-form-item label="纵坐标" label-width="120px">
          <el-input v-model="dialogForm.ypos" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dialogForm.type">
            <el-option :value="0" :label="默认" />
            <el-option :value="1" :label="楼层出入口" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveIconInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Icon from '@/utils/icon.js'
import { saveBeacon, deleteBeacon, getBeacon } from '@/api/map'

export default {
  data() {
    return {
      mapId: '',
      c: null,
      ctx: null,
      operateModel: false, // 是否是可操作模式

      isAdd: false, // 新增模式
      isEdit: false, // 编辑模式
      isMove: false, // 移动模式

      isMoveIcon: false,
      isDeleteIcon: false,
      isMouseDown: false, // 鼠标是否点击下去

      icons: [],
      currIcon: '',
      currIconIndex: null,

      dialogFormVisible: false,
      dialogForm: {
        sn: '',
        id: '',
        type: 0
      },

      drawer: false,

      bgImgSrc: '../../../assets/map.jpeg'

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
    const { id, src } = this.$route.params
    this.mapId = id
    if (src) {
      this.bgImgSrc = src
    }
    this.getIcons()
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
     * @description 查询已经添加的所有icon
     */
    getIcons() {
      getBeacon(this.mapId).then(response => {
        this.icons = response.data
        this.drawIcon()
      })
    },
    /**
     * @description 切换icon编辑模式
     */
    switchAddIcon() {
      this.operateModel = !this.operateModel
      this.isDeleteIcon = false
      this.isMouseDown = false
    },
    /**
     * @description 切换删除模式
     */
    switchDeleteIcon() {
      this.isDeleteIcon = !this.isDeleteIcon
      this.operateModel = false
      this.isMouseDown = false
    },
    /**
     * @description 获取点击位置 判断点击的是否已经存在的元素
     */
    getIconPosition(event) {
      const mouse = {
        xpos: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        ypos: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }

      try {
        // 获取点击的地方是否已经存在icon
        this.icons.forEach((item, index) => {
          if ((mouse.xpos >= item.xpos - 14 && mouse.xpos <= item.xpos + 14) && (mouse.ypos >= item.ypos - 28 && mouse.ypos <= item.ypos)) {
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
      const position = this.getIconPosition(event)

      if (this.operateModel) {
        if (!this.currIcon.sn) {
          this.isAdd = true
          this.currIcon = new Icon(position.xpos, position.ypos, this.backgroundWidth, this.backgroundHeight)
          this.currIcon.type = 0
        } else {
          this.isEdit = true
        }
      }
    },

    /**
     * @description 移动鼠标事件
     */
    mouseMove(event) {
      if (this.operateModel && this.isMouseDown && this.currIcon) {
        this.moveIcon(event)
      }
    },
    /**
     * @description 移动图标
     */
    moveIcon(event) {
      // 移动的话 isEdit为false
      this.isMove = true
      this.isEdit = false

      const mouse = {
        xpos: event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - this.offsetLeft,
        ypos: event.clientY + document.documentElement.scrollTop + document.body.scrollTop - this.offsetTop
      }
      // 边界值
      const leftNode = {
        xpos: 0,
        ypos: 0
      }
      const rightNode = {
        xpos: this.backgroundWidth - 28,
        ypos: this.backgroundHeight - 28
      }

      if (mouse.xpos <= leftNode.xpos) mouse.xpos = leftNode.xpos
      if (mouse.xpos >= rightNode.xpos) mouse.xpos = rightNode.xpos
      if (mouse.ypos <= leftNode.ypos) mouse.ypos = leftNode.ypos
      if (mouse.ypos >= rightNode.ypos) mouse.ypos = rightNode.ypos

      this.currIcon.move(mouse.xpos, mouse.ypos)
    },

    /**
     * @description 点击释放事件
     *              是否移动icon isMoveIcon==false 有弹窗
     *                          isMoveIcon == true 没有弹窗
     */
    mouseUp() {
      if (this.isDeleteIcon) return

      if (this.isEdit || this.isAdd) {
        this.showDialog(this.currIcon)
      }

      if (this.isMove) {
        saveBeacon(this.currIcon).then(response => {
          this.$message.success('修改成功')
          this.drawIcon()
        })
      }
      this.resetInfo()
    },
    /**
     * @description 一次动作完成重置信息
     */
    resetInfo() {
      this.isMouseDown = false
      this.isAdd = false
      this.isEdit = false
      this.isMove = false
      this.currIcon = ''
    },
    /**
     * @description 显示每个icon信息
     * @param data {x,y,sn}
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
      const { xpos, ypos, type, sn } = this.currIcon

      const options = {
        map: this.mapId,
        xpos: xpos,
        ypos: ypos,
        type: type,
        sn: sn
      }
      saveBeacon(options).then(response => {
        this.icons.push(this.currIcon)
        this.dialogFormVisible = false
        this.drawIcon()
        this.resetInfo()
        this.$message.success('success')
      })
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
        const realX = item.xpos / item.width * this.backgroundWidth
        const realY = item.ypos / item.height * this.backgroundHeight
        this.ctx.drawImage(img, realX, realY, 28, 28)
        // 设置字体
        this.ctx.font = '14px'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = '#2755a5'
        this.ctx.fillText(item.sn, realX, realY)
      })
    },

    /**
     * @description 双击事件 删除元素
     */
    deleteIcon(e, index) {
      if (typeof index === 'number') {
        this.currIconIndex = index
      } else {
        if (!this.isDeleteIcon) return
        this.getIconPosition(e)
      }
      if (this.currIconIndex != null) {
        deleteBeacon(this.icons[this.currIconIndex].id).then(response => {
          this.icons.splice(this.currIconIndex, 1)
          this.currIcon = ''
          this.currIconIndex = null
          this.drawIcon()
        })
      }
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
