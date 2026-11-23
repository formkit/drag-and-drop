<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";
import { useRoute } from "vue-router";

const route = useRoute();
const options = { group: "clone", nativeDrag: route.query.synth !== "1" };
const [source, sourceValues] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  ...options, clone: true, sortable: route.query.sortable === "1", multiDrag: true,
});
const [a, aValues] = useDragAndDrop<string>([], options);
const [b, bValues] = useDragAndDrop<string>([], options);
</script>
<template>
  <div class="lists">
    <ul id="source" ref="source"><li v-for="item in sourceValues" :id="item" :key="item">{{ item }}</li></ul>
    <ul id="a" ref="a"><li v-for="item in aValues" :key="item">{{ item }}</li></ul>
    <ul id="b" ref="b"><li v-for="item in bValues" :key="item">{{ item }}</li></ul>
  </div>
  <div id="outside">Outside</div>
  <output id="source-values">{{ sourceValues.join(' ') }}</output>
  <output id="a-values">{{ aValues.join(' ') }}</output>
  <output id="b-values">{{ bValues.join(' ') }}</output>
</template>
<style scoped>
.lists { display: flex; gap: 30px; }
ul { width: 160px; min-height: 220px; padding: 10px; border: 1px solid; }
li { height: 50px; list-style: none; background: #ddd; margin: 4px; }
#outside { height: 100px; }
</style>
