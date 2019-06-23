<template>
    <div v-if="!item.hidden" class="menu-wrapper">
        <template v-if="hasOneShowingChild(item.children, item)">
            <el-menu-item v-if="item.children.length === 1" :index="item.children[0].path">
                {{item.children[0].meta.title}}
            </el-menu-item>
        </template>
        
    </div>
</template>

<script>
export default {     
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            onlyOneChild: undefined
        }
    },
    watch: {
    
        item(nv) {
            console.log(nv)
        }
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item
                    return true
                }
            })

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        }
    },
    mounted() {
        console.log(this.item)
    }

}
</script>

<style>

</style>
