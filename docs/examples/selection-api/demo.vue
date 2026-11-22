<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { setSelectedValues, clearSelection } from "@formkit/drag-and-drop";

const [list, tapes] = useDragAndDrop(
  ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
  { multiDrag: true, selectedClass: "!bg-blue-500 !text-white" }
);
</script>

<template>
  <DemoContainer name="Selection API">
    <ul ref="list" class="flex flex-col gap-2 p-4">
      <li
        v-for="tape in tapes"
        :key="tape"
        class="rounded border border-slate-300 bg-white p-3 cursor-grab dark:bg-slate-800 dark:border-slate-600"
      >
        {{ tape }}
      </li>
    </ul>
    <div class="flex gap-2 px-4 pb-4">
      <button
        class="rounded bg-slate-700 px-3 py-1 text-sm text-white"
        @click="setSelectedValues(list!, ['Kraftwerk', 'Pet Shop Boys'])"
      >
        Select synth-pop
      </button>
      <button
        class="rounded bg-slate-500 px-3 py-1 text-sm text-white"
        @click="clearSelection()"
      >
        Clear
      </button>
    </div>
  </DemoContainer>
</template>
