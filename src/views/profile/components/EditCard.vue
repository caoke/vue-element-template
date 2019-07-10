<template>
    <el-card>
        <div slot="header" class="">
            <span>更新信息</span>
        </div>
        <el-form :model="user" label-width="90">
            <el-form-item label="用户头像">
                <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="user.avatar" :src="user.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="登录名">
                <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="email">
                <el-input type="email" v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item label="用户类型">
                <el-select v-model="user.roles"></el-select>
            </el-form-item>
            <el-button type="primary" class="update-btn">更新</el-button>
        </el-form>
    </el-card>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    email: '',
                    avatar: '',
                    roles: ''
                }
            }
        }
    },
    methods: {
        handleAvatarSuccess() {

        },
        beforeAvatarUpload() {

        }
    }
}
</script>

<style lang="scss">
.avatar-uploader{
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover{
            border-color: #409EFF;
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
}

.el-form{
    margin: 0 auto;
    .update-btn{
        margin-left: 49%;
    }
}
  
</style>
