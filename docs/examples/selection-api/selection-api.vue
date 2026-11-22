<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import {
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "@formkit/drag-and-drop";

const [list, tapes] = useDragAndDrop(
  ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
  { multiDrag: true, selectedClass: "selected" }
);

// Select by value (replaces the current selection)
const selectSynth = () => setSelectedValues(list.value!, ["Kraftwerk", "Pet Shop Boys"]);
// Read the current selection
const logSelection = () => console.log(selectedValues(list.value!));
</script>

<template>
  <ul ref="list">
    <li v-for="tape in tapes" :key="tape">{{ tape }}</li>
  </ul>
  <button @click="selectSynth">Select synth-pop</button>
  <button @click="clearSelection">Clear</button>
</template>
