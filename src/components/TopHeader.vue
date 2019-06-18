<template>
    <el-header>
        <i :class="isCollapse ? 'el-icon-s-unfold': 'el-icon-s-fold'" @click="foldMenus"></i>
        <div class="user">
            <i class="el-icon-user-solid"></i>
        </div>
    </el-header>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed:{
        ...mapState(['isCollapse'])
    },
    methods:{
        ...mapActions(['commitChangeIsCollapse']),
        foldMenus() {
            this.commitChangeIsCollapse()
        }
    }
}
</script>

<style lang="scss" scoped>
.el-header{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    i{
        font-size: 20px;
    }
}
</style>
