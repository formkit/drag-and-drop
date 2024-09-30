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
  <div class="file-manager">
    <ul ref="parent1" class="file-list">
      <li v-for="item in files1" :key="item" class="file">
        {{ item }}
      </li>
    </ul>
    <ul ref="parent2" class="file-list">
      <li v-for="item in files2" :key="item" class="file">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
