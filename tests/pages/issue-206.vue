<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parentList, parentItems] = useDragAndDrop(
  [
    { id: "Apple", label: "Apple" },
    { id: "Banana", label: "Banana" },
  ],
  {
    draggable: (el) => {
      return el.tagName === "LI";
    },
    dropZoneClass: "dropZone",
    synthDropZoneClass: "synthDropZone",
    onDragend: () => {
      document.body.setAttribute("data-parent-dragend", "true");
    },
  }
);
</script>

<template>
  <h1 id="issue-206-title">Issue 206</h1>
  <ul ref="parentList" class="list" aria-label="parent-list">
    <li
      v-for="item in parentItems"
      :id="item.id"
      :key="item.id"
      class="item"
    >
      <img
        :id="item.id + '-img'"
        :alt="item.label"
        class="item-image"
        draggable="true"
        src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23ccc%22%2F%3E%3C%2Fsvg%3E"
      />
      <span class="item-label">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped>
.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  min-height: 200px;
  background: white;
  border-radius: 6px;
  padding: 1rem;
}
.item {
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: move;
}
.item-image {
  width: 32px;
  height: 32px;
  display: block;
  margin-bottom: 4px;
}
.dropZone {
  background-color: #f0f7ff;
  border: 2px dashed #2196f3;
}
</style>
