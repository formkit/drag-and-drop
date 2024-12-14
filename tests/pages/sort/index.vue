<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  draggingClass: "blue",
});

onMounted(() => {
  console.log(document.body.style.overflowY);
  // scroll element for testing
  const scrollable = document.documentElement;
  //scrollable?.scrollTo({ top: 1000, behavior: "smooth" });
});
</script>

<template>
  <h1>Sort</h1>
  <div>
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

<style scoped>
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
