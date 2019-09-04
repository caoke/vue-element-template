<template>
  <div class="app-container building">
    
    <el-form :model="form" :inline="true">
      <el-form-item label="楼栋名称">
        <el-input v-model="form.name" placeholder="楼栋名称"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" >
        <el-select v-model="form.isEnabled" placeholder="请选择是否启用">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog">新增楼栋</el-button>
      </div>
      <el-table :data="tableData" >
        <el-table-column v-for="item in ths" :key="item.prop" :label="item.label" :prop="item.prop"></el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            {{scope.row.isEnabled ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="showDialog(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="deleteBuilding(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="新增楼栋" :visible.sync="dialogVisible" @closed="handleClosed">
      <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="dialogRules">
        <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="楼栋层数" prop="level">
          <el-input-number v-model="dialogForm.level" :min="1" :precision="0" placeholder="请输入楼层数"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-select v-model="dialogForm.isEnabled" placeholder="请选择是否启用">
            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="dialogForm.desription" type="textarea" rows="3"></el-input>
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
import {pageMixin} from '@/mixins/page.js'
import {buildings, saveBuilding, deleteBuilding} from '@/api/building'
export default {
  name: 'Building',
  mixins: [pageMixin],
  data() {
    return {
      form: {
        name: '',
        isEnabled: ''
      },
      tableData: [],
      ths: [
        {
          label: '编号',
          prop: 'id'
        },
        {
          label: '楼栋名称',
          prop: 'name'
        },
        {
          label: '楼层数',
          prop: 'level'
        }
      ],

      options:[
        {
          value: 0,
          label: '不启用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],

      dialogVisible: false,
      dialogForm: {
        name: '',
        level: '',
        isEnabled: 1,
        desription: ''
      },
      dialogRules: {
        name:[
          {required: true, message: '请输入楼栋名称', trigger: 'blur'}
        ],
        level: [
          { required: true, message: '请输入楼层数', trigger: 'blur' }
        ],
        isEnabled: [
          {required: true, message: '请选择是否启用', trigger: 'change'}
        ]
      }
    }
  },
  mounted() {
    this.queryList()
  },
  methods:{
    queryList(page) {
      this.currentPage = page || this.currentPage
      buildings({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = response.data
      })
    },
    showDialog(data) {
      const{ id, name, level, isEnabled} = data
      this.dialogForm = {
        id,
        name, 
        level,
        isEnabled
      }
      this.dialogVisible = true
      
    },
    /**
     * 检验表单
     */
    validateDialogForm() {
      this.$refs.dialogForm.validate(valid => {
        if(valid) {
          this.saveEdit()
        }
      })
    },
    saveEdit() {
      saveBuilding(this.dialogForm).then(response => {
        const msg = this.dialogForm.id ? '修改成功！' : '新增成功'
        this.dialogVisible = false
        this.$message.success(msg)
        this.queryList(1)
      })
    },
    goFloor() {

    },
    deleteBuilding(data) {
      this.$confirm(`确定删除${data.name}的楼栋信息吗？`,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.doDelete(data.id)
      })
    },
    /**
     * @description 删除楼栋信息
     * @param id 楼栋id
     */
    doDelete(id) {
      deleteBuilding(id).then(response => {
        this.$message.success('删除成功！')
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
.building{
  .opt-btn{
    float: right;
  }
}
</style>
