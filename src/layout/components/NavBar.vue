<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-meun">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar+'?imageView2/1/w/80/h/80'" alt="用户头像" class="user-avatar">
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/home">
                        <el-dropdown-item>首页</el-dropdown-item>
                    </router-link>
                    <router-link to="/profile/index">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                        <span style="" @click="logout">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'

import { mapGetters } from 'vuex'
export default {
    name: 'Navbar',
    components: {
        Hamburger,
        Breadcrumb,
      
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        logout() {

        }
    }
}
</script>

<style lang="scss" scoped>
.navbar{
    height: 50px;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0,21,41,.08);
    z-index:3;
    .hamburger-container{
        float: left;
        line-height: 50px;
    }
    .breadcrumb-container{
        float: left;
    }
    .right-meun{
        float: right;
        line-height: 50px;
        height: 100%;
        .right-menu-item{
            display: inline-block;
            padding: 0 8px;
            color: #5a5e66;
            height: 100%;
            vertical-align: text-bottom;
        }

        .avatar-container{
            margin-right: 30px;
            .avatar-wrapper{
                position: relative;
                margin-top: 5px;

                .user-avatar{
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    vertical-align: middle;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
