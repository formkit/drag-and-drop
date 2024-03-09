<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"]);
</script>

<template>
  <h1 class="text-2xl my-4">Sorting</h1>
  <div>
    <ul ref="parent" class="list">
      <li v-for="value in values" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
</template>

<style>
.list {
  height: 200px;
  overflow-y: scroll;
  touch-action: none;
  border: 2px solid #4f46e5;
}

.item {
  height: 100px;
  min-width: 300px;
  border: 2px solid #4f46e5;
  touch-action: none;
}
</style>
