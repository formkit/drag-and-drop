<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../../../src/vue/index";
import { dropZone } from "../../../src/vue/dropZone";

let firstList = ref(null);
let secondList = ref(null);
let thirdList = ref(null);

const allValues = ref({});
</script>

<template>
  <div>
    <div>
      <h2>First List</h2>
      <ul ref="firstList">
        <li v-for="(item, index) in allValues" :key="index" class="item">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
