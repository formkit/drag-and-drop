<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const lists = ref([
  {
    id: 1,
    name: "Groceries",
    items: [
      {
        id: 1,
        name: "Fruits",
        items: [
          { id: 1, name: "Apples" },
          { id: 2, name: "Bananas" },
          { id: 3, name: "Cherries" },
        ],
      },
      {
        id: 2,
        name: "Vegetables",
        items: [
          { id: 1, name: "Carrots" },
          { id: 2, name: "Broccoli" },
          { id: 3, name: "Spinach" },
        ],
      },
      {
        id: 3,
        name: "Dairy",
        items: [
          { id: 1, name: "Milk" },
          { id: 2, name: "Cheese" },
          { id: 3, name: "Yogurt" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Books to Read",
    items: [
      {
        id: 1,
        name: "Fiction",
        items: [
          { id: 1, name: "The Great Gatsby" },
          { id: 2, name: "To Kill a Mockingbird" },
          { id: 3, name: "1984" },
        ],
      },
      {
        id: 2,
        name: "Non-Fiction",
        items: [
          { id: 1, name: "Sapiens" },
          { id: 2, name: "Educated" },
          { id: 3, name: "The Immortal Life of Henrietta Lacks" },
        ],
      },
      {
        id: 3,
        name: "Science Fiction",
        items: [
          { id: 1, name: "Dune" },
          { id: 2, name: "Ender's Game" },
          { id: 3, name: "Neuromancer" },
        ],
      },
    ],
  },
]);

const parent = ref();

dragAndDrop({
  parent,
  values: lists,
  dropZoneClass: "!bg-lime-200",
  treeGroup: "primary",
  treeAncestor: true,
});
</script>

<template>
  <h2>Nested Example</h2>
  <div ref="parent" id="main-parent">
    <List v-for="list in lists" :key="list.id" :list="list" />
  </div>
  <div>
    <div id="values">
      {{ lists }}
    </div>
  </div>
</template>

<style scoped></style>
