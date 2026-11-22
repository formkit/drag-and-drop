<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDragAndDrop } from "../../src/vue/index";
import {
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "../../src/index";

const [parent, values] = useDragAndDrop(
  ["Apple", "Banana", "Orange", "Pear"],
  { multiDrag: true, selectedClass: "selected" }
);
const [single] = useDragAndDrop(["One", "Two", "Three"], {
  selectedClass: "selected",
});
const read = ref("");
const readSelection = () =>
  (read.value = selectedValues(parent.value!).join(","));
// Clicking a button outside the list clears the selection by design, so tests
// read it without a click.
onMounted(() => {
  (window as any).readSelection = () => selectedValues(parent.value!).join(",");
});
</script>

<template>
  <ul ref="parent" class="list">
    <li v-for="v in values" :id="v" :key="v" class="item">{{ v }}</li>
  </ul>
  <ul ref="single" class="list">
    <li v-for="v in ['One', 'Two', 'Three']" :id="v" :key="v" class="item">{{ v }}</li>
  </ul>
  <button id="select" @click="setSelectedValues(parent!, ['Banana', 'Pear'])">select</button>
  <button id="select-single" @click="setSelectedValues(single!, ['Two', 'Three'])">select single</button>
  <button id="clear" @click="clearSelection()">clear</button>
  <button id="read" @click="readSelection">read</button>
  <span id="selection">{{ read }}</span>
  <span id="values">{{ values.join(",") }}</span>
</template>

<style scoped>
.selected { background: yellow; }
.item { padding: 10px; border: 1px solid #ccc; margin: 4px 0; list-style: none; }
</style>
