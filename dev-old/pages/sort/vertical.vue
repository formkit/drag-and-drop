<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"]);
</script>

<template>
  <h1 class="text-sm">Vertical Sort</h1>
  <div>
    <ul ref="parent">
      <li v-for="value in values" :id="value" :key="value">
        {{ value }}
      </li>
    </ul>
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
</template>
