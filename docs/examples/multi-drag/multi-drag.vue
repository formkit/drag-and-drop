<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { multiDrag, selections } from "@formkit/drag-and-drop";

const mockFileNames = [
  "file1.txt",
  "file2.txt",
  "file3.txt",
  "file4.txt",
  "file5.txt",
  "file6.txt",
  "file7.txt",
];

const [parent1, files1] = useDragAndDrop(mockFileNames, {
  group: "A",
  plugins: [
    multiDrag({
      plugins: [
        selections({
          selectedClass: "bg-blue-500 color-white",
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
          selectedClass: "bg-blue-500 color-white",
        }),
      ],
    }),
  ],
});
</script>

<template>
  <div>
    <div
      class="group bg-slate-500 dark:bg-slate-800 data-[handles=true]:bg-emerald-700 dark:data-[handles=true]:bg-emerald-950"
    >
      <div class="kanban-board p-4 flex bg-white justify-between">
        <ul ref="parent1" class="kanban-list w-full">
          <li v-for="item in files1" :key="item">
            {{ item }}
          </li>
        </ul>

        <div class="bg-black w-3"></div>
        <ul ref="parent2" class="kanban-list w-full">
          <li v-if="files2.length" v-for="item in files2" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
