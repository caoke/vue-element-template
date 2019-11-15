<template>
  <el-dialog :title="form.id ? '修改标签信息' : '新增标签'" :visible.sync="dialogVisible" width="800px" custom-class="custom-dialog" @close="closeDialog">
    <el-form ref="form" :model="form" :rules="rules" label-phone="right" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="硬件ID" prop="deviceid">
            <el-input v-model="form.deviceid" placeholder="请输入硬件ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入标签名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签类型" prop="objecttype">
            <el-select v-model="form.objecttype">
              <el-option :value="1" label="医护人员" />
              <el-option :value="2" label="患者" />
              <el-option :value="3" label="设备" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绑定id" prop="objectid">
            <el-input v-model.number="form.objectid" placeholder="请输入对应医护人员id或者患者id或者硬件id" />
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
import { savePatient } from '@/api/medical/patient'
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
        deviceid: '',
        name: '',
        objecttype: '',
        objectid: ''
      },
      rules: {
        deviceid: [
          { required: true, message: '请输入硬件id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        objecttype: [
          { required: true, message: '请选择标签类型', trigger: 'change' }
        ],
        objectid: [
          { required: true, message: '请输入id', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  watch: {
    isVisible: {
      handler(nv) {
        this.dialogVisible = nv
        if (Object.keys(this.dataForm).length) {
          this.form = JSON.parse(JSON.stringify(this.dataForm))
        } else {
          this.reset()
        }
      },
      immediate: true
    }

  },
  mounted() {
  },
  methods: {
    closeDialog() {
      this.reset()
      this.$emit('closeDialog')
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
        this.closeDialog()
      })
    }
  }
}
</script>

<style lang="scss">

</style>
