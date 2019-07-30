<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model.trim="loginForm.username"
          type="text"
          prefix-icon="el-icon-user"
          placeholder="用户名"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="loginForm.password"
          type="password"
          :show-password="true"
          prefix-icon="el-icon-lock"
          placeholder="密码"
          autocomplete="on"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' }
        ]
      },
      loading: false,
      redirect: undefined,
      otherQuery: undefined
    }
  },
  watch: {
    $route: {
      handler(nv) {
        const query = nv.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 检验password
     */
    validatePassword(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('密码不少于6个字符'))
      } else {
        callback()
      }
    },
    /**
     *  登录
     */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 获取页面上的其他参数
     */
    getOtherQuery(query) {
      Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
      }, {})
    }
  }
}
</script>
<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    color: #454545;
    font-size: 14px;
  }
  .el-input {
    input {
      background: transparent;
      border: 0px;
      height: 47px;
      line-height: 47px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: #fff;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  width: 100%;
  height: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        text-align: center;
        margin: 0px auto 40px auto;
        color: $light_gray;
      }
    }
  }

  .svg-container {
  }
}
</style>
