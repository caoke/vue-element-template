<template>
  <div>
    <el-form ref="form" :model="form" :inline="true" class="app-container" label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="医护人员编号" prop="sn">
            <el-input v-model="form.sn" placeholder="请输入医护人员编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="form.username" placeholder="请输入医护人员姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="form.idcard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender">
              <el-option :value="1" label="男" />
              <el-option :value="2" label="女" />
              <el-option :value="0" label="未知" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位" prop="position">
            <el-input v-model="form.position" placeholder="请输入职位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="birth">
            <el-input v-model="form.birth" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="area">
            <el-input v-model="form.area" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog__footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="validateDialogForm">确 定</el-button>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    dataForm: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      form: {
        username: '',
        gender: '',
        idcard: '',
        position: '',
        sn: '',
        area: '',
        status: '',
        birth: '',
        phone: ''
      }
    }
  },
  mounted() {
    this.form = this.dataForm
  },
  methods: {
    validateDialogForm() {

    }
  }
}
</script>

<style>

</style>
