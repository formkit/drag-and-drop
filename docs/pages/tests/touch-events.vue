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
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  touchstart: (e, state, originalTouchstart) => {
    originalTouchstart(e, state);
  },
  touchmove: (e, state, originalTouchmove) => {
    originalTouchmove(e, state);
  },
  touchend: (e, state, originalTouchend) => {
    originalTouchend(e, state);
  },
  transitClass: "transit",
  originClass: "origin",
  plugins: [dropZone({})],
});

dragAndDrop({
  parent: secondList,
  values: secondListValues,
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  originLeaveClass: "origin-leave",
  plugins: [dropZone({})],
});

dragAndDrop({
  parent: thirdList,
  values: thirdListValues,
  draggable: (child: HTMLElement) => {
    return child.classList.contains("item");
  },
  originLeaveClass: "origin-leave",
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
            <div class="ahhhhh">
              {{ item }}
            </div>
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
  margin-bottom: 1em;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
  position: static;
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
