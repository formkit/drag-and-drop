<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "../../../src/vue/index";
import { dropOrSwap } from "../../../src/index";

const acceptsCalls = ref(0);

const sharedConfig = {
  dropZoneClass: "dropZone",
  dropZoneParentClass: "dropZoneParent",
  synthDropZoneClass: "synthDropZone",
  synthDropZoneParentClass: "synthDropZoneParent",
};

const [parentA, valuesA] = useDragAndDrop(["Apple", "Banana"], {
  ...sharedConfig,
  group: "g1",
  plugins: [dropOrSwap({})],
});

const [parentB, valuesB] = useDragAndDrop(["Cherry", "Date"], {
  ...sharedConfig,
  group: "g1",
  plugins: [dropOrSwap({})],
});

const [parentC, valuesC] = useDragAndDrop(["Eggplant", "Fig"], {
  ...sharedConfig,
  group: "g2",
  plugins: [dropOrSwap({})],
});

const [parentD, valuesD] = useDragAndDrop(["Grape", "Kiwi"], {
  ...sharedConfig,
  accepts: () => {
    acceptsCalls.value++;
    return true;
  },
  plugins: [dropOrSwap({})],
});

const [parentE, valuesE] = useDragAndDrop(["Honeydew", "Iceberg"], {
  ...sharedConfig,
  plugins: [dropOrSwap({})],
});
</script>

<template>
  <h2>dropOrSwap — group validation</h2>
  <div class="page-container">
    <div>
      <h3>List A (group: g1)</h3>
      <ul id="list_a" ref="parentA" class="list">
        <li v-for="value in valuesA" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_a">{{ valuesA.join(" ") }}</span>
    </div>
    <div>
      <h3>List B (group: g1)</h3>
      <ul id="list_b" ref="parentB" class="list">
        <li v-for="value in valuesB" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_b">{{ valuesB.join(" ") }}</span>
    </div>
    <div>
      <h3>List C (group: g2)</h3>
      <ul id="list_c" ref="parentC" class="list">
        <li v-for="value in valuesC" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_c">{{ valuesC.join(" ") }}</span>
    </div>
    <div>
      <h3>List D (accepts: counts and allows)</h3>
      <ul id="list_d" ref="parentD" class="list">
        <li v-for="value in valuesD" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_d">{{ valuesD.join(" ") }}</span>
      <span id="accepts_calls">{{ acceptsCalls }}</span>
    </div>
    <div>
      <h3>List E (no group)</h3>
      <ul id="list_e" ref="parentE" class="list">
        <li v-for="value in valuesE" :id="value" :key="value" class="item">
          {{ value }}
        </li>
      </ul>
      <span id="values_e">{{ valuesE.join(" ") }}</span>
    </div>
  </div>
</template>
