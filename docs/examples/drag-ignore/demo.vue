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
  <DemoContainer name="Drag ignore">
    <ul ref="list" class="flex flex-col gap-2 p-4">
      <li
        v-for="tape in tapes"
        :key="tape.name"
        class="flex items-center gap-3 rounded border border-slate-300 bg-white p-3 cursor-grab dark:bg-slate-800 dark:border-slate-600"
      >
        <span class="font-medium">{{ tape.name }}</span>
        <input
          v-model="tape.note"
          class="no-drag ml-auto rounded border border-slate-300 px-2 py-1 text-sm cursor-text dark:bg-slate-900 dark:border-slate-600"
          placeholder="Select me, I won’t drag"
        />
      </li>
    </ul>
  </DemoContainer>
</template>
