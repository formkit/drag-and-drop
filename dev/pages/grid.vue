<script setup>
import { ref } from "vue";
import { useDragAndDrop } from "../../src/vue/index";

const items = ref([
  { name: "Depeche Mode", hasClass: false, cols: 1 },
  { name: "Duran Duran", hasClass: false, cols: 4 },
  { name: "Pet Shop Boys", hasClass: false, cols: 1 },
  { name: "Kraftwerk", hasClass: false, cols: 3 },
  { name: "Tears for Fears", hasClass: false, cols: 2 },
  { name: "Checkbox with", hasClass: true, cols: 1 },
]);

const [parent, tapes] = useDragAndDrop(items.value, {
  dragHandle: ".drag-handle",
  draggingClass: "dragging",
  dropZoneClass: "dropZone",
});
</script>

<template>
  <h3>@formkit/drag-and-drop</h3>
  <div class="row" ref="parent">
    <div
      v-for="tape in tapes"
      :key="tape"
      class="item"
      :class="`cols-${tape.cols}`"
    >
      <div class="drag-handle">::</div>
      <span>
        {{ tape.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.dragging {
  background: red;
}

.row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.first {
  margin-bottom: 40px;
}

.cols-1 {
  grid-column: span 1;
}

.cols-2 {
  grid-column: span 2;
}

.cols-3 {
  grid-column: span 3;
}

.cols-4 {
  grid-column: span 4;
}

.item {
  border: 1px solid gray;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 10px;
}

.drag-handle {
  border: 1px solid gray;
  border-radius: 5px;
  overflow: hidden;
  padding: 5px;
}
</style>
