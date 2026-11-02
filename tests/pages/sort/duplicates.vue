<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

// Two items are deep-equal on purpose (formkit/formkit#1754): sorting must
// never merge or drop them.
const [parent, values] = useDragAndDrop([
  { name: "one" },
  { name: "one" },
  { name: "two" },
]);
</script>

<template>
  <div class="page-container">
    <h1>Sort with duplicate values</h1>
    <ul ref="parent" class="list" id="test">
      <li
        v-for="(value, index) in values"
        :id="`item-${index}`"
        :key="index"
        class="item"
        tabindex="0"
      >
        {{ value.name }}
      </li>
    </ul>
    <div class="values">
      Values:
      <span id="sort_values">{{ values.map((x) => x.name).join(" ") }}</span>
    </div>
  </div>
</template>
