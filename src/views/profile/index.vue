<template>
  <div class="profile-container">
    <el-card>

      <h2>个人信息</h2>
      <el-form :model="form" label-width="100">
        <el-form-item label="头像">

        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>

      </el-form>
    </el-card>

    
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      form: {
        name: 'admin'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container{
  padding: 0 32px;
  text-align: center;
  width: 100%;
  .el-form{
    
  }
}
</style>
