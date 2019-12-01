<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="app-container real-time"
  >
    <img id="icon" src="../../assets/icon.png" style="display: none;">
    <img id="nurse" src="../../assets/nurse.png" style="display: none;">
    <img id="doctor" src="../../assets/doctor.png" style="display: none;">
    <img id="patient" src="../../assets/patient.png" style="display: none;">

    <div class="operate-wrap">
      <el-form :inline="true">
        <el-form-item label="选择地图">
          <el-select v-model="buildingInfo.bid" placeholder="请选择楼栋" @change="setBuildFloors">
            <el-option
              v-for="building in buildings"
              :key="building.id"
              :value="building.id"
              :label="building.name"
            />
          </el-select>
          <el-select v-model="buildingInfo.floor" placeholder="请选择楼层">
            <el-option v-for="n in floors" :key="n" :value="n" :label="`${n}层`" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getMapByBuilding">查询</el-button>
      </el-form>
      <div class="range-container">
        <input v-model="scaleValue" type="range" min="1" max="3.0" step="0.01" style="display: block;">
      </div>
    </div>

    <div class="warning-wrapper" style="display: none;">
      <el-card v-for="item in warningInfo" :key="item.name" class="box-card">
        <div slot="header" class="clearfix">
          <span style="color:red;">告警信息</span>
          <el-button style="float: right; padding: 3px 0" class="el-icon-close" @click="delWarning(item)" />
        </div>
        <div class="item">
          <label>姓名：</label>
          <span>{{ item.name }}</span>
        </div>
        <div class="item">
          <label>所在位置：</label>
          <span>{{ item.position }}</span>
        </div>
        <div class="item">
          <label>告警时间：</label>
          <span>{{ item.time }}</span>
        </div>

      </el-card>
    </div>
    <div v-loading="isLoading" class="canvas-wrapper">
      <canvas
        ref="myCanvas"
        class="icon-canvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
      />
      <canvas
        ref="myAreaCanvas"
        :width="backgroundWidth"
        :height="backgroundHeight"
      />
      <img id="map" class="bg-image" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight">
    </div>
  </div>
</template>

<script>
import mapMixins from '@/mixins/map'
import { getPathPlanningList } from '@/api/ditigal/path'

