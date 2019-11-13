<template>
  <el-dialog :title="form.id ? '修改患者信息' : '新增患者信息'" :visible.sync="dialogVisible" width="800px" custom-class="custom-dialog" @close="closeDialog">
    <el-form ref="form" :model="form" :rules="rules" label-phone="right" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="form.username" placeholder="请输入医护人员姓名" />
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
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="form.idcard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入职位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="birth">
            <el-input v-model="form.birth" placeholder="请输入生日" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住院流水号" prop="sn">
            <el-input v-model="form.sn" placeholder="请输入住院流水号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="area">
            <el-select v-model="form.area" placeholder="前选择">
              <el-option :value="1" label="住院部" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入院时间">
            <el-date-picker
              v-model="form.admission"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option :value="1" label="住院" />
              <el-option :value="2" label="出院" />
              <el-option :value="0" label="未知" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主治医生">
            <el-input v-model="form.doctor" placeholder="请输入主治医生" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任护士">
            <el-input v-model="form.nurse" placeholder="请输入责任护士" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监护人">
            <el-input v-model="form.guardian" placeholder="请输入监护人" />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog__footer">
      <el-button @click="reset">重 置</el-button>
      <el-button type="primary" @click="validateDialogForm">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { savePatient } from '@/api/medical/patient.js'
import { resetForm, validIdCard, validPhone } from '@/utils/util'
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
        phone: '',
        sn: '',
        area: '',
        status: '',
        birth: '',
        admission: '',
        doctor: '',
        nurse: '',
        guardian: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validIdCard, message: '请正确输入身份证号' }
        ],
        sn: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validPhone, message: '请正确输入电话' }
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
  mounted() {
  },
  methods: {
    closeDialog(type) {
      this.form = resetForm(this.form)
      this.$emit('closeDialog', type)
    },
    reset() {
      this.form = resetForm(this.form)
    },
    validateDialogForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.savePatient()
        }
      })
    },
    savePatient() {
      savePatient(this.form).then(response => {
        this.$message.success('保存成功')
        this.closeDialog(true)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
