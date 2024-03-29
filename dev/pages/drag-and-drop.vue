<script setup lang="ts">
import { ref } from "vue";
import { dragAndDrop } from "../../src/vue/index";

const items = ref(["Item 1", "Item 2", "Item 3"]);

const parent = ref();

dragAndDrop({
  parent,
  values: items,
});
</script>

<template>
  <div ref="parent">
    <div v-for="item in items" :key="item" class="item">
      {{ item }}
    </div>
  </div>
</template>
