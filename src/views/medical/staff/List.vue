<template>
  <div class="app-container staff-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="医护人员姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="医护人员编号">
        <el-input v-model="form.sn" placeholder="" />
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog({})">新增医护人员</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column v-for="table in ths" :key="table.prop" :label="table.label">
          <template slot-scope="scope">
            {{ scope.row[table.prop] | filterStr(table) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deletePersonel(scope.row)"
            >删除</el-button>
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
    <staff-add
      :data-form="dialogForm"
      :is-visible="dialogVisible"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/page.js'
import { getPersonel, deletePersonel } from '@/api/medical/staff.js'
import StaffAdd from './Add.vue'
import ths from './tableThs.js'
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
      ths,
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
      this.dialogForm = data
      console.log(this.dialogForm)
      this.dialogVisible = true
    },
    /**
     * @description 关闭弹层
     * @param isQueryList 是否请求列表
     */
    closeDialog(isQueryList) {
      this.dialogVisible = false
      if (isQueryList) this.queryList(1)
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

