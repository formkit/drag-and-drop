<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue/index";

const parent1: Ref<HTMLElement | undefined> = ref(undefined);

const values1 = ref(["Apple", "Banana", "Orange"]);

dragAndDrop({
  parent: parent1,
  values: values1,
  activeDescendantClass: "activeDescendantClass",
  selectedClass: "selectedClass",
});
</script>

<template>
  <h1>Selections</h1>
  <p>Change this</p>
  <div class="outside-container">
    <ul ref="parent1" class="list" id="list-1">
      <li v-for="value in values1" :id="value" :key="value" class="item">
        {{ value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.outside-container {
  padding: 20px;
  background-color: purple;
  position: absolute;
  left: 20px;
}

.activeDescendantClass {
  border-color: red !important;
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
  background-color: yellow;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
