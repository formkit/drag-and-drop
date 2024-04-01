<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"]);
</script>

<template>
  <h1>Sorting</h1>
  <div>
    <h3>Vertical sort</h3>
    <ul ref="parent">
      <li v-for="value in values" :id="value" :key="value">
        {{ value }}
      </li>
    </ul>
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
    <h3>Horizontal sort</h3>
    <ul ref="parent">
      <li v-for="value in values" :id="value" :key="value">
        {{ value }}
      </li>
    </ul>
  </div>
</template>
