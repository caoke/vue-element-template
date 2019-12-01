<template>
  <div class="app-container">
    <el-form :model="form">
      <el-form-item label="">
        <el-select v-model="form.warningType" placeholder="所有告警类型">
          <el-option v-for="warning in warningTypes" :key="warning.id" :label="warning.name" />
        </el-select>
      </el-form-item>

    </el-form>
    <div class="table-section">
      <div class="opt-btn">
        <el-button type="text" class="el-icon-circle-plus-outline" @click="showDialog({})">新增标签</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" />
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
import { getWarningWayList, getWarningMsgList } from '@/api/warning'
import ths from './tableThs.js'
export default {
  name: 'WarningRecord',
  mixins: [pageMixin],
  data() {
    return {
      form: {},
      warningTypes: [],
      tableData: [],
      ths
    }
  },
  created() {
    this.getWarningWayList()
  },
  methods: {
    // 获取告警方式
    getWarningWayList() {
      getWarningWayList().then(response => {
        this.warningTypes = response.data
      })
    },
    // 获取告警记录
    queryList(page) {
      this.currentPage = page || this.currentPage
      const options = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      Object.assign(options, this.form)
      getWarningMsgList(options).then(response => {
        const { data, dataCount } = response
        this.tableData = data
        this.total = dataCount
      })
    }
  }

}
</script>
