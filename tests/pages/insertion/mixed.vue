<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { insertion } from "../../../src/index";

const [parent, values] = useDragAndDrop(
  ["Apple", "Banana", "Strawberry", "Pineapple", "Watermelon", "Grape"],
  {
    plugins: [insertion()],
    dropZoneClass: "hover",
  }
);

// setTimeout(() => {
//   console.log("parent", parent.value);
// }, 2000);
</script>

<template>
  <h2>Insertion Plugin</h2>
  <div>
    <ul ref="parent" class="list">
      <div v-for="value in values" :id="value" :key="value" class="item">
        <div>
          {{ value }}
        </div>
      </div>
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
.vertical {
  display: flex;
  flex-direction: column;
}
.list {
  list-style-type: none;
  width: 600px;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2em;
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
  width: 100px;
  margin: 0 1em;
  height: 50px;
  margin-bottom: 2em;
}

.item:nth-child(1) {
  width: 600px;
}

.item:nth-child(6) {
  width: 600px;
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
