<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { insert } from "../../../src/index";

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
  "before:block",
  'before:content-["Insert"]',
  "before:whitespace-nowrap",
  "before:block",
  "before:bg-blue-500",
  "before:py-1",
  "before:px-2",
  "before:rounded-full",
  "before:text-xs",
  "before:absolute",
  "before:top-1/2",
  "before:left-1/2",
  "before:-translate-y-1/2",
  "before:-translate-x-1/2",
  "before:text-white",
  "before:text-xs",
];

const [parent, values] = useDragAndDrop(
  ["Apple", "Banana", "Orange", "Strawberry", "Pineapple", "Grapes"],
  {
    plugins: [
      insert({
        insertPoint: (parent) => {
          const div = document.createElement("div");

          for (const cls of insertPointClasses) div.classList.add(cls);

          return div;
        },
      }),
    ],
  }
);
</script>

<template>
  <h2>Place Plugin</h2>
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
  <div id="randomElement">Random element</div>
</template>

<style scoped>
.item {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
  list-style-type: none;
}

.item.hover {
  position: relative;
}

.item.hover::before {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: green;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  display: flex;
  flex-direction: column;
  width: 300px;
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
