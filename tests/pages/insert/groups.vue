<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";
import { insert } from "../../../src/index";

function insertPoint() {
  return () => {
    const div = document.createElement("div");

    div.id = "insert-point";
    div.classList.add("insert-point");

    return div;
  };
}

const [parentA, valuesA] = useDragAndDrop(["Apple", "Banana"], {
  group: "produce",
  plugins: [insert({ insertPoint: insertPoint() })],
});

const [parentB, valuesB] = useDragAndDrop(["Cherry", "Date"], {
  group: "produce",
  plugins: [insert({ insertPoint: insertPoint() })],
});

const [parentC, valuesC] = useDragAndDrop(["Eggplant", "Fig"], {
  group: "other",
  plugins: [insert({ insertPoint: insertPoint() })],
});

const [parentD, valuesD] = useDragAndDrop(["Grape", "Kiwi"], {
  accepts: () => true,
  plugins: [insert({ insertPoint: insertPoint() })],
});

const [parentE, valuesE] = useDragAndDrop(["Honeydew", "Iceberg"], {
  plugins: [insert({ insertPoint: insertPoint() })],
});
</script>

<template>
  <h2>Insert Plugin — group validation</h2>
  <div class="page-container">
    <div>
      <h3>List A (group: produce)</h3>
      <ul ref="parentA" class="list">
        <li v-for="value in valuesA" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_a">{{ valuesA.join(" ") }}</span>
    </div>
    <div>
      <h3>List B (group: produce)</h3>
      <ul ref="parentB" class="list">
        <li v-for="value in valuesB" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_b">{{ valuesB.join(" ") }}</span>
    </div>
    <div>
      <h3>List C (group: other)</h3>
      <ul ref="parentC" class="list">
        <li v-for="value in valuesC" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_c">{{ valuesC.join(" ") }}</span>
    </div>
    <div>
      <h3>List D (accepts: always)</h3>
      <ul ref="parentD" class="list">
        <li v-for="value in valuesD" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_d">{{ valuesD.join(" ") }}</span>
    </div>
    <div>
      <h3>List E (no group)</h3>
      <ul ref="parentE" class="list">
        <li v-for="value in valuesE" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_e">{{ valuesE.join(" ") }}</span>
    </div>
  </div>
</template>

<style scoped>
.list {
  min-height: 40px;
}
</style>

<style>
.insert-point {
  position: absolute;
  background: blue;
  height: 4px;
  box-sizing: border-box;
}
</style>
