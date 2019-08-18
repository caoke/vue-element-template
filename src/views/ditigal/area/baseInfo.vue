<template>
  <div class="area-info">
    <el-form :model="form" label-width="80px" style="width:800px;margin: 0 auto;">
      <el-form-item label="区域名称">
        <el-input v-model="form.name" placeholder="请输入区域名称"></el-input>
      </el-form-item>
      <el-form-item label="区域类型">
        <el-select v-model="form.type" placeholder="请选择区域类型">
          <el-option v-for="(item,index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AreaBaseInfo',
  data() {
    return {
      form: {
        name: '',
        type: ''
      },
      typeOptions:[]
    }
  }
}
</script>

<style>
.area-info{

}
</style>