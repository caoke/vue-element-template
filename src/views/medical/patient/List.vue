<template>
  <div class="app-container Patient-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="住院流水号">
        <el-input v-model="form.sn" placeholder="" />
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog()">新增患者</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" />
        <el-table-column label="住院流水号" prop="sn" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="性别" prop="gender" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="身份证号" prop="idcard" />
        <el-table-column label="生日" prop="birth" />
        <el-table-column label="所属区域" prop="area" />
        <el-table-column label="入院时间" prop="admission" />
        <el-table-column label="主治医生" prop="doctor" />
        <el-table-column label="责任护士" prop="nurse" />
        <el-table-column label="监护人" prop="guardian" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deletePatient(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <patient-add :data-form="dialogForm" :is-visible="dialogVisible" @closeDialog="closeDialog" />

  </div>
</template>

<script>
import pageMixin from '@/mixins/page.js'
import { getPatient, deletePatient } from '@/api/medical/patient.js'
import PatientAdd from './Add.vue'
export default {
  name: 'MedicalPatient',
  components: { PatientAdd },
  mixins: [pageMixin],
  data() {
    return {
      form: {
        username: '',
        gender: '',
        idcard: '',
        position: '',
        sn: '',
        area: '',
        status: ''
      },
      tableData: [],
      dialogVisible: false,
      dialogForm: {
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
      }
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList(page) {
      this.currentPage = page || this.currentPage
      const options = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      Object.assign(options, this.form)
      getPatient(options).then(response => {
        const { data, dataCount } = response
        this.tableData = data
        this.total = dataCount
      })
    },
    /**
     * @description 新增用户信息
     */
    showDialog(data) {
      if (data) this.dialogForm = data
      this.dialogVisible = true
    },
    /**
     * @description 关闭弹层
     * @param isQueryList 弹窗关闭后是否请求列表
     */
    closeDialog(isQueryList) {
      this.dialogVisible = false

      if (isQueryList) this.queryList(1)
    },
    /**
     * @description 删除医护人员
     */
    deletePatient(data) {
      this.$confirm(`确定删除${data.username}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(data.id)
      })
    },
    /**
     * @description 执行删除操作
     */
    doDelete(id) {
      deletePatient(id).then(response => {
        this.$message.success('删除成功！')
        this.queryList(1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
