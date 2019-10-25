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
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog({id: ''})">新增区域</el-button>
        <el-button type="text" class="el-icon-circle-plus-outline ml-15" @click="dialogAreaTypeVisible = true">新增区域类型</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="区域ID" prop="id" />
        <el-table-column label="区域名称" prop="name" />
        <el-table-column label="区域类型" prop="type">
          <template slot-scope="scope">
            {{ scope.row.type | filterStr(areaTypes) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="showDialog(scope.row)">修改</el-button>
            <el-button type="primary" size="small" @click="goAerial(scope.row)">管理天线</el-button>
            <el-button type="danger" plain size="small" class="ml-15" @click="showConfirm(scope.row)">删除</el-button>
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

    <el-dialog :title="dialogForm.id ? '编辑区域' : '新增区域'" :visible.sync="dialogVisible" custom-class="custom-dialog" @closed="handleClosed">
      <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="dialogRules">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="区域类型" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择区域类型">
            <el-option v-for="item in areaTypes" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="dialogForm.desription" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateDialogForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogAreaTypeVisible" title="新增区域类型" width="400px" custom-class="custom-dialog">
      <el-form>
        <el-form-item label="区域类型">
          <el-input v-model="dialogAreaTypeForm.areaType" style="width: 220px;" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogAreaTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAreaType">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { pageMixin } from '@/mixins/page'
import { getArea, saveArea, deleteArea } from '@/api/area'
import { mapGetters } from 'vuex'

export default {
  name: 'AreaList',
  filters: {
    filterStr(val, configs) {
      const arr = configs.map(config => {
        if (val === config.value) {
          return config.label
        }
      })
      if (arr.length) return arr[0]
    }
  },
  mixins: [pageMixin],
  data() {
    return {
      form: {
        name: '',
        areaType: ''
      },
      tableData: [],
      dialogVisible: false,
      dialogForm: {
        id: '',
        name: '',
        areaType: '',
        desription: ''
      },
      dialogRules: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择区域类型', trigger: 'change' }
        ]
      },
      dialogAreaTypeForm: {
        areaType: ''
      },
      dialogAreaTypeVisible: false
    }
  },
  computed: {
    ...mapGetters(['areaTypes'])
  },

  watch: {
    areaTypes(nv) {
      console.log(this.areaTypes)
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
        const { data, dataCount } = response
        this.tableData = data
        this.total = dataCount
        this.$message.success('查询成功')
      })
    },
    showDialog(data) {
      const { id, name, type, desription } = data
      this.dialogForm = {
        id,
        name,
        type,
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
        this.dialogVisible = false
        this.queryList(1)
      })
    },
    handleClosed() {
      this.$refs.dialogForm.resetFields()
    },
    /**
     * @description 新增区域类型
     */
    addAreaType() {

    },
    /**
     * @description 管理天线
     */
    goAerial(data) {
      this.$router.push({ name: 'DitigalAreaAerial', params: { id: data.id, img: data.src }})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

