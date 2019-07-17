<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ title }}
    </div>
    <draggtable v-model="list" group="people" class="board-column-content">
      <div v-for="item in list" :key="item.id" class="board-item">{{ item.content }}</div>
    </draggtable>
  </div>
</template>

<script>
import draggtable from 'vuedraggable'
export default {
  components: {
    draggtable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.board-column{
  min-width: 300px;
  min-height: 100px;
  background: #f0f0f0;
  border-radius: 4px;
  .board-column-header{

  }
  .board-column-content{
    .board-item{
      width: 100%;
      background: #ffffff;
      line-height: 54px;
      cursor: pointer;
      text-align: left;
      height: 54px;
      margin: 4px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }

}
</style>
