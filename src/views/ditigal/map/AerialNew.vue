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

      <div class="range-container">
        <input v-model="scaleValue" type="range" min="1" max="3.0" step="0.01" style="display: block;">
      </div>
    </div>
    <!-- <icon name="jizhan" /> -->
    <img id="icon" src="../../../assets/icon.png" style="display: none;" alt="">
    <div ref="canvasWrapper" class="canvas-wrapper">
      <canvas
        ref="myCanvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
        @mousedown="mapMouseDown"
        @mousemove="mapMousemove"
        @mouseup="mapMouseup"
      />
      <el-image id="map" :src="bgImgSrc" :style="{width: backgroundWidth, height: backgroundHeight}">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
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
            <el-button type="danger" size="mini" @click="deleteIcon(scope.$index)">删除</el-button>
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
import { saveBeacon, deleteBeacon, getBeacon, getMapById } from '@/api/ditigal/map'

export default {
  data() {
    return {
      mapId: '',
      c: null,
      ctx: null,

      operateModel: false, // 是否是可操作模式
      isAddIcon: false, // 新增
      isEditIcon: false, // 编辑模式
      isMoveIcon: false, // 移动
      isDeleteIcon: false, // 删除
      isMouseDown: false, // 鼠标是否点击下去

      icons: [],
      // 原始数据
      originIcons: [],

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

      windowWidth: '',
      backgroundHeight: '',

      mapOriginWidth: '',
      mapOriginHeight: '',
      mapOriginAspectRatio: '' // 原始地图长宽比 不会变
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
    backgroundWidth() {
      return this.sidebar.opened ? this.scaleValue * (this.windowWidth - 210 - 40) : this.scaleValue * (this.windowWidth - 54 - 40)
    },
    //  显示地图/地图原图 会变
    sizeRatio() {
      return this.mapOriginWidth ? this.backgroundWidth / this.mapOriginWidth : 1
    }

  },
  watch: {
    sizeRatio(nv) {
      this.$nextTick(() => {
        this.drawIcon()
      })
    },
    backgroundWidth: {
      handler(nv) {
        if (this.mapOriginAspectRatio) this.backgroundHeight = nv / this.mapOriginAspectRatio
      },
      immediate: true
    }
  },
  mounted() {
    // 获取地图id
    const { id } = this.$route.params
    this.mapId = id
    this.windowWidth = document.body.clientWidth
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth
    }
    this.getMapInfo()
    this.initCanvas()
    this.getBeacon()
  },

  methods: {
    initCanvas() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
    },

    /**
     * @description 根据地图id 获取地图信息
     */
    getMapInfo() {
      // TODO 去查询map
      getMapById(this.mapId).then(response => {
        // this.bgImgSrc = response.data.src
        const img = new Image()
        img.src = this.bgImgSrc
        img.onload = () => {
          console.log('onload')
          this.mapOriginWidth = img.width
          this.mapOriginHeight = img.height
          this.mapOriginAspectRatio = this.mapOriginWidth / this.mapOriginHeight
          this.backgroundHeight = this.backgroundWidth / this.mapOriginAspectRatio
        }
      })
    },
    /**
     * @description 查询所有信标
     */
    getBeacon() {
      console.log('getBeacon')
      getBeacon(this.mapId).then(response => {
        this.originIcons = response.data
        this.icons = this.responsePosition()
        this.drawIcon()
      })
    },

    /** ******* Map S*************/
    mapMouseDown(e) {
      this.isMouseDown = true
      const res = this.includeIcons(e)

      if (!res) {
        this.isAddIcon = true
        this.isEditIcon = false
        this.isMoveIcon = false
      } else {
        this.isAddIcon = false
        this.isEditIcon = true
        this.isMoveIcon = false
        const { seclectIcon, seclectIndex } = res
        this.currIcon = seclectIcon
        this.currIconIndex = seclectIndex
      }
    },
    mapMousemove(e) {
      this.isMoveIcon = this.isMouseDown && !!this.currIcon
      if (this.isMoveIcon) { // 移动后改变为相对位置数据
        this.currIcon.xpos = e.offsetX
        this.currIcon.ypos = e.offsetY
        this.isEditIcon = false
      }
    },
    mapMouseup(e) {
      this.isMouseDown = false

      if (this.isDeleteIcon && this.currIcon) { // 删除模式
        this.$confirm(`确定删除基站${this.currIcon.sn}`, '提示', {
          confirmButtontext: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteIcon()
        })
      } else if (this.isAddIcon) { // 新增
        this.showDialog({
          sn: '',
          xpos: e.offsetX,
          ypos: e.offsetY,
          type: ''
        })
      } else if (this.isEditIcon) { // 源数据 编辑
        const { sn, xpos, ypos, type, id } = this.currIcon
        this.showDialog({
          sn,
          type,
          xpos: xpos * this.sizeRatio,
          ypos: ypos * this.sizeRatio,
          id
        })
      } else if (this.isMoveIcon) { // 移动
        this.isMoveIcon = false
        this.saveIconInfo(this.currIcon)
      }
    },
    /**
     * @description 获取点击位置 判断点击的是否已经存在的元素
     */
    includeIcons(e) {
      const mouse = {
        xpos: e.offsetX,
        ypos: e.offsetY
      }

      let seclectIcon = null
      let seclectIndex = null

      this.originIcons.forEach((item, index) => {
        const realX = item.xpos * this.sizeRatio
        const realY = item.ypos * this.sizeRatio
        if ((mouse.xpos >= realX - 10 && mouse.xpos <= realX + 10) && (mouse.ypos >= realY - 20 && mouse.ypos <= realY)) {
          if (!seclectIcon) {
            seclectIcon = item // 获取的是源数据
            seclectIndex = index
          }
        }
      })
      if (seclectIcon) {
        return { seclectIcon, seclectIndex }
      } else {
        return false
      }
    },

    /** ******* Map E*************/
    /** ******* Icon S*************/
    iconMousedown(data, index) {
      this.isMouseDown = true
      this.currIcon = data
      this.currIconIndex = index
    },
    iconMouseup() {
      if (!this.isMoveIcon) this.showDialog(this.currIcon)
    },
    /** ******* Icon E*************/

    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     *
     */
    drawIcon() {
      const icons = this.responsePosition()
      this.ctx.clearRect(0, 0, this.backgroundWidth, this.backgroundHeight)
      const img = document.getElementById('icon')

      icons.forEach((item, index) => {
        const realX = item.xpos - 10
        const realY = item.ypos - 20
        this.ctx.drawImage(img, realX, realY, 20, 20)
        // 设置字体
        this.ctx.font = 'italic small-caps bold 12px arial'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = '#2755a5'
        this.ctx.fillText(item.sn, realX, realY)
      })
    },
    // 获取icon自适应位置
    responsePosition() {
      const newIcons = JSON.parse(JSON.stringify(this.originIcons))
      newIcons.forEach(item => {
        item.xpos = item.xpos * this.sizeRatio
        item.ypos = item.ypos * this.sizeRatio
      })
      return newIcons
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
      const { xpos, ypos, type, sn, id } = currIcon

      const options = {
        map: this.mapId,
        xpos: xpos / this.sizeRatio,
        ypos: ypos / this.sizeRatio,
        type,
        sn,
        id
      }

      saveBeacon(options).then(response => {
        if (!options.id) {
          currIcon.id = response.data
          options.id = response.data
          this.icons.push(currIcon)
          this.originIcons.push(options)
        } else {
          this.icons[this.currIconIndex] = currIcon
          this.originIcons[this.currIconIndex] = options
          this.$forceUpdate()
        }
        this.dialogFormVisible = false
        this.drawIcon()
        this.resetCurrentIcon()
      })
    },
    /**
     * @description 双击事件 删除元素
     */
    deleteIcon(index) {
      if (typeof index === 'number') {
        this.currIconIndex = index
      }

      if (this.currIconIndex != null) {
        const icon = this.icons[this.currIconIndex]
        deleteBeacon({ beaconId: icon.id, type: 0, id: this.mapId }).then(response => {
          this.icons.splice(this.currIconIndex, 1)
          this.originIcons.splice(this.currIconIndex, 1)
          this.drawIcon()
          this.resetCurrentIcon()
        })
      }
    },
    resetCurrentIcon() {
      this.currIcon = null
      this.currIconIndex = ''
    },
    resetInfo() {
      this.isMouseDown = false
      this.isAddIcon = false
      this.isEditIcon = false
      this.isMoveIcon = false
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
        height: 24px;
        line-height: 24px;
        display: flex;
      }
    }
  }

</style>
