<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values] = useDragAndDrop(
  [
    "Apple",
    "Banana",
    "Orange",
    "Pear",
    "Grape",
    "Kiwi",
    "Mango",
    "Pineapple",
    "Strawberry",
    "Blueberry",
    "Raspberry",
    "Blackberry",
    "Cherry",
    "Peach",
    "Plum",
    "Pomegranate",
    "Watermelon",
    "Melon",
    "Lemon",
    "Lime",
    "Grapefruit",
    "Tangerine",
    "Papaya",
    "Passionfruit",
    "Carrot",
    "Broccoli",
    "Spinach",
    "Lettuce",
    "Cucumber",
    "Tomato",
    "Celery",
    "Asparagus",
    "Bell Pepper",
    "Cauliflower",
    "Eggplant",
    "Zucchini",
    "Onion",
    "Garlic",
    "Potato",
  ],
  {
    draggingClass: "blue",
  }
);

let count = 0;

onMounted(() => {
  // scroll element for testing
  const scrollable = document.documentElement;

  console.log("scrollable", scrollable);
  //scrollable?.scrollTo({ top: 1000, behavior: "smooth" });
});
</script>

<template>
  <h1>Sort</h1>
  <div class="outer">
    <ul ref="parent" class="list" id="test">
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
  <div class="spacer"></div>
</template>

<style>
.outer {
  width: 300px;
  height: 400px;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 1em;
}

body {
  width: 5000px;
  height: 5000px;
  overflow: auto;
}
.spacer {
  height: 1000px;
}
/*#test {
  overflow-y: scroll;
  height: 200px;
}*/
.blue {
  background-color: lightblue !important;
  color: yellow !important;
}
body {
  /*height: 10000px !important;*/
}
h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  /*display: flex;*/
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.teal {
  background-color: teal !important;
}

.yellow {
  background-color: yellow !important;
}
</style>
