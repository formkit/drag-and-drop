<script setup lang="ts">
import { DNDList } from "../../../src/vue/hoc";

const items = ref(["Apple", "Banana", "Orange"]);

//setTimeout(() => {
//  console.log("items", items);
//  items.value = [1, 2, 3];
//}, 3000);
</script>

<template>
  <div>
    <DNDList v-model="items" :sortable="false">
      <div v-for="item in items" :key="item">
        {{ item }}
      </div>
    </DNDList>
  </div>
</template>

<style>
.test {
  background-color: yellow;
}
</style>
