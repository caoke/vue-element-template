<template>
  <div class="app-container area">
    <el-form :model="form" :inline="true">
      <el-form-item label="区域名称">
        <el-input v-model="form.name" placeholder="请输入区域名称" />
      </el-form-item>
      <el-form-item label="区域类型">
        <el-select v-model="form.areaType" placeholder="请选择区域类型">
          <el-option value="" label="请选择" />
          <el-option v-for="item in areaTypes" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>
    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog({})">新增区域</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="区域ID" prop="id" />
        <el-table-column label="区域名称" prop="name" />
        <el-table-column label="区域类型" prop="areaType" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button type="danger" plain size="small" @click="showConfirm(scope.row)">删除</el-button>
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

    <el-dialog title="新增区域" :visible.sync="dialogVisible" @closed="handleClosed">
      <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="dialogRules">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="区域类型" prop="areaType">
          <el-select v-model="dialogForm.areaType" placeholder="请选择区域类型">
            <el-option v-for="item in areaTypes" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="dialogForm.desription" type="textarea" rows="3" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateDialogForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/mixins/page'
import { getArea, saveArea, deleteArea } from '@/api/area'
export default {
  name: 'AreaList',
  mixins: [pageMixin],
  data() {
    return {
      form: {
        name: '',
        areaType: ''
      },

      tableData: [],

      areaTypes: [
        {
          value: 1,
          label: '正常区域'
        },
        {
          value: 2,
          label: '禁止区域'
        }
      ],

      dialogVisible: false,
      dialogForm: {
        name: '',
        areaType: 1,
        desription: ''
      },
      dialogRules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        areaType: [
          { required: true, message: '请选择区域类型', trigger: 'change' }
        ]
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
      getArea(options).then(response => {
        const { list, total } = response.data
        this.tableData = list
        this.total = total
      })
    },
    showDialog(data) {
      const { id, name, areaType, desription } = data
      this.dialogForm = {
        id,
        name,
        areaType,
        desription
      }
      this.dialogVisible = true
    },
    showConfirm(data) {
      this.$confirm(`确定删除区域${data.name}`, '提示', {
        confirmButtontext: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(data.id)
      })
    },
    doDelete(id) {
      deleteArea(id).then(() => {
        this.$message.success('删除成功！')
        this.queryList(1)
      })
    },
    validateDialogForm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.saveArea()
        }
      })
    },
    saveArea() {
      saveArea(this.dialogForm).then(response => {
        this.$message.success('保存成功！')
        this.queryList(1)
      })
    },
    handleClosed() {
      this.$refs.dialogForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.area{

}

</style>