<template>
  <div class="app-container">
    <div class="opt-btn">
      <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog({})">新增</el-button>
    </div>
    <div class="table-section">
      <el-table :data="tableData">
        <el-table-column v-for="table in ths" :key="table.prop" :label="table.label" :prop="table.prop">
          <template slot-scope="scope">
            {{ scope.row[table.prop] | filterStr(table) }}
          </template>
        </el-table-column>
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
  </div>
</template>
<script>
import pageMixin from '@/mixins/page.js'
import { getWarningWayList } from '@/api/warn.js'
// import LabelAdd from './Add.vue'
import ths from './tableThs.js'
export default {
  name: 'WarnTye',
  mixins: [pageMixin],
  data() {
    return {
      tableData: [],
      ths: ths
    }
  },
  methods: {
    getWarningWayList() {
      getWarningWayList().then(response => {
        console.log(response)
      })
    }
  }
}
</script>
