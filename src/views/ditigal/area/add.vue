<template>
  <div id="areaAdd" class="app-container area">
    <el-steps :active="active" simple>
      <el-step title="基本信息" icon="el-icon-edit" />
      <el-step title="选择天线" icon="el-icon-price-tag" />
    </el-steps>
    <base-info v-if="active === 1" />
    <aerial v-if="active === 2" />
    <div class="btn-selection">
      <el-button v-if="active === 1" type="primary" @click="switchActive(2)">下一步</el-button>
      <template v-if="active === 2">
        <el-button type="primary" @click="switchActive(1)">上一步</el-button>
        <el-button type="primary" @click="saveInfo()">保存</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import BaseInfo from './baseInfo.vue'
import Aerial from './aerial.vue'

export default {
  name: 'AreaInfo',
  components: {
    BaseInfo,
    Aerial
  },
  data() {
    return {
      active: 1
    }
  },
  methods: {
    switchActive(step) {
      this.active = step
    },
    saveInfo() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .area{
    overflow: auto;
    .el-steps{
      margin-bottom: 10px;
    }
    .btn-selection{
      width: 20%;
      margin: 40px auto;
    }
  }
</style>
