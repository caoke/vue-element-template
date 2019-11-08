<template>
  <div class="app-container staff-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="标签名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.sn" placeholder="" />
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog()">新增标签</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" />
        <el-table-column label="编号" prop="id" />
        <el-table-column label="硬件id" prop="deviceid" />
        <el-table-column label="标签名称" prop="name" />
        <el-table-column label="绑定id" prop="objectid" />
        <el-table-column label="标签类型" prop="objecttype" />
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteLabel(scope.row)">删除</el-button>
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
    <label-add :data-form="dialogForm" :is-visible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/page.js'
import { getLabel, deleteLabel } from '@/api/medical/label.js'
import LabelAdd from './Add.vue'

export default {
  name: 'MedicalStaff',
  components: { LabelAdd },
  mixins: [pageMixin],
  data() {
    return {
      form: {
        name: ''
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
      getLabel(options).then(response => {
        const { data, dataCount } = response
        this.tableData = data
        this.total = dataCount
      })
    },
    /**
     * @description 新增
     */
    showDialog(data) {
      if (data) this.dialogForm = data
      this.dialogVisible = true
    },
    /**
     * @description 关闭弹层
     */
    closeDialog(isQueryList) {
      this.dialogVisible = false
      if (isQueryList) this.queryList(1)
    },
    /**
     * @description 删除
     */
    deleteLabel(data) {
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
      deleteLabel(id).then(response => {
        this.$message.success('删除成功！')
        this.queryList(1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

