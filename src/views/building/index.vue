<template>
  <div class="app-container building">
    <el-button type="primary" class="opt-btn" @click="showDialog">新增楼栋</el-button>

    <div class="table-section">
      <el-table :data="tableData" >
        <el-table-column v-for="item in ths" :key="item.prop" :label="item.label" :prop="item.prop"></el-table-column>
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

    <el-dialog title="新增楼栋" :visible.sync="dialogVisiable">
      <el-form :model="dialogForm" label-width="150px">
        <el-form-item label="楼栋名称">
          <el-input v-model="dialogForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="楼栋层数">
          <el-input v-model="dialogForm.level" placeholder="请输入楼层数"></el-input>
        </el-form-item>
        <el-form-item label="请选择是否启用">
          <el-select v-model="dialogForm.isEnabled" placeholder="请选择是否启用">
            <el-option :value="0" label="启用"></el-option>
            <el-option :value="1" label="不启用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {pageMixin} from '@/mixins/page.js'
import {buildings} from '@/api/building'
export default {
  name: 'Building',
  mixins: [pageMixin],
  data() {
    return {
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
        },
        {
          label:  '是否启用',
          prop: 'isEnabled'
        }
      ],

      dialogVisiable: false,
      dialogForm:{
        name: '',
        level: '',
        isEnabled: 1,
        text: ''
      }
    }
  },
  mounted() {
    this.queryList()
  },
  methods:{
    queryList() {
      buildings({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(response => {
        this.tableData = response.data
      })
    },
    showDialog() {
      this.dialogVisiable = true
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
