<template>
  <div>
    <div class="header">
      11111111
    </div>
    <div v-for="n in 100" :key="n">{{ n }}</div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  data() {
    return {
      height: ''
    }
  },
  ready() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const offsetTop = this.$el.getBoundingClientRect().top
      console.log(offsetTop)
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 60px;
  width: 100%;
  background: blue;
  color: #ffffff;
}
</style>