export default {
  name: 'MonitorRealTime',
  mixins: [mapMixins],
  data() {
    return {
      c: null,
      ctx: null,
      newIcons: [
        { imgId: 'nurse', beaconId: '2', sn: '王护士' },
        { imgId: 'nurse', beaconId: '3', sn: '张护士' },
        { imgId: 'doctor', beaconId: '5', sn: '李医生' },
        { imgId: 'patient', beaconId: '5', sn: '患者1' }
      ],

      warningWidth: 200,
      warningInfo: [
        {
          name: '张三',
          doctor: '王医生',
          nurse: '李护士',
          message: '去到禁区',
          position: '八层10病区',
          time: '2019-09-20 14:20:00'
        },
        {
          name: 'lisi',
          doctor: '王医生',
          nurse: '李护士',
          message: '去到禁区',
          position: '八层10病区',
          time: '2019-09-20 14:20:00'
        }
      ],

      mapInfo: null,
      mapPaths: [], // 当前地图所有路径

      pathObject: {},

      loading: false,
      socket: null,
      path: 'ws://120.24.54.8/LocationServer/websocket/12',

      oldIcons: [
        { imgId: 'nurse', beaconId: '1', sn: '王护士' },
        { imgId: 'nurse', beaconId: '3', sn: '张护士' },
        { imgId: 'doctor', beaconId: '3', sn: '李医生' },
        { imgId: 'patient', beaconId: '4', sn: '患者1' }
      ],
      computedIcons: [], // 合成图标
      timer: null

    }
  },
  watch: {
    sizeRatio(nv) {
      this.$nextTick(() => {
        this.getPathObject()
      })
    }
  },
  created() {

  },
  mounted() {
    this.initCanvas()
    this.initWebSocket()
  },

  methods: {
    initCanvas() {
      this.c = this.$refs.myCanvas
      if (this.c.getContext) {
        this.ctx = this.c.getContext('2d')
      }
    },

    getMapCallback(mapInfo) {
      // 获取地图路径
      this.getPathByMap(mapInfo)
    },

    /**
     * @ description 获取已有的路径
     */
    getPathByMap(mapInfo) {
      console.log('getPathByMap')
      getPathPlanningList(mapInfo.id).then(response => {
        this.isLoading = false
        this.mapPaths = response.data
        if (this.mapPaths.length) {
          if (this.sizeRatio) this.getPathObject()
        } else {
          clearInterval(this.timer)
          this.computedIcons = []
          this.$message.info('当前地图未规划路径，请先规划路径！')
        }
      })
    },

    moveSetInterval() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.sizeRatio) this.drawIcon()
      }, 500)
    },

    getPathObject() {
      this.pathObject = {}
      this.mapPaths.forEach(path => {
        const points = this.responsePosition(path.points)
        const reversePoints = JSON.parse(JSON.stringify(points)).reverse()

        const name = path.name
        const nameArr = name.split('-')
        const reverseName = nameArr.reverse().join('-')

        const startName = nameArr[1]
        const endNmae = nameArr[0]

        console.log(points)

        if (startName && !this.pathObject[startName]) {
          this.pathObject[startName] = [points[0]]
        }
        if (endNmae && !this.pathObject[endNmae]) {
          this.pathObject[endNmae] = [reversePoints[0]]
        }
        if (!this.pathObject[name]) {
          this.pathObject[name] = points
        }
        if (!this.pathObject[reverseName]) {
          this.pathObject[reverseName] = reversePoints
        }
      })
      this.handleIcons() // 处理返回的医护人员信息
    },

    // 获取到医护人员信息后 要确定是哪条路线 然后确定当前的位置点
    handleIcons() {
      this.computedIcons = []
      this.newIcons.forEach((item, index) => {
        const { sn, imgId } = item
        item.path = this.pathObject[item.beaconId]
        const oldIcon = this.oldIcons[index]
        const beaconId = !oldIcon ? item.beaconId : oldIcon.beaconId !== item.beaconId ? `${oldIcon.beaconId}-${item.beaconId}` : item.beaconId
        const path = this.pathObject[beaconId]
        const count = !oldIcon ? 0 : oldIcon.beaconId !== item.beaconId ? 0 : item.count || 0

        this.computedIcons[index] = { beaconId, path, sn, imgId, count }
      })

      if (this.computedIcons.length) this.moveSetInterval()
    },

    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     */
    drawIcon() {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
      this.computedIcons.forEach((item, index) => {
        const { count, path } = item
        if (path) {
          const point = path && path[count] ? path[count] : item.path[path.length - 1]
          item.count++
          if (point) {
            const { xpos, ypos } = point
            const realX = xpos - 10
            const realY = ypos - 20
            this.ctx.drawImage(document.getElementById(item.imgId), realX, realY, 20, 20)
            // 设置字体
            // this.ctx.font = '14px'
            this.ctx.textAlign = 'left'
            this.ctx.fillStyle = '#2755a5'
            this.ctx.fillText(item.sn, realX, realY)
          }
        }
      })
      this.loading = false
    },
    delWarning() {
      this.$prompt('忽略该告警信息，请设置再提醒时间', '提示', {
        inputPatter: '',
        confirmButtontext: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },

    // 获取icon自适应位置
    responsePosition(data) {
      const object = JSON.parse(JSON.stringify(data))
      object.forEach(item => {
        item.xpos *= this.sizeRatio
        item.ypos *= this.sizeRatio
      })
      return object
    },
    // 初始化websocket
    initWebSocket() {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket

        this.socket = new WebSocket(this.path)

        // 监听socket连接
        this.socket.onopen = this.websocketOpen
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.websocketGetMessage
      }
    },
    websocketOpen() {
      // this.socket(this.mapInfo.id)
    },
    websocketGetMessage(response) {
      // this.oldIcons = this.newIcons
      // this.newIcons = data
      console.log(response.data)
    },
    websocketError(err) {
      console.log(err)
    }

  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  }

}
</script>

<style lang="scss" scoped>
$cardWidth: 250px;
.real-time{

  .warning-wrapper{
    z-index: 0;
    box-sizing: border-box;
    padding: 10px;
    position: absolute;
    display: flex;
    .box-card{

      width: $cardWidth;
      font-size:12px;
      label{
        width: 60px;
        text-align: right;
        display: inline-block;
      }
      p{
        font-size:12px;
      }
      .message{
        color: red;
      }
    }
  }
}
</style>
