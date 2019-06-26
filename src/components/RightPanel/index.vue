<template>
    <div ref="rightPanel" :class="{show: show}" class="rightPanel-container">
        <div class="rightPanel-background" />
        <div class="rightPanel">
            <div class="handle-button" :style="{'top':buttonTop+'px','background-color':theme}" @click="show=!show">
                <i :class="show ? 'el-icon-close' : 'el-icon-setting'"></i>
            </div>
        </div>
    </div>
</template>

<script>
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
    watch: {
        show(nv) {

        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.rightPanel-container{
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
        right: 0;
        background: rgb(212, 184, 184);
        transition: all .25s cubic-bezier(.7, .3, .1, 1);
        transform: translate(100%);
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

    }
}

</style>
