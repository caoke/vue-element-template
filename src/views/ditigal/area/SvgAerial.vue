<template>
  <div class="container">
    <div id="drawing">
     
    </div>
  </div>
</template>

<script>
export default {
  name: "Svg",
  data() {
    return {
      draw: null
    }
  },
  mounted() {
    this.draw = SVG('drawing').size(300, 300)
  }
}
</script>
<style lang="scss" scoped>

</style>
