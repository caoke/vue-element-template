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
import { saveBeacon, deleteBeacon, getBeacon } from '@/api/map'

export default {
  data() {
    return {
      mapId: '',
      c: null,
      ctx: null,
      iconImg: '',

      operateModel: false, // 是否是可操作模式
      isAddIcon: false, // 新增
      isEditIcon: false, // 编辑模式
      isMoveIcon: false, // 移动
      isDeleteIcon: false, // 删除
      isMouseDown: false, // 鼠标是否点击下去

      icons: [
        { sn: 1, xpos: 500, ypos: 300 },
        { sn: 2, xpos: 200, ypos: 400 },
        { sn: 3, xpos: 500, ypos: 500 }
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

      windowWidth: '',

      mapWidth: '',
      mapHeight: '',
      sizeRatio: '',
      aspectRatio:'' // 地图长宽比
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'needTabsView']),
     backgroundWidth() {
      return this.sidebar.opened ? this.scaleValue * (this.windowWidth - 210 - 40) : this.scaleValue * (this.windowWidth - 54 - 40)
    },
    backgroundHeight() {
      return this.backgroundWidth/this.aspectRatio
    }
    //  显示地图/地图原图
 
  },
  watch: {
    sizeRatio() {
      // this.responsePosition()
    },
    windowWidth(nv) {
      
    }
  },
  mounted() {
    
    
    // 获取地图id
    const { id } = this.$route.params
    this.mapId = id
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth
    }

    this.init()
    
    
  },

  methods: {
    init() {
      this.windowWidth = document.documentElement.clientWidth
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
      this.getMapInfo()
    },
  
    /**
     * @description 根据地图id 获取地图信息
     */
    getMapInfo() {
      // TODO 去查询map
      const img = new Image()
      img.onload = () => {
        this.mapWidth = img.width
        this.mapHeight = img.height
        this.aspectRatio = this.mapWidth/this.mapHeight
        this.sizeRatio = this.backgroundWidth / this.mapWidth
        this.drawIcon()
      }
      img.src = this.bgImgSrc
      
    },

    /** ******* Map S*************/
    mapMouseDown(e) {
      this.isMouseDown = true
      this.isAddIcon = true
      this.showDialog({
        sn: '',
        xpos: e.offsetX,
        ypos: e.offsetY,
        type: ''
      })
    },
    mapMousemove(e) {
      this.isMoveIcon = this.isMouseDown && !!this.currIcon
      if (this.isMoveIcon) {
        this.currIcon.xpos = e.offsetX
        this.currIcon.ypos = e.offsetY
      }
    },
    mapMouseup(e) {
      this.isMouseDown = false
      if (this.isMoveIcon) {
        this.isMoveIcon = false
        this.saveIconInfo(this.currIcon)
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
     * @description 查询已经添加的所有icon
     */
    getIcons() {
      this.icons = []
      getBeacon(this.mapId).then(response => {
        this.icons = response.data
      })
    },
    responsePosition() {
      const newIcons = JSON.parse(JSON.stringify(this.icons))
      newIcons.forEach(item => {
        item.xpos = (item.xpos - 10) * this.sizeRatio
        item.ypos = (item.ypos - 20) * this.sizeRatio
      })
      return newIcons
    },
    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     *
     */
    drawIcon(data) {
      const icons = this.responsePosition()
      const img = document.getElementById('icon')

      icons.forEach((item, index) => {
        this.ctx.drawImage(img, item.xpos, item.ypos, 20, 20)
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
        xpos: xpos / this.sizeRatio,
        ypos: ypos / this.hightScale,
        type: type,
        sn: sn,
        id: currIcon.id || ''
      }
      if (data) {
        this.icons[this.currIconIndex] = currIcon
        this.$forceUpdate()
      } else {
        this.icons.push(options)
      }
      // this.$set(this.icons, this.icons.length, options)
      // this.resetInfo()
      this.dialogFormVisible = false
      // this.responsePosition()
      // this.$forceUpdate()
      // saveBeacon(options).then(response => {
      //   if (!currIcon.id) {
      //     currIcon.id = response.data
      //     this.icons.push(currIcon)
      //   }
      //   this.dialogFormVisible = false
      //   this.resetInfo()
      //   this.$message.success('success')
      //   // 重绘
      //   this.baseElement()
      // })
    },
    resetInfo() {
      this.currIcon = null
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
      }
    }
    .canvas-wrapper{
      overflow: auto;
      cursor: pointer;
      border: 1px solid #000000;
      position: relative;
      canvas{
        position: absolute;
      }
    }
  }

</style>
