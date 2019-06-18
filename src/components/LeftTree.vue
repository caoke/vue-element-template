<template>
    <el-menu 
        :default-active="activeIndex"
        class="el-menu-vertical-demo" 
        background-color="#222" 
        text-color="#fff" 
        :collapse-transition="false" 
        :collapse="isCollapse">
        <el-menu-item v-for="(item,index) in meunsData" :key="index" :index="item.id" v-if="item.path" @click="handleClick(item)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.id">
            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.id" :index="child.id" @click="handleClick(child)">
                <i :class="child.icon"></i>
                <span slot="title">{{child.title}}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
import meuns from '@/assets/data/menus.json'
import {mapState, mapActions} from 'vuex'
export default {
    data() {
        return {
            meunsData: meuns
        }
    },
    computed: {
        ...mapState(['isCollapse', 'editableTabs']),
        activeIndex() {
            return this.$route.meta.id
        }
    },
    methods: {
        ...mapActions(['commitEditableTabs']),
        handleClick(item) {
            let arr = this.editableTabs.filter(element => {
                return element.name === item.path
            });
            if(arr.length){
                this.commitEditableTabs({tabs: this.editableTabs, editableTabsValue: item.path})
            }else {
                let newTabs = this.editableTabs.concat({
                    title: item.title,
                    name: item.path
                })
                this.commitEditableTabs({
                    tabs: newTabs,
                    editableTabsValue: item.path
                })
            }
            this.$router.push(item.path)
        }
    }

}
</script>

<style lang="scss" scoped>
.el-menu{
    border-right: solid 1px #212121;
    li{
        text-align: left;
    }
}
</style>
