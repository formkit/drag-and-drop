<script setup lang="ts">
import { useDragAndDrop, dragAndDrop } from "../../src/vue/index";
import {
  parents,
  parentValues,
  dragValues,
  setParentValues,
  handleEnd,
  dropOrSwap,
} from "@formkit/drag-and-drop";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
  dropZoneClass: "dropZone",
  synthDropZoneClass: "synthDropZone",
});

console.log(parents);

const [parent2, values2] = useDragAndDrop(["Cherry", "Grape", "Pineapple"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
  dropZoneClass: "dropZone",
  synthDropZoneClass: "synthDropZone",
});

const [parent3, values3] = useDragAndDrop(
  ["Strawberry", "Watermelon", "Kiwi"],
  {
    group: "transfer",
    draggable: (el) => {
      return el.tagName === "LI";
    },
    dropZoneClass: "dropZone",
    plugins: [dropOrSwap()],
  }
);
const parent = ref();

dragAndDrop({
  parent,
  values: ["Apple", "Banana", "Orange"],
  handleEnd: () => {
    console.log("handleEnd");
  },
});
</script>

<template>
  <h1>Transfer</h1>
  <div class="flex-wrap">
    <div>
      <ul id="transfer_1" ref="parent1" class="list" aria-label="list1">
        <li v-for="value in values1" :id="value" :key="value" class="item">
          {{ value }}
        </li>
        <span id="values_1" class="text-xs">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div>
      <ul id="2" ref="parent2" class="list" aria-label="list2">
        <li v-for="value in values2" :id="value" :key="value" class="item">
          {{ value }}
        </li>
        <span id="values_2" class="text-xs">
          {{ values2.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div>
      <ul id="3" ref="parent3" class="list">
        <li v-for="value in values3" :id="value" :key="value" class="item">
          {{ value }}
        </li>
        <span id="values_3" class="text-xs">
          {{ values3.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dragging {
  background-color: blue;
}
.dropZone {
  background-color: red;
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
  width: 100%;
  font-size: 0.5em;
}

.item {
  padding: 2px;
  margin: 5px;
  border: 1px solid #ccc;
  width: 100px;
  border-radius: 5px;
  height: 100px;
}

.item-small {
  height: 50px;
}
</style>
