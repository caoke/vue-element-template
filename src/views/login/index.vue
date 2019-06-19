<template>
    <div class="login-container">
        <el-form ref="loginform" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">
            <div class="title-container">
                <h3 class="title">系统登录</h3>
            </div>
            <el-form-item prop="username">
                <el-input v-model.trim="loginForm.username" type="text" placeholder="用户名">
                    <i slot="prefix" class="el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model.trim="loginForm.password" type="password" placeholder="密码">
                    <i slot="prefix" class="el-icon-lock"></i>
                </el-input>
            </el-form-item>
            <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading">登录</el-button>
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
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            loading: false
        }
    }
}
</script>

<style lang="scss" scoped>
    $bg:#2d3a4b;
    $light_gray: #eee;
    
    .login-container{
        width: 100%;
        height: 100%;
        background-color: $bg;
        overflow: hidden;

        .title-container{
            position: relative;

            .title {
                text-align: center;
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                font-weight: bold;
            }
        }

        .login-form{
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }
        
        .svg-container{
           
        }
    }
</style>
