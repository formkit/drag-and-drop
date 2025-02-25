<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

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
  dragHandle: ".drag",
});
</script>

<template>
  <div class="file-manager">
    <ul ref="parent1" class="file-list">
      <li v-for="file in files1" :key="file" class="file">
        <p class="drag">{{ file }}</p>
        <input type="text" value="hello world" />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
