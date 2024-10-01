<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const options = reactive({
  draggingClass: "draggingClass",
  synthDraggingClasss: "draggingClass",
});

const parent: Ref<HTMLElement | undefined> = ref(undefined);

const values = ref(["Apple", "Banana", "Orange"]);

dragAndDrop({
  parent,
  values,
  ...options,
});

function updateConfig(config: Record<string, unknown>, e: MouseEvent) {
  if (!(e.currentTarget instanceof HTMLElement)) return;

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
    2. Click "add dropzone class" button. Drag item, "Banana". The dropzone
    should have a background color of green and a color of white. The item you
    are dragging should have a background color of lightblue and a color of
    yellow.
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
  <button @click="(e) => updateConfig({ dropZoneClass: 'dropZoneClass' }, e)">
    Add dropzone class
  </button>
</template>

<style scoped>
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

.teal {
  background-color: teal !important;
}

.yellow {
  background-color: yellow !important;
}
</style>
