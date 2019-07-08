<template>
    <div class="home-container">
        111111
        <el-button @click="update">更新数据</el-button>
        {{form.arr}}
    </div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            form: {
                arr: [1,2,3,4]
            }
        }
    },
    methods: {
        update() {
            this.form = Object.assign({}, {arr: [4,3,2,1]})
        }
    }
}
</script>

<style>

</style>
