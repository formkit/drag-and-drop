<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [sourceList, sourceItems] = useDragAndDrop(
  ["Apple", "Banana", "Orange", "Cherry", "Grape"],
  {
    group: "transfer",
    draggable: (el) => {
      return el.tagName === "LI";
    },
    dropZoneClass: "dropZone",
    synthDropZoneClass: "synthDropZone",
    onDragend: () => {
      console.log("drag end");
      document.body.setAttribute("data-source-dragend", "true");
    },
  }
);
</script>

<template>
  <div class="container">
    <h1 id="issue-133-title">Issue 133</h1>
    <div class="content">
      <input type="text" value="Hello World" class="text-input" />
      <ul ref="sourceList" class="fruit-list">
        <li v-for="item in sourceItems" :id="item" :key="item" class="item">
          <input type="text" :value="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 2rem;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.text-input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  transition: border-color 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: #666;
}

.fruit-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
  user-select: text;
}

.item:hover {
  background: #e9e9e9;
}

.dropZone {
  background: #e3f2fd !important;
}

.synthDropZone {
  background: #e8f5e9 !important;
}
</style>
