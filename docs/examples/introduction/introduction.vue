<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
const [parent, flavors] = useDragAndDrop([
  "🍦 vanilla",
  "🍫 chocolate",
  "🍓 strawberry",
]);
</script>

<template>
  <strong>Rank your favorite flavors</strong>
  <div ref="parent">
    <div v-for="flavor in flavors" :key="flavor">
      {{ flavor }}
    </div>
  </div>
</template>
