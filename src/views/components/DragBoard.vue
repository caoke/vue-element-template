<template>
  <div class="components-container board">
    <board :key="1" :list="todoList" :group="group" class="item todo" title="todo" />
    <board :key="2" :list="working" :group="group" title="working" class="item working" />
    <board :key="3" :list="done" :group="group" title="done" class="item done" />
  </div>
</template>

<script>
import Board from '@/components/Board'
export default {
  name: 'DragBoard',
  components: {
    Board
  },
  data() {
    return {
      group: 'mission',
      todoList: [
        {
          id: 1,
          content: '111111111'
        },
        {
          id: 12,
          content: '1222222'
        }
      ],
      working: [
        {
          id: 2,
          content: '2222'
        }
      ],
      done: [
        {
          id: 3,
          content: '31111'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.board{
  width: 1000px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;

  .item{
    &.todo{
      .board-column-header{
        background: #4A9FF9;
      }
    }

    &.working{
      .board-column-header{
        background: #f9944a;
      }
    }
    &.done{
      .board-column-header{
        background: #2ac06d;
      }
    }
  }
}
</style>
