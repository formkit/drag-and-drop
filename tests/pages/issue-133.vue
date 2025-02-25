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

const [targetList, targetItems] = useDragAndDrop(["Pineapple", "Strawberry"], {
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
});
</script>

<template>
  <h1 id="issue-133-title">Issue 133</h1>
  <div class="flex">
    <div class="list-container">
      <h2 id="source-list-header">Source List</h2>
      <ul ref="sourceList" class="list" aria-label="source-list">
        <li v-for="item in sourceItems" :id="item" :key="item" class="item">
          {{ item }}
        </li>
        <span id="values_1" class="list-summary">
          {{ sourceItems.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>

    <div class="list-container">
      <h2 id="target-list-header">Target List</h2>
      <ul ref="targetList" class="list" aria-label="target-list">
        <li v-for="item in targetItems" :id="item" :key="item" class="item">
          {{ item }}
        </li>
        <span id="values_2" class="list-summary">
          {{ targetItems.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.list-container {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 300px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #666;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  min-height: 400px;
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
  transition: all 0.2s ease;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dragging {
  background-color: #e3f2fd;
  opacity: 0.8;
}

.dropZone {
  background-color: #f0f7ff;
  border: 2px dashed #2196f3;
}

.list-summary {
  display: block;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
}
</style>
