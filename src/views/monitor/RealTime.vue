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

    <img id="map" src="../../assets/map2.jpeg" style="display: none;" width="1000" height="600" @load="drawIcon">

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

    <div class="warning">
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
import { getMapList } from '@/api/ditigal/map'

export default {
  name: 'MonitorRealTime',
  mixins: [mapMixins],
  data() {
    return {
      buildingInfo: {
        bid: '',
        floor: ''
      },
      c: null,
      ctx: null,
      icons: [
        { xpos: 810, ypos: 510, imgId: 'nurse', sn: '王护士', width: 1626, height: 914.625 },
        { xpos: 830, ypos: 420, imgId: 'nurse', sn: '张护士', width: 1626, height: 914.625 },
        { xpos: 500, ypos: 410, imgId: 'nurse', sn: '李护士', width: 1626, height: 914.625 },
        { xpos: 800, ypos: 410, imgId: 'nurse', sn: '刘护士', width: 1626, height: 914.625 },
        { xpos: 810, ypos: 360, imgId: 'doctor', sn: '曹医生', width: 1626, height: 914.625 },
        { xpos: 680, ypos: 310, imgId: 'doctor', sn: '李医生', width: 1626, height: 914.625 }
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
      loading: false
    }
  },
  created() {
    // this.getMapByBuilding()
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
    resize(num) {
      this.backgroundWidth += num
    },

    /**
     * @description 画背景图
     */
    drawBackground() {
      const map = document.getElementById('map')
      this.ctx.drawImage(map, 0, 0, this.backgroundWidth, this.backgroundHeight)
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
      this.icons.forEach((item, index) => {
        const realX = item.xpos / item.width * this.backgroundWidth
        const realY = item.ypos / item.height * this.backgroundHeight
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

    getBeaconByMap() {},
    /**
     * @description 根据楼栋和楼层 获取地图信息
     */
    getMapByBuilding({ bid, floor }) {
      if (bid) {
        this.buildingInfo.bid = bid
        this.buildingInfo.floor = floor
      }
      getMapList({
        currentPage: 1,
        pageSize: 100,
        bid: this.buildingInfo.bid,
        floor: this.buildingInfo.floor || 1
      }).then(response => {
        const mapList = response.data
        if (mapList.length) {
          const mapInfo = mapList[0]
          this.onloadImage(mapInfo)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$cardWidth: 250px;
.real-time{

  .warning{
    box-sizing: border-box;
    padding: 10px;
    background: #e3f1fc;
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
