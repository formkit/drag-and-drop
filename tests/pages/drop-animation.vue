<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDragAndDrop } from "../../src/vue/index";
import { animations, dropOrSwap } from "../../src/index";

const route = useRoute();
const options = {
  group: "settle",
  multiDrag: route.query.multi === "1",
  nativeDrag: route.query.synth !== "1",
  plugins: [
    ...(route.query.swap === "1" ? [dropOrSwap()] : []),
    animations({ drop: route.query.off === "1" ? false : { duration: 1200, easing: "linear" } }),
  ],
};
const [source, sourceValues] = useDragAndDrop(["Apple", "Banana", "Orange"], { ...options, clone: route.query.clone === "1" });
const [target, targetValues] = useDragAndDrop(["Pear", "Peach"], options);
</script>
<template>
  <div class="lists">
    <ul ref="source"><li v-for="item in sourceValues" :id="item" :key="item">{{ item }}</li></ul>
    <ul ref="target"><li v-for="item in targetValues" :id="item" :key="item">{{ item }}</li></ul>
  </div>
  <output id="source-values">{{ sourceValues.join(' ') }}</output>
  <output id="target-values">{{ targetValues.join(' ') }}</output>
</template>
<style scoped>
.lists { display: flex; gap: 80px; }
ul { width: 180px; min-height: 240px; padding: 10px; border: 1px solid; }
li { height: 55px; list-style: none; background: #ddd; margin: 5px; }
</style>
