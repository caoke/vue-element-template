<template>
  <div class="area-info">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" style="width:800px;margin: 0 auto;">
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入区域名称" />
      </el-form-item>
      <el-form-item label="区域类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择区域类型">
          <el-option v-for="(item,index) in areaTypes" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-selection">
      <el-button type="primary" @click="validateForm">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveArea } from '@/api/ditigal/area'
export default {
  name: 'AreaBaseInfo',
  data() {
    return {
      form: {
        name: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择区域类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['areaTypes'])
  },
  methods: {
    validateForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveArea()
        }
      })
    },
    saveArea() {
      saveArea(this.form).then(res => {
        if (res.code === 0) {
          this.$emit('switchActive', 2)
          this.$message.success('success')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.area-info{
  .btn-selection{
    width: 20%;
    margin: 40px auto;
  }
}
</style>
