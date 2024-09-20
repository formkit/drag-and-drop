<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const options = reactive({
  draggingClass: "draggingClass",
});

const parent: Ref<HTMLElement | undefined> = ref(undefined);

const values = ref(["Apple", "Banana", "Orange"]);

dragAndDrop({
  parent,
  values,
  ...options,
});

function updateConfig(config: Record<string, unknown>, e: MouseEvent) {
  if (e.currentTarget instanceof HTMLElement)
    e.currentTarget.setAttribute("disabled", "true");
  Object.assign(options, config);

  dragAndDrop({
    parent,
    values,
    ...options,
  });
}
</script>

<template>
  <h1>Classes</h1>
  <h3>Instructions:</h3>
  <p>
    1. Drag item, "Apple". The item you are dragging should have a background
    color of lightblue and a color of yellow. The "original" dragged node should
    not have any classes appended.
  </p>
  <p>
    2. Click "Add drag placeholder class" button. Drag item, "Banana". The item
    you are dragging should have a background color of lightblue and a color of
    yellow. The "original" dragged node should have a class of
    "dragPlaceholderClass" appended. On dragend, we should see the class of
    "dragPlaceholderClass" removed from the "original" dragged node.
  </p>
  <ul ref="parent" class="list">
    <li v-for="value in values" :id="value" :key="value" class="item">
      {{ value }}
    </li>
  </ul>
  <div class="values">
    Values:
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
  <button
    @click="
      (e) => updateConfig({ dragPlaceholderClass: 'dragPlaceholderClass' }, e)
    "
  >
    Add drag placeholder class
  </button>
  <button @click="(e) => updateConfig({ dropZoneClass: 'dropZoneClass' }, e)">
    Add dropzone class
  </button>
</template>

<style>
.dropZoneClass {
  background-color: green !important;
  color: white !important;
}
.dragPlaceholderClass {
  background-color: red !important;
  color: white !important;
}

.draggingClass {
  background-color: lightblue !important;
  color: yellow !important;
}

body {
  height: 10000px !important;
}
h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.teal {
  background-color: teal !important;
}

.yellow {
  background-color: yellow !important;
}
</style>
