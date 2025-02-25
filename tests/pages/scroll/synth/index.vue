<template>
  <div class="modal-container">
    <div class="modal">
      <div class="modal-content" ref="parent">
        <div v-for="item in items" :key="item.id" class="list-item">
          <div class="long-content">{{ item.text }} - {{ item.longText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { dragAndDrop } from "../../../../src/vue/index";

const parent = ref<HTMLElement | null>(null);

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

const items = ref(
  Array.from({ length: 100 }, (_, i) => {
    const fruit = fruits[i % fruits.length];
    const vegetable = vegetables[i % vegetables.length];
    return {
      id: i + 1,
      text: `${fruit} & ${vegetable}`,
      longText:
        `This delicious combination of ${fruit} and ${vegetable} creates an amazing flavor profile. `.repeat(
          5
        ),
    };
  })
);

dragAndDrop({
  parent,
  values: items,
});
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  background: white;
  width: 300px;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content {
  padding: 20px;
  height: 100%;
  overflow: auto;
}

.list-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  white-space: nowrap;
}

.long-content {
  display: inline-block;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f5f5f5;
}
</style>
