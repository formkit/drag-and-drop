<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../../../src/vue/index";
import { dropZone } from "../../../src/vue/dropZone";

let firstList = ref(null);
let secondList = ref(null);
let thirdList = ref(null);

let firstListValues = ref(["Apple", "Banana", "Orange"]);
let secondListValues = ref(["Pear", "Strawberry"]);
let thirdListValues = ref(["Peach", "Grape"]);

dragAndDrop({
  parent: firstList,
  values: firstListValues,
  draggingClass: "dragging item",
  dropZoneClass: "dropZone item",
  touchDraggingClass: "dragging",
  touchDropZoneClass: "dropZone",
  longTouch: true,
  longTouchClass: "longTouch",
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  plugins: [dropZone({})],
});

dragAndDrop({
  parent: secondList,
  values: secondListValues,
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  plugins: [
    dropZone({
      transfer(e, state, originalTransfer) {
        originalTransfer(e, state);
      },
      drop(e, state, originalDrop) {
        originalDrop(e, state);
      },
    }),
  ],
});

dragAndDrop({
  parent: thirdList,
  values: thirdListValues,
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  plugins: [dropZone()],
});

const testValues1 = computed(() => {
  return firstListValues.value.join(" ");
});

const testValues2 = computed(() => {
  return secondListValues.value.join(" ");
});

const testValues3 = computed(() => {
  return thirdListValues.value.join(" ");
});

function reset() {
  dragAndDrop({
    parent: secondList,
    values: secondListValues,
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
  });

  dragAndDrop({
    parent: thirdList,
    values: thirdListValues,
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
  });
}
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
      <div id="second_list" class="list" ref="secondList">
        <div
          v-for="item in secondListValues"
          :key="item"
          :id="item"
          class="item"
        >
          <div class="content">
            {{ item }}
          </div>
        </div>
        <div id="second_list_target"></div>
        <input
          type="text"
          :value="testValues2"
          id="second_list_values"
          class="values"
        />
      </div>
      <div id="third_list" class="list" ref="thirdList">
        <div
          v-for="item in thirdListValues"
          :key="item"
          :id="item"
          class="item"
        >
          <div class="content">
            {{ item }}
          </div>
        </div>
        <div id="third_list_target"></div>
        <input
          type="text"
          :value="testValues3"
          id="third_list_values"
          class="values"
        />
      </div>
    </div>
    <button @click="reset" id="reset">Reset</button>
    <div id="drag-leave-zone"></div>
  </main>
</template>

<style>
.longTouch .content {
  background-color: purple;
}
.dragging .content {
  color: red !important;
}

.dropZone .content {
  color: blue !important;
}

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
  height: 500px;
  width: 100%;
  position: relative;
}

.item {
  margin-bottom: 1em;
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
