<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"]);
</script>

<template>
  <div>
    <ul ref="parent" class="list">
      <li v-for="value in values" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
    <span id="teardown_values">{{ values.join(" ") }}</span>
  </div>
</template>
