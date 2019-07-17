<template>
  <div class="split-pane">
    <aside><strong>SplitPane</strong>
      <a href="https://www.npmjs.com/package/vue-splitpane" target="_blank"> npm package</a>
    </aside>
    <split-pane split="vertical" :min-percent="20" :default-percent="50" @resize="resize">
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container" />
          </template>
          <template slot="paneR">
            <div class="bottom-container" />
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>

</template>

<script>
import splitPane from 'vue-splitpane'
export default {
  name: 'SplitPane',
  components: { splitPane },
  methods: {
    resize() {

    }
  }
}
</script>

<style lang="scss" scoped>
.split-pane{
  position: relative;
  height: 80vh;
  padding: 0 32px;

  .left-container{
    height: 100%;
    background: #fcb0b0;
  }
  .right-container{
    height: 100%;
    background: #93f3db;
  }
  .top-container{
    height: 100%;
    background: #b5ee9b;
  }
  .bottom-container{
    height: 100%;
    background: #93f3db;
  }
}
</style>
