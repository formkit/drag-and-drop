<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { place } from "../../../src/index";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  plugins: [place()],
  dropZoneClass: "dropZone",
  group: "transfer",
});

const [parent2, values2] = useDragAndDrop(["Tomato", "Potato", "Onion"], {
  plugins: [place()],
  dropZoneClass: "dropZone",
  group: "transfer",
});
</script>

<template>
  <h2>Place Plugin</h2>
  <div class="flex-wrap">
    <div class="container">
      <ul id="list_1" ref="parent1" class="list">
        <li v-for="value in values1" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <div class="values">
        Values:
        <span id="values_1">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </div>
    </div>
    <div>
      <h2>Place Plugin</h2>
      <div class="container">
        <ul id="list_2" ref="parent2" class="list">
          <li v-for="value in values2" :id="value" :key="value" class="item">
            {{ value }}
          </li>
        </ul>
        <div class="values">
          Values:
          <span id="values_2">
            {{ values2.map((x) => x).join(" ") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropZone {
  background-color: teal !important;
}
.item {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
  list-style-type: none;
}

.list {
  list-style-type: none;
  width: 1400px;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
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
  /* font-size: 0.9em; */
}

.divider {
  margin: 5em 0;
  border-bottom: 1px solid #ccc;
}
</style>
