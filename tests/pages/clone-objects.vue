<script setup lang="ts">
import { markRaw, toRaw } from "vue";
import { useRoute } from "vue-router";
import { useDragAndDrop } from "../../src/vue/index";
const mode = useRoute().query.mode;
type Item = { name: string; nested: { count: number }; fn?: () => void };
const original: Item = markRaw({ name: "original", nested: { count: 1 }, ...(mode === "fallback" ? { fn: () => {} } : {}) });
const [source, originals] = useDragAndDrop<Item>([original], {
  group: "objects", sortable: false,
  clone: mode === "custom" ? (value) => ({ ...value, name: "custom" }) : true,
});
const [target, copies] = useDragAndDrop<Item>([], { group: "objects" });
const [target2, copies2] = useDragAndDrop<Item>([], { group: "objects" });
</script>
<template>
  <div class="lists">
    <ul id="object-source" ref="source"><li id="object-item">{{ originals[0].name }}</li></ul>
    <ul id="object-target" ref="target"><li v-for="(item, index) in copies" :key="index">{{ item.name }}</li></ul>
    <ul id="object-target2" ref="target2"><li v-for="(item, index) in copies2" :key="index">{{ item.name }}</li></ul>
  </div>
  <output id="identity">{{ copies.length ? toRaw(copies[0]) === original : copies2.length ? toRaw(copies2[0]) === original : 'empty' }}</output>
  <output id="nested-identity">{{ copies.length ? toRaw(copies[0]).nested === original.nested : copies2.length ? toRaw(copies2[0]).nested === original.nested : 'empty' }}</output>
</template>
<style scoped>
.lists { display: flex; gap: 30px; } ul { width: 160px; min-height: 200px; padding: 10px; border: 1px solid; } li { height: 50px; list-style: none; }
</style>
