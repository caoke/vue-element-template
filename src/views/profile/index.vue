<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <user-card :user="user" />
      </el-col>

      <el-col :span="18" :xs="24">
        <edit-card :user="user" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import EditCard from './components/EditCard'
export default {
  name: 'Profile',
  components: {
    UserCard,
    EditCard
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        avatar: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container{
  padding: 0 32px;
}
</style>
