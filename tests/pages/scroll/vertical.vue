<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const fruits = [
  "Apple",
  "Banana",
  "Orange",
  "Strawberry",
  "Grape",
  "Mango",
  "Pineapple",
  "Blueberry",
  "Watermelon",
  "Peach",
  "Cherry",
  "Kiwi",
  "Lemon",
  "Lime",
  "Papaya",
  "Pomegranate",
  "Raspberry",
  "Blackberry",
  "Cantaloupe",
  "Avocado",
];

const [parent, values] = useDragAndDrop(fruits, {
  nativeDrag: false,
  onDragstart: (data) => {
    //console.log("data", data);
    //console.trace();
  },
  onSort: (data) => {
    //console.log("data", data);
  },
  onDragend: (data) => {
    //console.log("data", data);
  },
});
</script>

<template>
  <div class="container">
    <div class="scroll" style="height: 500px; overflow-y: scroll">
      <div style="height: 200px" ref="parent">
        <div v-for="i in values" :key="i" class="item">{{ i }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
