<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../../src/vue/index";
import { multiDrag } from "../../src/plugins/multiDrag";
import { animations } from "../../src";

let firstList = ref();
let secondList = ref();
let thirdList = ref();

let dropZone = ref(null);
let dropZone2 = ref(null);

let firstListValues = ref(["Apple", "Banana", "Orange"]);
let secondListValues = ref(["Pear", "Peach", "Grape"]);
let thirdListValues = ref(["Pineapple", "Kiwi", "Mango"]);

let showList1 = ref(true);

setTimeout(() => {
  showList1.value = false;
}, 2000);

onMounted(() => {
  //const el = document.getElementById("dropZone");

  //if (!(el instanceof HTMLElement)) return;

  dragAndDrop({
    parent: firstList,
    values: firstListValues,
    dropZoneClass: "opacity",
    group: "group a",
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
    plugins: [
      animations({
        duration: 200,
      }),
    ],
  });

  dragAndDrop({
    parent: secondList,
    values: secondListValues,
    dropZoneClass: "opacity",
    group: "group a",
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
    plugins: [
      animations({}),
      multiDrag({
        dropZoneClass: "opacity",
        selections: () => {
          return ["Pear"];
        },
      }),
    ],
  });

  dragAndDrop({
    parent: thirdList,
    values: thirdListValues,
    group: "group a",
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
  });
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

let showFirstList = ref(true);
</script>

<template>
  <main style="display: flex">
    <div class="container">
      <div id="test" ref="dropZoneHere"></div>
      <div id="first_list" class="list" ref="firstList" v-if="showFirstList">
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
    </div>
    <div v-if="true" class="container">
      <div id="second_list" class="list" ref="secondList">
        <div
          v-for="item in secondListValues"
          :key="item"
          :id="item"
          class="item"
        >
          <div class="content">
            {{ item }}
            <div class="handle">+</div>
          </div>
        </div>
        <div id="second_list_target"></div>
        <input
          ref="cartoon"
          type="text"
          :value="testValues2"
          id="second_list_values"
          class="values"
        />
      </div>
      <div v-if="false" class="container">
        <div id="third_list" class="list" ref="thirdList">
          <div
            v-for="item in thirdListValues"
            :key="item"
            :id="item"
            class="item"
          >
            <div class="content">
              {{ item }}
              <div class="handle">+</div>
            </div>
          </div>
          <div id="third_list_target"></div>
          <input
            ref="cartoon"
            type="text"
            :value="testValues3"
            id="third_list_vlaues"
            class="values"
          />
        </div>
      </div>
    </div>
    <div id="dropZone" style="position: absolute; bottom: 20%" ref="dropZone">
      Target
    </div>
  </main>
</template>

<style scoped>
.dragging-class .content {
  background-color: green !important;
}

#dropZone {
  width: 200px;
  height: 200px;
  background-color: red;
}

#dropZone2 {
  width: 200px;
  height: 200px;
  background-color: blue;
}

.opacity {
  opacity: 0.5;
}

#drag-leave-zone {
  margin-top: 100px;
  width: 200px;
  height: 200px;
  background-color: cyan;
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
  border: 1px solid white;
  height: 10em;
}

.item.active .content {
  background-color: red;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
  height: 100%;
  display: flex;
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

.handle {
  margin-left: auto;
  cursor: grab;
  padding: 0.5em;
  background-color: white;
  color: black;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5em;
}
</style>
