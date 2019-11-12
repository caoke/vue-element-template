<template>
  <div class="app-container map-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="楼栋信息">
        <el-select v-model="form.bid" placeholder="请选择楼栋信息" @change="setBuildFloors">
          <el-option
            v-for="building in buildings"
            :key="building.id"
            :value="building.id"
            :label="building.name"
          />
        </el-select>
        <el-select v-model="form.floor" placeholder="请选择楼层">
          <el-option v-for="n in floors" :key="n" :value="n" :label="`${n}层`" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="queryList(1)">查询</el-button>
    </el-form>

    <div class="table-section">
      <div class="opt-btn">
        <router-link to="/ditigal/map/add">
          <el-button type="text" class="el-icon-circle-plus-outline">导入地图</el-button>
        </router-link>
      </div>
      <el-table :data="tableData">
        <el-table-column label="索引" type="index" />
        <el-table-column label="楼栋名称" prop="buildingname" />
        <el-table-column label="楼层" prop="floor" />
        <el-table-column label="地图">
          <template slot-scope="scope">

            <el-image
              style="width: 70px; height: 50px"
              :src="scope.row.src"
              :preview-src-list="[scope.row.src]"
            />
          </template>
        </el-table-column>
        <el-table-column label="说明" />
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <router-link :to="{name: 'DitigalMapEdit', params:{id: scope.row.id}}" style="margin-right: 10px;">
              <el-button type="primary" size="mini" plain>修改地图</el-button>
            </router-link>
            <router-link :to="{name: 'DitigalMapAerial', params:{id: scope.row.id, img: scope.row.src}}">
              <el-button type="primary" size="mini" plain>天线管理</el-button>
            </router-link>
            <el-button type="danger" plain size="mini" style="margin-left: 10px;" @click="deleteMap(scope.row)">删除</el-button>
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
import pageMixin from '@/mixins/page'
import { getMapList, deleteMap } from '@//api/ditigal/map'

export default {
  name: 'DitigalMapList',
  mixins: [pageMixin],
  data() {
    return {
      form: {
        bid: '',
        floor: ''
      },
      buildings: [],
      floors: '',
      tableData: [
        {
          name: '',
          id: 1
        },
        {
          name: '',
          id: 2
        }
      ]
    }
  },
  created() {
    this.getBuildings()
  },
  mounted() {
    this.queryList()
  },

  methods: {
    queryList(page) {
      this.currentPage = page || this.currentPage
      const options = Object.assign({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }, this.form)

      getMapList(options).then(response => {
        this.tableData = response.data
        this.total = response.dataCount
      })
    },
    deleteMap(data) {
      this.$confirm(`确定删除${data.building}${data.floor}层的地图吗？`, '提示', {
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
    },
    errorLoad(error, src) {
      console.log(error, src)
    }
  }
}
</script>

<style>

</style>
