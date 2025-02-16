<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
  dropZoneClass: "dropZone",
  synthDropZoneClass: "synthDropZone",
  dragHandle: ".dragHandle",
});

const [parent2, values2] = useDragAndDrop(["Cherry", "Grape", "Pineapple"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
  dropZoneClass: "dropZone",
  synthDropZoneClass: "synthDropZone",
  dragHandle: ".dragHandle",
});

const [parent3, values3] = useDragAndDrop(
  ["Strawberry", "Watermelon", "Kiwi"],
  {
    group: "transfer",
    draggable: (el) => {
      return el.tagName === "LI";
    },
    dropZoneClass: "dropZone",
    synthDropZoneClass: "synthDropZone",
    dragHandle: ".dragHandle",
  }
);

function click() {
  console.log("click");
}
</script>

<template>
  <h1>Drag Handles</h1>
  <div class="flex-wrap">
    <div class="list-container">
      <h2>List 1</h2>
      <ul id="transfer_1" ref="parent1" class="list" aria-label="list1">
        <li v-for="value in values1" :id="value" :key="value" class="item">
          <div class="item-content">
            <span :id="value + '_dragHandle'" class="dragHandle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"
                />
              </svg>
            </span>
            <span class="item-text">{{ value }}</span>
          </div>
        </li>
        <span id="values_1" class="values-display">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div class="list-container">
      <h2>List 2</h2>
      <ul id="2" ref="parent2" class="list" aria-label="list2">
        <li v-for="value in values2" :id="value" :key="value" class="item">
          <div class="item-content">
            <span :id="value + '_dragHandle'" class="dragHandle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"
                />
              </svg>
            </span>
            <span class="item-text">{{ value }}</span>
          </div>
        </li>
        <span id="values_2" class="values-display">
          {{ values2.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div class="list-container">
      <h2>List 3</h2>
      <ul id="3" ref="parent3" class="list">
        <li v-for="value in values3" :id="value" :key="value" class="item">
          <div class="item-content">
            <span :id="value + '_dragHandle'" class="dragHandle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z"
                />
              </svg>
            </span>
            <span class="item-text">{{ value }}</span>
          </div>
        </li>
        <span id="values_3" class="values-display">
          {{ values3.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropZone,
.synthDropZone {
  background-color: yellow !important;
}

.flex-wrap {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.list-container {
  flex: 1;
  min-width: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

h1 {
  margin-bottom: 1em;
  color: #2c3e50;
  font-size: 2rem;
  text-align: center;
}

h2 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  margin: 0.5rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item-content {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  gap: 0.5rem;
}

.dragHandle {
  cursor: grab;
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.dragHandle:hover {
  color: #64748b;
}

.item-text {
  font-size: 0.9rem;
  color: #334155;
}

.values-display {
  display: block;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}
</style>
