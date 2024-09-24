<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { swap } from "../../../src/index";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
  plugins: [swap()],
  dropZoneClass: "yellow",
  draggingClass: "teal",
});
</script>

<template>
  <h1>Swap</h1>
  <div class="flex-wrap">
    <div>
      <ul id="transfer_1" ref="parent1" class="list">
        <li v-for="value in values1" :id="value" :key="value" class="item">
          {{ value }}
        </li>
        <span id="values_1" class="text-xs">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
  height: 6000px;
}

.item {
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

.yellow {
  background-color: yellow;
}

.teal {
  background-color: teal !important;
}
</style>
