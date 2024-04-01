<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
});

const [parent2, values2] = useDragAndDrop(["Cherry", "Grape", "Pineapple"], {
  group: "transfer",
  draggable: (el) => {
    return el.tagName === "LI";
  },
});

const [parent3, values3] = useDragAndDrop(
  ["Strawberry", "Watermelon", "Kiwi"],
  {
    group: "transfer",
    draggable: (el) => {
      return el.tagName === "LI";
    },
  }
);
</script>

<template>
  <h1 class="text-2xl my-4">Transfer</h1>
  <div class="flex justify-between">
    <div>
      <ul id="transfer_1" ref="parent1" class="p-5 bg-emerald-400 h-96 w-50">
        <li
          v-for="value in values1"
          :id="'transfer_1_' + value"
          :key="value"
          class="border-2 border-indigo-600 w-full text-center my-2"
        >
          {{ value }}
        </li>
        <span id="transfer_values_1" class="text-xs">
          {{ values1.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div>
      <ul id="transfer_2" ref="parent2" class="p-5 bg-emerald-400 h-96 w-50">
        <li
          v-for="value in values2"
          :id="'transfer_2_' + value"
          :key="value"
          class="border-2 border-indigo-600 w-full text-center my-2"
        >
          {{ value }}
        </li>
        <span id="transfer_values_2" class="text-xs">
          {{ values2.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
    <div>
      <ul id="transfer_3" ref="parent3" class="p-5 bg-emerald-400 h-96 w-50">
        <li
          v-for="value in values3"
          :id="'transfer_3_' + value"
          :key="value"
          class="border-2 border-indigo-600 w-full text-center my-2"
        >
          {{ value }}
        </li>
        <span id="transfer_values_3" class="text-xs">
          {{ values3.map((x) => x).join(" ") }}
        </span>
      </ul>
    </div>
  </div>
</template>
