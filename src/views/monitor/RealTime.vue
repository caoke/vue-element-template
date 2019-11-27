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

    <div class="warning-wrapper">
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
    <div class="canvas-wrapper">
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
      <img id="map" class="bg-image" :src="bgImgSrc" :width="backgroundWidth" :height="backgroundHeight" @load="drawIcon">
    </div>
  </div>
</template>

<script>
import mapMixins from '@/mixins/map'

export default {
  name: 'MonitorRealTime',
  mixins: [mapMixins],
  data() {
    return {
      c: null,
      ctx: null,
      icons: [
        { xpos: 5810, ypos: 3010, imgId: 'nurse', sn: '王护士' },
        { xpos: 8030, ypos: 3420, imgId: 'nurse', sn: '张护士' },
        { xpos: 3500, ypos: 4410, imgId: 'nurse', sn: '李护士' },
        { xpos: 6800, ypos: 4910, imgId: 'nurse', sn: '刘护士' },
        { xpos: 8810, ypos: 5360, imgId: 'doctor', sn: '曹医生' },
        { xpos: 9680, ypos: 5310, imgId: 'doctor', sn: '李医生' }
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
      loading: false,
      socket: null,
      path: 'ws://120.24.54.8/LocationServer/websocket/21'
    }
  },
  created() {
    // this.getMapByBuilding()
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
    resize(num) {
      this.backgroundWidth += num
    },

    /**
     * @description 在canvas中添加图标
     * @param img 图标
     *        backgroundWidth 当前画布宽度
     *        backgroundHeight 当前画布高度
     */
    drawIcon() {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
      const icons = this.responsePosition(this.icons)
      icons.forEach((item, index) => {
        const realX = item.xpos
        const realY = item.ypos
        this.ctx.drawImage(document.getElementById(item.imgId), realX, realY, 28, 28)
        // 设置字体
        this.ctx.font = '14px'
        this.ctx.textAlign = 'left'
        this.ctx.fillStyle = '#2755a5'
        this.ctx.fillText(item.sn, realX, realY)
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
        item.xpos = item.xpos * this.sizeRatio
        item.ypos = item.ypos * this.sizeRatio
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
      this.socket(this.mapInfo.id)
      console.log(this.mapInfo.id)
    },
    websocketGetMessage(data) {
      console.log(data)
    },
    websocketError(err) {
      console.log(err)
    }

  }
}
</script>

<style lang="scss" scoped>
$cardWidth: 250px;
.real-time{

  .warning-wrapper{
    z-index: 10;
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
