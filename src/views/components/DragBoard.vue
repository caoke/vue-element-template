<template>
  <div class="components-container borard">
    <board :key="1" :list="todoList" :group="group" title="todoList" />
    <board :key="2" :list="working" :group="group" title="working" />
  </div>
</template>

<script>
import Board from '@/components/Board'
export default {
  name: 'DragKanban',
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
        }
      ],
      working: [
        {
          id: 2,
          content: '2222'
        }
      ]
    }
  }
}
</script>

<style>

</style>
