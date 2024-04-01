<script setup lang="ts">
import { useDragAndDrop } from "../../../../src/vue/index";
import { animations } from "../../../../src/index";

const [parent, values] = useDragAndDrop(
  [
    {
      label: "Apple",
      value: "Apple",
      class: "small",
    },
    {
      label: "Banana",
      value: "Banana",
    },
    {
      label: "Orange",
      value: "Orange",
    },
  ],
  {
    plugins: [animations()],
  }
);
</script>

<template>
  <h1>Uneven Vertical Sort</h1>
  <div>
    <ul ref="parent" class="list">
      <li
        v-for="(value, index) in values"
        :id="value.value"
        :key="value.value"
        :class="value.class ? 'item-small' : 'item'"
      >
        {{ value.value }}
      </li>
    </ul>
    <div class="values">
      Values:
      <span id="sort_values">
        {{ values.map((x) => x.label).join(" ") }}
      </span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
  width: 50%;
}

.item,
.item-small {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 200px;
}

.item-small {
  height: 50px;
}
</style>
