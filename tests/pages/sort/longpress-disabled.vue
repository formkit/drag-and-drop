<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

// longPress is intentionally NOT enabled: the longPressClass must never be
// applied, because the long press timer should not even be scheduled (#173).
const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  longPressClass: "long-press",
});
</script>

<template>
  <div class="page-container">
    <h1>Long press disabled</h1>
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
