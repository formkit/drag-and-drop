<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
const [parent, tapes] = useDragAndDrop(
  [
    "ACDC LIVE",
    "Metallica",
    "Guns N' Roses",
    "Def Leppard",
    "Bon Jovi",
    "Van Halen",
  ],
  { plugins: [animations()] }
);
</script>

<template>
  <ul ref="parent">
    <li v-for="tape in tapes" :key="tape" class="cassette">
      {{ tape }}
    </li>
  </ul>
</template>
