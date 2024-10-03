<script setup lang="ts">
import { useDragAndDrop } from "../../../../src/vue/index";

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

const vegetables = [
  "Carrot",
  "Broccoli",
  "Cauliflower",
  "Corn",
  "Cucumber",
  "Pepper",
  "Onion",
  "Garlic",
  "Potato",
  "Spinach",
  "Tomato",
  "Zucchini",
  "Celery",
  "Lettuce",
  "Mushroom",
  "Pumpkin",
  "Radish",
  "Turnip",
  "Beet",
  "Asparagus",
];

const [parent, values] = useDragAndDrop(fruits, {
  nativeDrag: false,
  group: "fruits",
});

const [parent2, values2] = useDragAndDrop(vegetables, {
  nativeDrag: false,
  group: "fruits",
});
</script>

<template>
  <h2 class="mb-4">
    Synthetic scroll. Should be able to scroll synthetically.
  </h2>
  <div class="container">
    <div class="scroll">
      <div
        style="height: 400px; overflow: scroll"
        ref="parent"
        class="parent"
        id="parent"
      >
        <div v-for="i in values" :key="i" class="item">{{ i }}</div>
      </div>
    </div>
    <div class="scroll">
      <div
        style="height: 400px; overflow: scroll"
        ref="parent2"
        class="parent"
        id="parent2"
      >
        <div v-for="i in values2" :key="i" class="item">{{ i }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
.mb-4 {
  margin-bottom: 2rem;
}
.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
