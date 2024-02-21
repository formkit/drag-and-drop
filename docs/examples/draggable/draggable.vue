<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
const [parent, tapes] = useDragAndDrop([
  "ACDC LIVE",
  "Metallica",
  "Guns N' Roses",
  "Def Leppard",
  "Bon Jovi",
  "Van Halen",
], {
  draggable: (el) => {
    return el.id !== "no-drag";
  }
});
</script>

<template>
  <ul ref="parent">
    <li v-for="tape in tapes" :key="tape" class="cassette">
      {{ tape }}
    </li>
    <li id="no-drag">I am NOT draggable</li>
  </ul>
</template>
