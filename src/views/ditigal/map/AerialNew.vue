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

    <div ref="canvasWrapper" class="canvas-wrapper" @mousedown.prevent="mapMouseDown" @mousemove="mapMousemove" @mouseup="mapMouseup">
      <div class="icon-wrapper">
        <div
          v-for="(icon,index) in showIcons"
          :key="icon.sn"
          class="icon-item"
          :style="{left: (icon.xpos)*scaleValue + 'px', top: (icon.ypos)*scaleValue + 'px'}"
          @mousedown.stop="iconMousedown(icon,index)"
          @mouseup.stop="iconMouseup"
        >
          <icon name="jizhan" :scale="scaleValue" />
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
import { saveBeacon, deleteBeacon, getBeacon } from '@/api/map'

export default {
  data() {
    return {
      mapId: '',

      operateModel: false, // 是否是可操作模式
      isAddIcon: false, // 新增
      isEditIcon: false, // 编辑模式
      isMoveIcon: false, // 移动
      isDeleteIcon: false, // 删除
      isMouseDown: false, // 鼠标是否点击下去

      icons: [
        { sn: 1, xpos: 500, ypos: 300 },
        { sn: 2, xpos: 20, ypos: 200 },
        { sn: 3, xpos: 500, ypos: 31 }
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
    },
    showIcons() {
      return this.responsePosition()
    }
  },
  watch: {
    widthScale() {
      // this.responsePosition()
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
        console.log(this.currIcon, e.offsetX)
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
        item.xpos = (item.xpos - 10) * this.widthScale
        item.ypos = (item.ypos - 20) * this.hightScale
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
      const { xpos, ypos, type, sn } = currIcon

      const options = {
        map: this.mapId,
        xpos: xpos / this.widthScale,
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
      this.resetInfo()
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
        svg{
          width:20px;
          height:20px;
        }
      }
    }
  }

</style>
