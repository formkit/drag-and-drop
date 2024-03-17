<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"]);
</script>

<template>
  <h1 class="text-2xl my-4">Sorting</h1>
  <div>
    <ul ref="parent">
      <li
        v-for="value in values"
        :id="value"
        :key="value"
        class="border-2 border-indigo-600 w-1/4 text-center my-2"
      >
        {{ value }}
      </li>
    </ul>
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
</template>
