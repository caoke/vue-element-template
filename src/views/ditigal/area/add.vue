<template>
  <div id="areaAdd" class="app-container area">
    <base-info v-if="active === 1" @switchActive="updateActive" />
    <aerial v-if="active === 2" />
  </div>
</template>

<script>
import BaseInfo from './baseInfo.vue'
import Aerial from './aerial.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'AreaInfo',
  components: {
    BaseInfo,
    Aerial
  },
  data() {
    return {
      active: 2
    }
  },
  computed: {
    ...mapGetters(['areaTypes'])
  },
  methods: {
    updateActive(step) {
      console.log(step)
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
