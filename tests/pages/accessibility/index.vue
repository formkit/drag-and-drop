<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const parent1: Ref<HTMLElement | undefined> = ref(undefined);
const parent2: Ref<HTMLElement | undefined> = ref(undefined);
const parent3: Ref<HTMLElement | undefined> = ref(undefined);

const values1 = ref(["Apple", "Banana", "Orange"]);
const values2 = ref(["Strawberry", "Blueberry", "Raspberry"]);
const values3 = ref(["Pineapple", "Mango", "Kiwi"]);

dragAndDrop({
  parent: parent1,
  values: values1,
  onDragstart: (e) => {
    console.log("drag started");
  },
  activeDescendantClass: "activeDescendantClass",
  selectedClass: "selectedClass",
});

dragAndDrop({
  parent: parent2,
  values: values2,
  onDragstart: (e) => {
    console.log("drag started");
  },
  activeDescendantClass: "activeDescendantClass",
  selectedClass: "selectedClass",
});

dragAndDrop({
  parent: parent3,
  values: values3,
  onDragstart: (e) => {
    console.log("drag started");
  },
  activeDescendantClass: "activeDescendantClass",
  selectedClass: "selectedClass",
});
</script>

<template>
  <h1>Accessibility</h1>
  <h3></h3>
  <ul ref="parent1" class="list" id="list-1">
    <li v-for="value in values1" :id="value" :key="value" class="item">
      {{ value }}
    </li>
  </ul>
  <ul ref="parent2" class="list" id="list-2">
    <li v-for="value in values2" :id="value" :key="value" class="item">
      {{ value }}
    </li>
  </ul>
  <ul ref="parent3" class="list" id="list-3">
    <li v-for="value in values3" :id="value" :key="value" class="item">
      {{ value }}
    </li>
  </ul>
</template>

<style scoped>
.activeDescendantClass {
  border-color: red !important;
}

.selectedClass {
  background-color: red;
}

body {
<<<<<<< HEAD
  height: 10000px !important;
=======
  /*height: 10000px !important;*/
>>>>>>> release/v0.2.0
}

h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
