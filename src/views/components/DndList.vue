<template>
  <div class="components-container">
    <div class="dtag-list" style="width: 40%;">
      <h3>list1</h3>
      <draggable v-model="list" group="people" class="drag-area" @start="drag=true" @end="drag=false">
        <div v-for="element in list" :key="element.id" class="list-complete-item">{{ element.name }}</div>
      </draggable>
    </div>

    <div class="dtag-list" style="width: 40%;">
      <h3>list2</h3>
      <draggable v-model="list2" group="people" class="drag-area" @start="drag=true" @end="drag=false">
        <div v-for="element in list2" :key="element.id" class="list-complete-item">{{ element.name }}</div>
      </draggable>
    </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'DndList',
  components: { draggable },
  data() {
    return {
      list: [
        { id: 1, name: '11' },
        { id: 2, name: '22' },
        { id: 3, name: '33' }
      ],
      list2: [
        { id: 11, name: '21' }
      ]
    }
  },
  methods: {
    addPeople() {
      this.list.push({
        id: this.list.length + 1,
        name: this.list.length
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.dtag-list{
  float: left;
  padding: 10px;
}
.drag-area{
  .list-complete-item{
    border: 1px solid #bfcbd9;
    cursor: pointer;
    margin: 4px 0px;
    padding: 2px;
    &.sortable-chosen{
      background: #9af3ca;
    }
  }

}
</style>
