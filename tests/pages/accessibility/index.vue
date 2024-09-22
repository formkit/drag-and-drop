<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const parent: Ref<HTMLElement | undefined> = ref(undefined);

const values = ref(["Apple", "Banana", "Orange"]);

dragAndDrop({
  parent,
  values,
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
  <ul ref="parent" class="list">
    <li v-for="value in values" :id="value" :key="value" class="item">
      {{ value }}
    </li>
  </ul>
  <div class="values">
    Values:
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
</template>

<style>
.activeDescendantClass {
  background-color: lightblue;
}

.selectedClass {
  background-color: red;
}

body {
  height: 10000px !important;
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
