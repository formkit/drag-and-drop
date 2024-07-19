<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";
import { insertion } from "../../../src";
import { NestedGroup, NestedList } from "../../../src/vue";

import List from "../../components/List.vue";
import ListItem from "../../components/ListItem.vue";
import ListSubItem from "../../components/ListSubItem.vue";

import { provide } from "vue";

const lists = ref([
  {
    id: 1,
    name: "Groceries",
    items: [
      {
        id: 1,
        name: "Fruits",
        subitems: [
          { id: 1, name: "Apples" },
          { id: 2, name: "Bananas" },
          { id: 3, name: "Cherries" },
        ],
      },
      {
        id: 2,
        name: "Vegetables",
        subitems: [
          { id: 1, name: "Carrots" },
          { id: 2, name: "Broccoli" },
          { id: 3, name: "Spinach" },
        ],
      },
      {
        id: 3,
        name: "Dairy",
        subitems: [
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
        subitems: [
          { id: 1, name: "The Great Gatsby" },
          { id: 2, name: "To Kill a Mockingbird" },
          { id: 3, name: "1984" },
        ],
      },
      {
        id: 2,
        name: "Non-Fiction",
        subitems: [
          { id: 1, name: "Sapiens" },
          { id: 2, name: "Educated" },
          { id: 3, name: "The Immortal Life of Henrietta Lacks" },
        ],
      },
      {
        id: 3,
        name: "Science Fiction",
        subitems: [
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
  group: "nested",
  plugins: [insertion()],
});
</script>

<template>
  <h2>Nested Example</h2>
  <NestedGroup name="nested-items" ref="parent">
    <List v-for="list in lists" :key="list.id" :list="list" />
  </NestedGroup>
</template>

<style scoped></style>
