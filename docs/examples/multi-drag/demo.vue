<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const mockFileNames = [
  "dungeon_master.exe",
  "map_1.dat",
  "map_2.dat",
  "character1.txt",
  "character2.txt",
  "shell32.dll",
  "README.txt",
];

const [parent1, files1] = useDragAndDrop(mockFileNames, {
  group: "A",
  multiDrag: true,
  selectedClass: "bg-blue-500 text-white",
});

const [parent2, files2] = useDragAndDrop([], {
  group: "A",
  multiDrag: true,
  selectedClass: "bg-blue-500 text-white",
});
</script>

<template>
  <DemoContainer name="multiDrag">
    <div
      class="group bg-slate-200 dark:bg-slate-800 data-[handles=true]:bg-emerald-700 dark:data-[handles=true]:bg-emerald-950"
    >
      <div class="p-px flex justify-between font-oldschool">
        <ul
          ref="parent1"
          class="min-w-0 grow-0 border-2 md:border-4 border-indigo-300 w-full p-3 dark:bg-slate-800"
        >
          <li
            v-for="item in files1"
            :key="item"
            class="py-1 px-2 md:py-2 md:px-4 last:mb-0 !text-lg sm:!text-xl md:!text-2xl antialiased"
          >
            {{ item }}
          </li>
        </ul>

        <ul
          ref="parent2"
          class="min-w-0 grow-0 border-2 md:border-4 border-indigo-300 ml-2 w-full p-3 dark:bg-slate-800"
        >
          <li
            v-if="files2.length"
            v-for="item in files2"
            :key="item"
            class="py-1 px-2 md:py-2 md:px-4 last:mb-0 !text-lg sm:!text-xl md:!text-2xl antialiased"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </DemoContainer>
</template>
