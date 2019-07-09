<template>
    <el-card>
        <div slot="header" class="">
            <span>个人信息</span>
        </div>

        <div class="user-profile">
            <div class="box-center">
                <pan-thumb :image="user.avatar"></pan-thumb>
            </div>
        </div>
        


    </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb/index.vue'
export default {
    components: {
        PanThumb
    },
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
    }
}
</script>

<style>

</style>
