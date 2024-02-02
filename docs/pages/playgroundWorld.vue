<script setup lang="ts">
import { computed } from "vue";
import { dragAndDrop } from "../../src/vue/index";
//import { animate } from "../../src/plugins/animations";

let firstList = ref();

let firstListValues = ref(["China", "United States of AMERICA", "India"]);

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
    group: "group a",
    threshold: {
      horizontal: 0.5,
      vertical: 0.5,
    },
    draggable: (child: HTMLElement) => {
      return child.classList.contains("item");
    },
  });
});
</script>

<template>
  <main style="display: flex">
    <div class="container">
      <h1>Playground</h1>
      <div class="list" ref="firstList">
        <div v-for="item in firstListValues" :key="item" class="item">
          {{ item }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.list {
  display: flex;
}

.item {
  margin-right: 0.2em;
  padding: 0.5em;
  background-color: #f0f0f0;
  /*height: 10em;*/
}
</style>
