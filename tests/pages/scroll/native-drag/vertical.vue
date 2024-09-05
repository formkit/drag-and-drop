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

const [parent, values] = useDragAndDrop(fruits);

const vegetables = [
  "Carrot",
  "Broccoli",
  "Cauliflower",
  "Spinach",
  "Kale",
  "Cabbage",
  "Lettuce",
  "Beet",
  "Radish",
  "Turnip",
  "Onion",
  "Garlic",
  "Potato",
  "Sweet Potato",
  "Yam",
  "Zucchini",
  "Squash",
  "Pumpkin",
  "Tomato",
  "Bell Pepper",
];

const [parent2, values2] = useDragAndDrop(vegetables);
</script>

<template>
  <h2>Native drag: Vertical scroll</h2>
  <p>
    Testing that native scroll works when dragging vertically without using
    synthetic events.
  </p>
  <div class="container" style="display: flex">
    <div class="scroll" style="height: 500px; overflow-y: scroll">
      <div style="height: 200px" ref="parent" id="parent">
        <div v-for="i in values" :key="i" :id="i" class="item">
          <span :id="i + 'world'">{{ i }}</span>
        </div>
      </div>
    </div>
    <div class="scroll" style="height: 500px; overflow-y: scroll">
      <div style="height: 200px" ref="parent2" id="parent2">
        <div v-for="i in values2" :key="i" :id="i" class="item">
          <span :id="i + 'hello'">{{ i }}</span>
        </div>
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
