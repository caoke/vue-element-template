<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ title }}
    </div>
    <draggtable
      :list="list"
      :group="group"
      class="board-column-content"
    >
      <div v-for="item in list" :key="item.id" class="board-item">{{ item.content }}</div>
    </draggtable>
  </div>
</template>

<script>
import draggtable from 'vuedraggable'
export default {
  name: 'DragKanbanDemo',
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
      default() {
        return []
      }
    },
    group: {
      type: String,
      default: '',
      required: true // 必填 否则无法拖拽
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.board-column{
  min-width: 300px;
  min-height: 100px;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header{
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    background: #333;
    border-radius: 3px 3px 0px 0px;
    overflow: hidden;
  }
  .board-column-content{
    height: auto;
    min-height: 100px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    border: 10px solid transparent;

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
