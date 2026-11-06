<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const [list, tapes] = useDragAndDrop(
  [
    { name: "Depeche Mode", note: "" },
    { name: "Duran Duran", note: "" },
    { name: "Pet Shop Boys", note: "" },
    { name: "Kraftwerk", note: "" },
  ],
  { dragIgnore: ".no-drag" }
);
</script>

<template>
  <ul ref="list">
    <li v-for="tape in tapes" :key="tape.name">
      {{ tape.name }}
      <!-- Clicks and text selection here won't start a drag -->
      <input v-model="tape.note" class="no-drag" />
    </li>
  </ul>
</template>
