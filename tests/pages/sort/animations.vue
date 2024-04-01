<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { animations } from "../../../src/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  plugins: [animations()],
});
</script>

<template>
  <h1>Vertical Sort Animations</h1>
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
h1 {
  margin-bottom: 1em;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  margin-bottom: 2em;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
../../../src/vue/index../../../src/index
