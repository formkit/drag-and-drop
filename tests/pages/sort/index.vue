<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  draggingClass: "blue",
});

onMounted(() => {
  // Set initial scroll positions for testing
  //document.documentElement.scrollTo(2000, 2000);
});
</script>

<template>
  <div class="page-container">
    <h1>Sort</h1>

    <!-- Horizontal scrollable container -->
    <ul ref="parent" class="list" id="test">
      <li
        v-for="value in values"
        :id="value"
        :key="value"
        class="item"
        tabindex="0"
      >
        <input type="text" :value="value" />
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
/* Make the HTML tag scrollable in both directions */
html {
}

body {
  margin: 0;
  padding: 20px;
}

.page-container {
  position: relative;
}

/* Horizontal scrollable container */
.horizontal-scroll {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 2em;
}

.scroll-content {
  display: flex;
  gap: 2em;
  padding: 1em;
  min-width: 150%;
}
.placeholder-content {
  min-height: 1000px;
  padding: 1em;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: #666;
}

.blue {
  background-color: lightblue !important;
  color: yellow !important;
}

h1 {
  margin-bottom: 1em;
  position: sticky;
  top: 0;
  background: white;
  padding: 1em 0;
  z-index: 10;
}

.list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 2em 0;
  height: fit-content;
}

.item {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  cursor: move;
}

.item:hover {
  background: #f5f5f5;
}

.teal {
  background-color: teal !important;
}

.yellow {
  background-color: yellow !important;
}
</style>
