<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

// formkit/formkit#1755: focusing a control inside an item, then pressing the
// item's drag handle, moves focus out of that control. The resulting blur
// must not cancel the native drag the handle press just armed.
const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  dragHandle: ".dragHandle",
});
</script>

<template>
  <h1>Drag handle after focusing an inner control</h1>
  <ul ref="parent" class="list" id="inner-focus">
    <li v-for="value in values" :id="value" :key="value" class="item">
      <span :id="`${value}_dragHandle`" class="dragHandle">⠿</span>
      {{ value }}
      <button :id="`${value}_button`" type="button">Edit</button>
    </li>
  </ul>
  <span id="inner_focus_values">{{ values.join(" ") }}</span>
</template>

<style scoped>
.item { display: flex; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid #ccc; }
.dragHandle { cursor: grab; padding: 0.5rem; }
</style>
