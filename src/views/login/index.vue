<template>
    <div class="login-container">
        <el-form ref="loginform" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
            <div class="title-container">
                <h3>系统登录</h3>
            </div>
            <el-form-item>
                <el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                userName: '',
                password: ''
            },
            loginRules: {

            }
        }
    }
}
</script>

<style lang="scss" scoped>
    $bg:#2d3a4b;
    .login-container{
        width: 100%;
        height: 100%;
        background-color: $bg;
        overflow: hidden;
        .login-form{
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }
    }
</style>
