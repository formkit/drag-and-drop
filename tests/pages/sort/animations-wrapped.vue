<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { animations } from "../../../src/index";

const [parent, values] = useDragAndDrop(
  ["Apple", "Banana", "Orange", "Strawberry", "Pineapple", "Grapes"],
  {
    plugins: [animations()],
    dropZoneClass: "dropZone",
  }
);
</script>

<template>
  <h2>Wrapped</h2>
  <div>
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
  </div>
</template>

<style scoped>
.dropZone {
  background-color: aqua !important;
}
.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  display: flex;
  flex-wrap: wrap;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 400px;
  height: 50px;
}

.item:nth-child(odd) {
  width: 100px;
}

h1 {
  font-size: 1.5em;
  margin-bottom: 2em;
}

h2 {
  font-size: 1em;
  margin-bottom: 1em;
}

p {
  margin-bottom: 2em;
}

.divider {
  margin: 5em 0;
  border-bottom: 1px solid #ccc;
}
</style>
