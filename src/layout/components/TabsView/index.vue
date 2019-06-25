<template>
    <div class="tabs-view">
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
                v-for="(item) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            >
                <router-view/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'TabsView',
    data() {
        return {
            editableTabsValue: ''
        }
    }
}
</script>

<style>

</style>
