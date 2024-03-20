<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { ref } from "vue";

const disabled = ref(false);

const [parentRef, values, updateConfig] = useDragAndDrop([
  "Depeche Mode",
  "Duran Duran",
  "Pet",
  "Kraftwerk",
  "Tears for Fears",
  "Spandau Ballet",
]);

function toggleDisabled() {
  disabled.value = !disabled.value;

  updateConfig({ disabled: disabled.value });
}
</script>

<template>
  <ul ref="parentRef">
    <li v-for="tape in values" :key="tape" class="cassette">
      {{ tape }}
    </li>
  </ul>
  <button id="no-drag" @click="toggleDisabled">
    {{ disabled ? "Enable" : "Disable" }} drag and drop
  </button>
</template>
