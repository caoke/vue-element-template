<template>
    <div class="echart">
        <div ref="myEchart" class="my-echart"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      myEchart: null,
      echartOptions: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data:['销量']
        },
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  mounted() {
    this.myEchart = echarts.init(this.$refs.myEchart)
    this.myEchart.setOption(this.echartOptions)
  }
}
</script>

<style lang="scss" scoped>
    .my-echart{
        height: 400px;
    }
</style>
