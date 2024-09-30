<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  group: "transfer",
  selectedClass: "selected",
  activeDescendantClass: "active",
  draggable: (el) => {
    return el.tagName === "LI";
  },
});

const [parent2, values2] = useDragAndDrop(["Carrot", "Broccoli", "Potato"], {
  group: "transfer",
  selectedClass: "selected",
  activeDescendantClass: "active",
  draggable: (el) => {
    return el.tagName === "LI";
  },
});
</script>

<template>
  <h1 id="title">Native selections multi-select</h1>
  <div class="flex-wrap">
    <div>
      <ul id="fruits" ref="parent1" class="list" aria-label="fruits">
        <li
          v-for="value in values1"
          :id="value"
          :key="value"
          class="item"
          :aria-label="value"
        >
          {{ value }}
        </li>
        <span id="values_1" class="text-xs">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div>
      <ul id="vegetables" ref="parent2" class="list" aria-label="vegetables">
        <li v-for="value in values2" :id="value" :key="value" class="item">
          {{ value }}
        </li>
        <span id="values_2" class="text-xs">
          {{ values2.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.active {
  border: 5px solid red !important;
}

.selected {
  background-color: red !important;
  border: 5px solid red !important;
}

.flex-wrap {
  display: flex;
}

h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  padding: 2em;
  width: 100%;
  background-color: grey;
}

.item {
  background-color: white;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  width: 200px;
  border-radius: 5px;
  height: 200px;
}

.item-small {
  height: 50px;
}
</style>
