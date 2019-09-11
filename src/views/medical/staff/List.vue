<template>
  <div class="app-container staff-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="医护人员姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.sn" placeholder="" />
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog()">新增医护人员</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" />
        <el-table-column label="编号" prop="sn" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="性别" prop="gender" />
        <el-table-column label="职位" prop="position" />
        <el-table-column label="身份证号" prop="idcard" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deletePersonel(scope.row)">删除</el-button>
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
    <el-dialog :title="dialogForm.id ? '修改医护人员信息' : '新增医护人员信息'" :visible.sync="dialogVisible" width="800px" custom-class="custom-dialog">
      <staff-add :data-form="dialogForm" @closeDialog="closeDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/mixins/page.js'
import { getPersonel, deletePersonel } from '@/api/medical/staff.js'
import StaffAdd from './Add.vue'
export default {
  name: 'MedicalStaff',
  components: { StaffAdd },
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
      dialogForm: {}
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
      getPersonel(options).then(response => {
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
     */
    closeDialog() {
      this.dialogVisible = false
      this.queryList(1)
    },
    /**
     * @description 删除医护人员
     */
    deletePersonel(data) {
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
      deletePersonel(id).then(response => {
        this.$message.success('删除成功！')
        this.queryList(1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

