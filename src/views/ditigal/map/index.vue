<template>
  <div class="app-container map">
    <el-form :model="form" :inline="true">
      <el-form-item label="所属楼栋">
        <el-select v-model="form.building" placeholder="请选择所属楼层">
          <el-option v-for="item in buildingOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="queryList(1)"></el-button>
    </el-form>

    <div class="table-section">
      <el-table :data="tableData">
        <el-table-column label="索引" type="index"></el-table-column>
        <el-table-column label="楼层信息"></el-table-column>
        <el-table-column label="说明"></el-table-column>
        <el-table-column label="是否启用"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" plain >预览地图</el-button>
            <el-button type="danger" plain @click="deleteMap(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/page'
import {getMapList, deleteMap} from '@/api/map'
export default {
  name: 'ditigalMap',
  mixins:[pageMixin],
  data() {
    return {
      form: {
        building: ''
      },
      buildingOptions: [
        {
          id: 1,
          label: '住院部'
        },
        {
          id: 2,
          label: '急诊部'
        }
      ],
      tableData: []
    }
  },
  methods: {
    queryList(page) {
      this.currentPage = page || this.currentPage
      let options = Object.assign({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }, this.form)
      getMapList(options).then(response => {
        this.tableData = response.data
      })
    },
    deleteMap(data) {
      this.$confirm(`确定删除${data.building}${data.level}层的地图吗？`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(data.id)
      })
    },
    doDelete(id) {
      deleteMap(id).then(response => {
        this.$message.success('删除成功！')
        this.queryList(1)
      })
    }
  }
}
</script>

<style>

</style>
