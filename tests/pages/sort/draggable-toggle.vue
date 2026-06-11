<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values, updateConfig] = useDragAndDrop([
  "Apple",
  "Banana",
  "Orange",
]);

// Reorder-mode toggle from #96: excluding items via the draggable callback
// must also clear the native draggable attribute.
function disableDragging() {
  updateConfig({ draggable: () => false });
}

function enableDragging() {
  updateConfig({ draggable: () => true });
}
</script>

<template>
  <div class="page-container">
    <h1>Draggable callback toggle</h1>
    <ul ref="parent" class="list">
      <li v-for="value in values" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
    <button id="disable_dragging" @click="disableDragging">
      Disable dragging
    </button>
    <button id="enable_dragging" @click="enableDragging">
      Enable dragging
    </button>
    <span id="sort_values">{{ values.join(" ") }}</span>
  </div>
</template>
