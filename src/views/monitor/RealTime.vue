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
        { imgId: 'nurse', beaconId: '1', sn: '张护士' }
        // { xpos: 3500, ypos: 4410, imgId: 'nurse', sn: '李护士' },
        // { xpos: 6800, ypos: 4910, imgId: 'nurse', sn: '刘护士' },
        // { xpos: 8810, ypos: 5360, imgId: 'doctor', sn: '曹医生' },
        // { xpos: 9680, ypos: 5310, imgId: 'doctor', sn: '李医生' }
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
      mapPaths: [
        {
          'date': '2019-11-28 22:34:09',
          'id': 66,
          'mapId': 20,
          'name': '1-2',
          'points': [{ 'id': 830, 'pathId': 66, 'xpos': 2330, 'ypos': 1587 }, { 'id': 831, 'pathId': 66, 'xpos': 2390.3697478991594, 'ypos': 1572.669061024572 }, { 'id': 832, 'pathId': 66, 'xpos': 2450.7394957983192, 'ypos': 1558.3381220491447 }, { 'id': 833, 'pathId': 66, 'xpos': 2511.109243697479, 'ypos': 1544.0071830737168 }, { 'id': 834, 'pathId': 66, 'xpos': 2571.4789915966385, 'ypos': 1529.676244098289 }, { 'id': 835, 'pathId': 66, 'xpos': 2631.8487394957983, 'ypos': 1515.3453051228614 }, { 'id': 836, 'pathId': 66, 'xpos': 2632.1210084033614, 'ypos': 1515.2806722689077 }, { 'id': 837, 'pathId': 66, 'xpos': 2632.1210084033614, 'ypos': 1515.2806722689077 }, { 'id': 838, 'pathId': 66, 'xpos': 2692.490756302521, 'ypos': 1537.7972094190375 }, { 'id': 839, 'pathId': 66, 'xpos': 2752.8605042016807, 'ypos': 1560.3137465691673 }, { 'id': 840, 'pathId': 66, 'xpos': 2813.2302521008405, 'ypos': 1582.8302837192969 }, { 'id': 841, 'pathId': 66, 'xpos': 2873.6, 'ypos': 1605.3468208694267 }, { 'id': 842, 'pathId': 66, 'xpos': 2933.9697478991598, 'ypos': 1627.8633580195565 }, { 'id': 843, 'pathId': 66, 'xpos': 2994.339495798319, 'ypos': 1650.3798951696863 }, { 'id': 844, 'pathId': 66, 'xpos': 3054.709243697479, 'ypos': 1672.896432319816 }, { 'id': 845, 'pathId': 66, 'xpos': 3115.078991596639, 'ypos': 1695.4129694699457 }, { 'id': 846, 'pathId': 66, 'xpos': 3175.4487394957982, 'ypos': 1717.9295066200757 }, { 'id': 847, 'pathId': 66, 'xpos': 3181, 'ypos': 1719.9999999999998 }] }, { 'date': '2019-11-28 22:34:14', 'id': 67, 'mapId': 20, 'name': '2-4', 'points': [{ 'id': 848, 'pathId': 67, 'xpos': 3181, 'ypos': 1719.9999999999998 }, { 'id': 849, 'pathId': 67, 'xpos': 3241.36974789916, 'ypos': 1713.1482870997152 }, { 'id': 850, 'pathId': 67, 'xpos': 3301.7394957983192, 'ypos': 1706.2965741994306 }, { 'id': 851, 'pathId': 67, 'xpos': 3362.109243697479, 'ypos': 1699.444861299146 }, { 'id': 852, 'pathId': 67, 'xpos': 3422.478991596639, 'ypos': 1692.5931483988613 }, { 'id': 853, 'pathId': 67, 'xpos': 3482.8487394957983, 'ypos': 1685.7414354985767 }, { 'id': 854, 'pathId': 67, 'xpos': 3495.4084033613444, 'ypos': 1684.3159663865547 }, { 'id': 855, 'pathId': 67, 'xpos': 3495.4084033613444, 'ypos': 1684.3159663865547 }, { 'id': 856, 'pathId': 67, 'xpos': 3555.7781512605043, 'ypos': 1697.805903214975 }, { 'id': 857, 'pathId': 67, 'xpos': 3616.1478991596637, 'ypos': 1711.2958400433952 }, { 'id': 858, 'pathId': 67, 'xpos': 3676.5176470588235, 'ypos': 1724.7857768718156 }, { 'id': 859, 'pathId': 67, 'xpos': 3736.8873949579834, 'ypos': 1738.2757137002359 }, { 'id': 860, 'pathId': 67, 'xpos': 3797.2571428571428, 'ypos': 1751.7656505286561 }, { 'id': 861, 'pathId': 67, 'xpos': 3857.6268907563026, 'ypos': 1765.2555873570766 }, { 'id': 862, 'pathId': 67, 'xpos': 3917.996638655462, 'ypos': 1778.7455241854968 }, { 'id': 863, 'pathId': 67, 'xpos': 3978.366386554622, 'ypos': 1792.235461013917 }, { 'id': 864, 'pathId': 67, 'xpos': 4038.7361344537817, 'ypos': 1805.7253978423375 }, { 'id': 865, 'pathId': 67, 'xpos': 4099.105882352941, 'ypos': 1819.2153346707578 }, { 'id': 866, 'pathId': 67, 'xpos': 4159.475630252101, 'ypos': 1832.705271499178 }, { 'id': 867, 'pathId': 67, 'xpos': 4219.845378151261, 'ypos': 1846.1952083275983 }, { 'id': 868, 'pathId': 67, 'xpos': 4280.215126050421, 'ypos': 1859.6851451560187 }, { 'id': 869, 'pathId': 67, 'xpos': 4304, 'ypos': 1864.9999999999998 }] }, { 'date': '2019-11-28 22:34:28', 'id': 68, 'mapId': 20, 'name': '5-door', 'points': [{ 'id': 870, 'pathId': 68, 'xpos': 2746, 'ypos': 2426 }, { 'id': 871, 'pathId': 68, 'xpos': 2685.63025210084, 'ypos': 2281.1862936058724 }, { 'id': 872, 'pathId': 68, 'xpos': 2668.342857142857, 'ypos': 2239.7176470588233 }, { 'id': 873, 'pathId': 68, 'xpos': 2668.342857142857, 'ypos': 2239.7176470588233 }, { 'id': 874, 'pathId': 68, 'xpos': 2668.342857142857, 'ypos': 2239.7176470588233 }, { 'id': 875, 'pathId': 68, 'xpos': 2728.712605042017, 'ypos': 2232.4732773109245 }, { 'id': 876, 'pathId': 68, 'xpos': 2789.0823529411764, 'ypos': 2225.228907563025 }, { 'id': 877, 'pathId': 68, 'xpos': 2819.2672268907563, 'ypos': 2221.6067226890755 }, { 'id': 878, 'pathId': 68, 'xpos': 2819.2672268907563, 'ypos': 2221.6067226890755 }, { 'id': 879, 'pathId': 68, 'xpos': 2819.2672268907563, 'ypos': 2221.6067226890755 }, { 'id': 880, 'pathId': 68, 'xpos': 2879.636974789916, 'ypos': 2209.997155785391 }, { 'id': 881, 'pathId': 68, 'xpos': 2940.0067226890756, 'ypos': 2198.3875888817065 }, { 'id': 882, 'pathId': 68, 'xpos': 2976.2285714285713, 'ypos': 2191.421848739496 }, { 'id': 883, 'pathId': 68, 'xpos': 2976.2285714285713, 'ypos': 2191.421848739496 }, { 'id': 884, 'pathId': 68, 'xpos': 3036.598319327731, 'ypos': 2158.492065130499 }, { 'id': 885, 'pathId': 68, 'xpos': 3054, 'ypos': 2149 }] }, { 'date': '2019-11-28 22:34:32', 'id': 69, 'mapId': 20, 'name': 'door-3', 'points': [{ 'id': 886, 'pathId': 69, 'xpos': 3054, 'ypos': 2149 }, { 'id': 887, 'pathId': 69, 'xpos': 3114.36974789916, 'ypos': 2159.0765056831556 }, { 'id': 888, 'pathId': 69, 'xpos': 3174.7394957983197, 'ypos': 2169.1530113663107 }, { 'id': 889, 'pathId': 69, 'xpos': 3235.109243697479, 'ypos': 2179.2295170494663 }, { 'id': 890, 'pathId': 69, 'xpos': 3235.818487394958, 'ypos': 2179.347899159664 }, { 'id': 891, 'pathId': 69, 'xpos': 3235.818487394958, 'ypos': 2179.347899159664 }, { 'id': 892, 'pathId': 69, 'xpos': 3296.1882352941175, 'ypos': 2187.606737727746 }, { 'id': 893, 'pathId': 69, 'xpos': 3356.5579831932773, 'ypos': 2195.8655762958288 }, { 'id': 894, 'pathId': 69, 'xpos': 3416.927731092437, 'ypos': 2204.1244148639107 }, { 'id': 895, 'pathId': 69, 'xpos': 3477.2974789915966, 'ypos': 2212.383253431993 }, { 'id': 896, 'pathId': 69, 'xpos': 3537.6672268907564, 'ypos': 2220.642092000075 }, { 'id': 897, 'pathId': 69, 'xpos': 3598.036974789916, 'ypos': 2228.900930568158 }, { 'id': 898, 'pathId': 69, 'xpos': 3628.0000000000005, 'ypos': 2233 }] }, { 'date': '2019-11-28 22:35:52', 'id': 71, 'mapId': 20, 'name': '3-6', 'points': [{ 'id': 921, 'pathId': 71, 'xpos': 3628.0000000000005, 'ypos': 2233 }, { 'id': 922, 'pathId': 71, 'xpos': 3567.6302521008406, 'ypos': 2278.5423211405596 }, { 'id': 923, 'pathId': 71, 'xpos': 3507.2605042016808, 'ypos': 2324.0846422811187 }, { 'id': 924, 'pathId': 71, 'xpos': 3446.8907563025214, 'ypos': 2369.6269634216783 }, { 'id': 925, 'pathId': 71, 'xpos': 3435.038655462185, 'ypos': 2378.568067226891 }, { 'id': 926, 'pathId': 71, 'xpos': 3435.038655462185, 'ypos': 2378.568067226891 }, { 'id': 927, 'pathId': 71, 'xpos': 3398, 'ypos': 2728 }] }], // 当前地图所有路径

      pathObject: {},

      loading: false,
      socket: null,
      path: 'ws://120.24.54.8/LocationServer/websocket/21',

      oldIcons: [
        { imgId: 'nurse', beaconId: '1', sn: '王护士' },
        { imgId: 'nurse', beaconId: '1', sn: '张护士' }
      ],
      computedIcons: [],
      timer: null

    }
  },
  watch: {
    sizeRatio(nv) {
      console.log(nv)
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
        if (this.sizeRatio) this.getPathObject()
        // this.mapPaths = response.data
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.sizeRatio) this.drawIcon()
        }, 1000)
      })
    },

    getPathObject() {
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
      this.newIcons.forEach((item, index) => {
        const { sn, imgId } = item
        item.path = this.pathObject[item.beaconId]
        const oldIcon = this.oldIcons[index]
        const beaconId = !oldIcon ? item.beaconId : oldIcon.beaconId !== item.beaconId ? `${oldIcon.beaconId}-${item.beaconId}` : item.beaconId
        const path = this.pathObject[beaconId]
        const count = !oldIcon ? 0 : oldIcon.beaconId !== item.beaconId ? 0 : item.count || 0

        this.computedIcons[index] = { beaconId, path, sn, imgId, count }
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

      this.computedIcons.forEach((item, index) => {
        const { count, path } = item
        const point = path && path[count] ? path[count] : item.path[path.length - 1]
        item.count++
        if (point) {
          const { xpos, ypos } = point
          const realX = xpos
          const realY = ypos
          this.ctx.drawImage(document.getElementById(item.imgId), realX, realY, 28, 28)
          // 设置字体
          this.ctx.font = '14px'
          this.ctx.textAlign = 'left'
          this.ctx.fillStyle = '#2755a5'
          this.ctx.fillText(item.sn, realX, realY)
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
      this.socket(this.mapInfo.id)
      console.log(this.mapInfo.id)
    },
    websocketGetMessage(data) {
      this.oldIcons = this.newIcons
      this.newIcons = data
      console.log(data)
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
