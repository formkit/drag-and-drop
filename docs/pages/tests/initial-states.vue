<script setup lang="ts">
import { ref, onMounted } from "vue";
import { computed } from "vue";
import { dragAndDrop } from "../../../src/vue/index";

let firstList = ref(null);
let firstListValues = ref(["Apple", "Banana", "Orange"]);
let secondList = ref(null);
let secondListValues = ref(["Pear", "Strawberry"]);
let thirdList = ref(null);
let thirdListValues = ref(["Peach", "Grape"]);
let fourthListValues = ref(["Watermelon", "Kiwi", "Mango"]);

const showThirdList = ref(false);

dragAndDrop({
  parent: firstList,
  values: firstListValues,
});

dragAndDrop({
  parent: thirdList,
  values: thirdListValues,
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
const testValues4 = computed(() => {
  return fourthListValues.value.join(" ");
});

onMounted(() => {
  dragAndDrop({
    parent: secondList,
    values: secondListValues,
  });

  setTimeout(() => {
    showThirdList.value = true;
  }, 1000);

  const fourthList = document.getElementById("fourth_list");
  if (!fourthList) {
    return;
  }
  dragAndDrop({
    parent: fourthList,
    values: fourthListValues,
  });
});
</script>

<template>
  <main>
    <div>
      <h3>dragAndDrop called in setup script with ref</h3>
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
        </div>
      </div>
      <input type="text" :value="testValues1" id="values_1" class="values" />
    </div>
    <div>
      <h3>dragAndDrop called onMounted with ref</h3>
      <div class="container">
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
        </div>
      </div>
      <input type="text" :value="testValues2" id="values_2" class="values" />
    </div>
    <div v-if="showThirdList">
      <h3>
        dragAndDrop called in setup script, and element renders after one second
        after onMounted
      </h3>
      <div class="container">
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
        </div>
      </div>
      <input type="text" :value="testValues3" id="values_3" class="values" />
    </div>
    <div>
      <h3>dragAndDrop called on mounted, directly passes HTMLElement</h3>
      <div class="container">
        <div id="fourth_list" class="list" ref="fourthList">
          <div
            v-for="item in fourthListValues"
            :key="item"
            :id="item"
            class="item"
          >
            <div class="content">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <input type="text" :value="testValues4" id="values_4" class="values" />
    </div>
  </main>
</template>

<style scoped>
.values {
  margin-bottom: 2em;
}
.transit .content {
  background-color: purple;
}
.origin .content {
  background-color: green;
}

.destination .content {
  background-color: blue;
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

.item.selected .content {
  background-color: red;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
}
</style>
