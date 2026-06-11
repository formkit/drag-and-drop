<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { animations } from "../../../src/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  plugins: [
    animations({ duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }),
  ],
});
</script>

<template>
  <div class="page-container">
    <h1>Animations easing</h1>
    <ul ref="parent" class="list">
      <li v-for="value in values" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
    <div class="values">
      Values:
      <span id="sort_values">
        {{ values.map((x) => x).join(" ") }}
      </span>
    </div>
  </div>
</template>
