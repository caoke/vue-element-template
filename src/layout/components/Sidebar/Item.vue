<template>
    <span slot="title">{{title}}</span>
</template>

<script>
export default {
    name: 'MenuItem',
    props: {
        icon: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style>

</style>
