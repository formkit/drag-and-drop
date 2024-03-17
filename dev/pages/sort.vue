<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";
import { animations } from "../../src/index";

const values = ["Apple", "Banana", "Orange"];

const [parent, reactiveValues] = useDragAndDrop(values, {
  //threshold: {
  //  horizontal: 0.5,
  //  vertical: 0.5,
  //},
});

//console.log("parent", parent);
//console.log("values", values);
</script>

<template>
  <h1 class="text-2xl my-4">Sorting</h1>
  <div>
    <ul ref="parent">
      <li
        v-for="value in reactiveValues"
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
