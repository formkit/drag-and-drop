<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../src/vue/index";
import { dropZone } from "../src/vue/dropZone";

let firstList = ref(null);

let firstListValues = ref(["Apple", "Banana", "Orange"]);

dragAndDrop({
  parent: firstList,
  values: firstListValues,
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  //drop: (e, state, originalDrop) => {
  //  console.log("drop 1", e);
  //  //originalDrop(e, state);
  //},
  //transitClass: "transit",
  originLeaveClass: "origin-leave",
  //dragstart: (nodeDragEvent, state, originalDragstart) => {
  //  originalDragstart(nodeDragEvent, state);
  //},
  //sort: (nodeDragEvent, state, originalSort) => {
  //  originalSort(nodeDragEvent, state);
  //},
  //dragleave: (dropZoneDragEvent, state, originalDragleave) => {
  //  originalDragleave(dropZoneDragEvent, state);
  //},
  //dragend: (nodeDragEvent, state, originalDragend) => {
  //  originalDragend(nodeDragEvent, state);
  //},
  plugins: [dropZone({})],
});

const testValues1 = computed(() => {
  return firstListValues.value.join(" ");
});
</script>

<template>
  <main>
    <div class="container">
      <div id="first_list" class="list" ref="firstList">
        <div
          v-for="item in firstListValues"
          :key="item"
          :id="item"
          class="item"
        >
          <div class="content">
            {{ item }}
          </div>
          <div v-if="item === 'Banana'" class="content">
            {{ item }}
          </div>
        </div>
        <div id="first_list_target"></div>
        <input
          ref="cartoon"
          type="text"
          :value="testValues1"
          id="first_list_values"
          class="values"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
#drag-leave-zone {
  margin-top: 100px;
  width: 200px;
  height: 200px;
  background-color: cyan;
}
.origin-leave {
  opacity: 0.5;
}
.transit .content {
  background-color: yellow;
}
.origin .content {
  background-color: green;
}
.container {
  display: flex;
}
.list {
  margin: 0 1em;
  border: 1px solid black;
  padding: 2em;
  min-width: 300px;
  height: 500px;
  position: relative;
}

.item {
  border: 1px solid blue;
}

.item.active .content {
  background-color: red;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
}

.values {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
}

#first_list_target,
#second_list_target {
  position: absolute;
  bottom: 25%;
}
</style>
