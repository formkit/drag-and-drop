<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  dragIgnore: ".drag-ignore",
});
</script>

<template>
  <ul ref="parent">
    <li class="item" v-for="value in values" :id="value" :key="value">
      <span>{{ value }}</span>
      <button :id="`${value}_ignore`" class="drag-ignore" type="button">
        <span :id="`${value}_ignore_child`">Ignore drag</span>
      </button>
    </li>
  </ul>
  <span id="drag_ignore_values">{{ values.join(" ") }}</span>
</template>

<style scoped>
.item {
  cursor: grab;
}

.drag-ignore {
  border: 1px dashed #435;
  cursor: pointer;
}
</style>
