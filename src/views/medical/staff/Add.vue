<template>
  <el-dialog :title="form.id ? '修改医护人员信息' : '新增医护人员信息'"  :visible.sync="dialogVisible" width="800px" custom-class="custom-dialog" @close="closeDialog">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="医护人员编号" prop="sn">
            <el-input v-model.number="form.sn" placeholder="请输入医护人员编号" />
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
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option :value="1" label="休假" />
              <el-option :value="2" label="离职" />
              <el-option :value="0" label="正常" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="area">
            <el-select v-model="form.area" placeholder="前选择">
              <el-option :value="1" label="住院部" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="reset">重 置</el-button>
      <el-button type="primary" @click="validateDialogForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { savePersonel } from '@/api/medical/staff.js'
import { resetForm } from '@/utils/util'
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
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
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  watch: {
    dataForm: {
      handler(nv) {
        if (Object.keys(nv).length) {
          this.form = JSON.parse(JSON.stringify(nv))
        }
      },
      immediate: true
    },
    isVisible: {
      handler(nv) {
        this.dialogVisible = nv
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog(type) {
      this.form = resetForm(this.form)
      this.$emit('closeDialog', type)
    },
    /**
     *@description 重置
     */
    reset() {
      this.form = resetForm(this.form)
    },
    /**
     * @description 校验
     */
    validateDialogForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.savePersonel()
        }
      })
    },
    savePersonel() {
      savePersonel(this.form).then(response => {
        this.$message.success('保存成功')
        this.closeDialog(true)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
