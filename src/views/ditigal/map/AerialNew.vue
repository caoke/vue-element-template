<template>
  <div class="app-container canvas">
    <div class="buttons">
      <!-- <icon name="jizhan" /> -->
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

      <div class="range-container">
        <input v-model="scaleValue" type="range" min="1" max="3.0" step="0.01" style="display: block;">
      </div>
    </div>

    <div ref="canvasWrapper" class="canvas-wrapper" @mousedown.prevent="mouseDown">
      <div class="icon-wrapper">
        <div
          v-for="icon in icons"
          :key="icon.name"
          class="icon-item"
          :style="{left: icon.xpos + 'px', top: icon.ypos + 'px'}"
          @mousedown.stop="getCurrentIcon(icon)"
        >
          <span>{{ icon.name }}</span>
          <img
            src="../../../assets/icon.png"
            :alt="icon.name"
          >
        </div>

      </div>
      <img id="map" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight">
    </div>

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

    <el-dialog :title="dialogForm.id ? '修改' : '新增'" :visible.sync="dialogFormVisible" width="600px" custom-class="custom-dialog">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="dialogForm.sn" autocomplete="off" />
        </el-form-item>
        <el-form-item label="横坐标">
          <el-input v-model="dialogForm.xpos" autocomplete="off" />
        </el-form-item>
        <el-form-item label="纵坐标">
          <el-input v-model="dialogForm.ypos" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dialogForm.type">
            <el-option :value="0" label="默认" />
            <el-option :value="1" label="楼层出入口" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveIconInfo()">确 定</el-button>
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

      icons: [
        { name: 1, xpos: 20, ypos: 30 },
        { name: 2, xpos: 20, ypos: 200 },
        { name: 3, xpos: 500, ypos: 31 }
      ],
      currIcon: '',
      currIconIndex: null,

      dialogFormVisible: false,
      dialogForm: {
        sn: '',
        id: '',
        type: 0
      },

      drawer: false,

      bgImgSrc: require('../../../assets/map.jpeg'),

      scaleValue: 1,

      mapWidth: '',
      mapHeight: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
    offsetLeft() {
      return this.sidebar.opened ? this.c.offsetLeft + 210 : this.c.offsetLeft + 54
    },
    offsetTop() {
      return this.needTabsView ? this.c.offsetTop + 95 : this.c.offsetTop + 50
    },
    backgroundWidth() {
      return this.sidebar.opened ? this.scaleValue * (document.documentElement.clientWidth - 210 - 40) : this.scaleValue * (document.documentElement.clientWidth - 54 - 40)
    },
    backgroundHeight() {
      return this.backgroundWidth * this.mapHeight / this.mapWidth // 图片长宽比
    },
    widthScale() {
      return this.backgroundWidth / this.mapWidth
    },
    hightScale() {
      return this.backgroundHeight / this.mapHeight
    }
  },
  watch: {
    'backgroundHeight'() {
      this.$nextTick(() => {
        // this.resizeCanvas()
      })
    },
    scaleValue(nv) {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
      this.ctx.save()
      this.ctx.translate(0, 0)
      this.ctx.scale(nv, nv)
      this.resizeCanvas()
      this.ctx.restore()
    }
  },
  mounted() {
    const { id } = this.$route.params
    this.mapId = id
    // 获取地图id
    this.getMapInfo()
  },
  created() {

  },

  methods: {
    /**
     * @description 根据地图id 获取地图信息
     */
    getMapInfo() {
      // TODO 去查询map
      const img = new Image()
      img.onload = () => {
        this.mapWidth = img.width
        this.mapHeight = img.height
      }
      img.src = this.bgImgSrc
    },

    getCurrentIcon(data) {

    },
    /**
     * @description
     */
    baseElement() {
      // this.ctx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      // this.drawBackground()
      // this.getIcons()
    },
    /**
     * @description resize
     */
    resizeCanvas() {
      this.drawBackground()
      this.drawIcon()
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
      this.icons = []
      getBeacon(this.mapId).then(response => {
        response.data.forEach(item => {
          item.xpos = item.xpos * this.widthScale
          item.ypos = item.ypos * this.hightScale
        })
        return response.data
      }).then(icons => {
        this.icons = icons
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
        xpos: (event.clientX - this.offsetLeft + this.$refs.canvasWrapper.scrollLeft) / this.scaleValue,
        ypos: (event.clientY - this.offsetTop + document.getElementById('app').scrollTop) / this.scaleValue
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
      event.preventDefault()
      console.log(event.offsetX, event.offsetY)
      // this.isMouseDown = true
      // const position = this.getIconPosition(event)

      // if (this.operateModel) {
      //   if (!this.currIcon) {
      //     this.isAdd = true
      //     this.currIcon = new Icon(position.xpos, position.ypos)
      //     this.currIcon.type = 0
      //   } else {
      //     this.isEdit = true
      //   }
      // }
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
        xpos: (event.clientX - this.offsetLeft + this.$refs.canvasWrapper.scrollLeft) / this.scaleValue,
        ypos: (event.clientY - this.offsetTop + document.getElementById('app').scrollTop) / this.scaleValue
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

      this.currIcon.xpos = mouse.xpos
      this.currIcon.ypos = mouse.ypos
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
        this.saveIconInfo(this.currIcon)
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
      this.currIcon = null
      this.currIconIndex = null
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
     * @param data 修改已存在的icon
     */
    saveIconInfo(data) {
      const currIcon = data || this.dialogForm
      const { xpos, ypos, type, sn } = currIcon

      const options = {
        map: this.mapId,
        xpos: xpos / this.widthScale,
        ypos: ypos / this.hightScale,
        type: type,
        sn: sn,
        id: currIcon.id || ''
      }
      saveBeacon(options).then(response => {
        if (!currIcon.id) {
          currIcon.id = response.data
          this.icons.push(currIcon)
        }
        this.dialogFormVisible = false
        this.resetInfo()
        this.$message.success('success')
        // 重绘
        this.baseElement()
      })
    },
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     *
     */
    drawIcon(data) {
      const img = document.getElementById('icon')

      this.icons.forEach((item, index) => {
        this.ctx.drawImage(img, (item.xpos - 14) * this.scaleValue, (item.ypos - 28) * this.scaleValue, 28, 28)
        // 设置字体
        this.ctx.font = '14px'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = '#2755a5'
        this.ctx.fillText(item.sn, (item.xpos - 10) * this.scaleValue, (item.ypos - 28) * this.scaleValue)
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
        const icon = this.icons[this.currIconIndex]
        deleteBeacon(icon.id).then(response => {
          this.icons.splice(this.currIconIndex, 1)
          this.currIcon = ''
          this.currIconIndex = null
          this.baseElement()
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
      .range-container{
        float: right;
      }
    }
    #icon{
      width: 28px;
      z-index: 200;
    }
    #map{
      // display: none;
    }
    .canvas-wrapper{
      overflow: auto;
      cursor: pointer;
      border: 1px solid #000000;
      position: relative;
      .icon-wrapper{
        position: absolute;
        .icon-item{
          position: absolute;
          span{
            font-size:12px;
          }
        }
        img{
          width:24px;
          height:24px;
        }
      }
    }
  }

</style>
