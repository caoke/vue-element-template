<template>
  <div class="profile-container">
      <el-row :gutter="20">
          <el-col :span="6" :xs="24">
             <user-card :user="userInfo"></user-card>
          </el-col>

          <el-col :span="18" :xs="24">
              <el-card>

              </el-card>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
export default {
  name: 'Profile',
  components: {
      UserCard
  },
  data() {
    return {
      form: {
        name: 'admin',
        userInfo: {
            name: '',
            email: '',
            avatar: ''
        }
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
    max-width: 1400px;
    margin: 0 auto;
    .el-input{
        width: 100%;
    }
  }
}
</style>
