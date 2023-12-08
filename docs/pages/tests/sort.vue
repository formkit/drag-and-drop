<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../../../src/vue/index";

let sortableList = ref(null);
let sortableValues = ref(["Apple", "Banana", "Orange"]);

dragAndDrop([
  {
    parent: sortableList,
    values: sortableValues,
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
  },
]);

const sortableValuesTest = computed(() => {
  return sortableValues.value.join(" ");
});

function reset() {
  dragAndDrop([
    {
      parent: sortableList,
      values: sortableValues,
      draggable: (child: HTMLElement) => {
        return child.classList.contains("item");
      },
      sortable: false,
    },
  ]);
}
</script>

<template>
  <main>
    <header>
      <h3>Sort</h3>
    </header>
    <h3>List is sortable</h3>
    <div class="container">
      <div id="sortable" class="list" ref="sortableList">
        <h2>Sortable</h2>
        <div v-for="item in sortableValues" :key="item" :id="item" class="item">
          <div class="content">
            {{ item }}
          </div>
        </div>
        <input
          type="text"
          :value="sortableValuesTest"
          id="values"
          class="values"
        />
      </div>
    </div>
    <button id="reset" @click="reset">Reset</button>
  </main>
</template>

<style scoped>
#body-drop {
  margin-top: 3em;
  width: 200px;
  height: 50px;
}
header {
  margin: 2em 0;
}
.container {
  display: flex;
}
.list {
  margin: 0 1em;
  border: 1px solid black;
  padding: 2em;
  min-width: 300px;
}

.item {
  margin-bottom: 0.2em;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
}
</style>
