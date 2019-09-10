<template>
  <div class="app-container staff-list">
    <el-form :model="form" :inline="true">
      <el-form-item label="医护人员姓名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.sn" placeholder=""></el-input>
      </el-form-item>
      <el-button type="primary">查询</el-button>
    </el-form>

    <div class="table-section">
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" />
        <el-table-column label="编号" prop="sn" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="性别" prop="gender" />
        <el-table-column label="职位" prop="position" />
        <el-table-column label="身份证号" prop="idcard" />
        <el-table-column label="状态" prop="status" />
      </el-table>
    </div>

  </div>
</template>

<script>
export default {
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
      tableData: []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>