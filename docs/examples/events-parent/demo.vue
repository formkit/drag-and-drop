<script setup lang="ts">
import { ref } from "vue";
import { state } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const dragStatus = ref("Not dragging");
const valuesChanged = ref("Not sorting");
const [parent, flavors] = useDragAndDrop(
  ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
  {
    onDragstart: () => {
      dragStatus.value = "Dragging";
    },
    onDragend: () => {
      dragStatus.value = "Not dragging";
      valuesChanged.value = "Not sorting";
    },
    onSort: (event) => {
      console.log("onSort", event);
      valuesChanged.value = `${event.previousValues} -> ${event.values}`;
    },
  }
);
</script>

<template>
  <DemoContainer name="custom-plugin">
    <div class="border-4 p-4 border-indigo-300 dark:bg-slate-800 antialiased">
      <div class="font-oldschool mb-4 text-lg md:text-xl lg:text-2xl">
        <span class="antialiased">=== Rank your favorite flavors ===</span>
        <div>Drag status: {{ dragStatus }}</div>
        <div>Values changed: {{ valuesChanged }}</div>
      </div>
      <div
        ref="parent"
        class="border-2 border-indigo-300 font-oldschool text-lg md:text-xl lg:text-2xl antialiased"
      >
        <div
          v-for="flavor in flavors"
          :key="flavor"
          class="border-2 border-indigo-300 p-2"
        >
          {{ flavor }}
        </div>
      </div>
    </div>
  </DemoContainer>
</template>
