<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { multiDrag, selections } from "../../../src/index";

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
  plugins: [
    multiDrag({
      plugins: [
        selections({
          selectedClass: "red",
        }),
      ],
    }),
  ],
});

const [parent2, files2] = useDragAndDrop([], {
  group: "A",
  plugins: [
    multiDrag({
      plugins: [
        selections({
          selectedClass: "red",
        }),
      ],
    }),
  ],
});
</script>

<template>
  <div name="multiDrag">
    <div
      class="group bg-slate-500 dark:bg-slate-800 data-[handles=true]:bg-emerald-700 dark:data-[handles=true]:bg-emerald-950"
    >
      <div class="p-2 mr-2 flex justify-between font-oldschool">
        <ul
          ref="parent1"
          class="bg-white border-4 border-slate-400 w-full p-3 dark:bg-neutral-700"
        >
          <li
            v-for="item in files1"
            :key="item"
            class="py-2 px-4 last:mb-0 !text-2xl"
          >
            {{ item }}
          </li>
        </ul>

        <ul
          ref="parent2"
          class="bg-white border-4 border-slate-400 ml-2 w-full p-3 dark:bg-neutral-700"
        >
          <li
            v-if="files2.length"
            v-for="item in files2"
            :key="item"
            class="py-2 px-4 last:mb-0 !text-2xl"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.red {
  background-color: red !important;
}
</style>
