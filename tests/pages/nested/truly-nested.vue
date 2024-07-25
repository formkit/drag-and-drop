<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";
import { insertion, parents } from "../../../src/index";

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
  treeGroup: "nested",
  treeAncestor: true,
  group: "nested",
  plugins: [
    insertion({
      boundary: "#main-parent",
    }),
  ],
});

onMounted(() => {
  setTimeout(() => {
    // console.log("show me this", parents);
  }, 4000);
});
</script>

<template>
  <h2>Truly Nested Tree data Example</h2>
  <div ref="parent" id="main-parent">
    <TrulyNestedList
      v-for="list in lists"
      :id="list.name"
      :key="list.id + list.name"
      :list="list"
    />
  </div>
  <!-- <NestedGroup name="nested-items" ref="parent">
    <List v-for="list in lists" :key="list.id" :list="list" />
  </NestedGroup> -->
</template>

<style scoped></style>
