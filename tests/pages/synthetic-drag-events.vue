<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "../../src/vue/index";

const dragstartCount = ref(0);
const lastDragstartValue = ref("");

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  onDragstart: (event) => {
    dragstartCount.value += 1;
    lastDragstartValue.value = String(event.draggedNode.data.value);
  },
});
</script>

<template>
  <div>
    <ul ref="parent" class="list">
      <li v-for="value in values" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
    <div id="dragstart_count">{{ dragstartCount }}</div>
    <div id="dragstart_value">{{ lastDragstartValue }}</div>
  </div>
</template>

<style scoped>
.list {
  list-style-type: none;
  padding: 0;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>