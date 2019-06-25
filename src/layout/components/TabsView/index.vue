<template>
    <div class="tabs-view">
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
                v-for="(item) in visitedViews"
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
import { mapGetters } from 'vuex'
export default {
    name: 'TabsView',
    data() {
        return {
            editableTabsValue: '',
            affixTags: []
        }
    },
    computed: {
        ...mapGetters(['visitedViews']),
        routes() {
            return this.$store.state.permission.routes
        }
    },
    watch: {
        $route() {
            this.addTags()
        }
    },
    methods:{
        initTags() {
            const affixTags = this.affixTags = this.filterAffixTags(this.routes)

            

        },
        addTags() {

        }
    },
    mounted() {
        this.initTags()
        this.addTags()
    }
}
</script>

<style>

</style>
