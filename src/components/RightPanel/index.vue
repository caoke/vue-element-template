<template>
    <div ref="rightPanel" :class="{'show': show}" class="rightPanel-container">
        <div class="rightPanel-background" @click="show=false" />
        <div class="rightPanel">
            <div class="handle-button close" :style="{'top':buttonTop+'px','background-color':theme}" @click="show=!show">
                <i :class="show ? 'el-icon-close' : 'el-icon-setting'"></i>
            </div>
            <div class="rightPanel-items">
                <h4>系统布局配置</h4>
                <div class="rightPanel-item">
                    <span>开启tab-view</span>
                    <el-switch v-model="tabView" class="drawer-switch"></el-switch>
                </div>
                <div class="rightPanel-item">
                    <span>固定 Header</span>
                    <el-switch v-model="fixedHeader" class="drawer-switch"></el-switch>
                </div>
                <div class="rightPanel-item">
                    <span>侧边logo</span>
                    <el-switch v-model="sidebarLogo" class="drawer-switch"></el-switch>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'RighePanel',
    props: {
        buttonTop: {
            type: Number,
            default: 250
        }
    },
    data() {
        return {
            show: false,
            theme: 'rgb(24, 144, 255);'
        }
    },
    computed:{
        tabView: {
            get() {
                return this.$store.state.settings.tabsView
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'tabsView',
                    value: val
                })
            }
        },
        fixedHeader:{
            get() {
                return this.$store.state.settings.fixedHeader
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'fixedHeader',
                    value: val
                })
            }
        },
        sidebarLogo: {
            get() {
                return this.$store.state.settings.sidebarLogo
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'sidebarLogo',
                    value: val
                })
            }
        }
    },
    methods: {
        ...mapActions(['changeSetting'])
    }
}
</script>

<style lang="scss" scoped>

    .rightPanel-background{
        background: rgba(0, 0, 0, .2);
        position: fixed;
        top: 0px;
        left: 0px;
        opacity: 0;
        transition: opacity .3s cubic-bezier(.7, .3, .3, 1);
        z-index: -1;
    }
    .rightPanel{
        width: 100%;
        max-width: 260px;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0px;
        background: #ffffff;
        transition: all .3s cubic-bezier(.7, .3, .1, 1);
        transform: translate(100%);
        z-index: 40000;
    }
    .show {
        transition: all .3s cubic-bezier(.7, .3, .1, 1);

        .rightPanel-background {
            z-index: 20000;
            opacity: 1;
            width: 100%;
            height: 100%;
        }

        .rightPanel {
            transform: translate(0);
        }
    }
    .handle-button{
        width: 48px;
        height: 48px;
        position: absolute;
        left: -48px;
        background-color: rgb(24, 144, 255);
        text-align: center;
        line-height: 48px;
        vertical-align: middle;
        font-size: 30px;
        color: #ffffff;
        border-radius: 6px 0 0 6px;
        z-index: 0;
        position: absolute;
        left: -48px;

    }
    .rightPanel-items{
        padding: 24px;
        font-size: 14px;
        .rightPanel-item{
            margin: 30px 0px;
            display: flex;
            justify-content: space-between;
        }
        

    }

</style>
