<template>
  <div id="wrap" class="wrap">
    <i class="iconfont icon-tongzhi" />
    <div id="box">
      <div id="marquee" ref="merquee">
        <span id="message">{{ message }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Marquee',
  props: {
    message: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {

    }
  },
  // 把父组件传入的arr转化成字符串
  mounted: function() {

  },
  // 更新的时候运动
  updated() {
    this.move()
  },
  methods: {

    move() {
      const nodeWidth = document.querySelector('span').offsetWidth
      let distance = 0 // 位移距离
      // 设置位移
      setInterval(() => {
        distance -= 1
        // 如果位移超过文字宽度，则回到起点
        if (-distance >= nodeWidth) {
          distance = 0
        }
        this.$refs.merquee.style.transform = 'translateX(' + distance + 'px)'
      }, 20)
    }
  }
}
</script>
<style lang="scss"  scoped>
@keyframes ring {
  0% { transform: scale(1) rotate(0deg); }
  33% { transform: scale(1.1) rotate(10deg); }
  66% { transform: scale(1.2) rotate(0deg); }
  100% { transform: scale(1.1) rotate(-10deg); }
}
// 限制外框宽度，隐藏多余的部分
.wrap {
  width: 100%;
  overflow: hidden;
  .iconfont {
    float: left;
    color: #e6a23c;
    margin-right: 5px;
    animation: ring .6s infinite;
  }
  // 移动框宽度设置
  #box {
    width: 90%;
    overflow: hidden;
    #marquee{
      span{
        white-space: nowrap;
      }
    }
    color: red;
  }
}

</style>
