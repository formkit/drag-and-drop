<script setup lang="ts">
import { ref } from "vue";
import { dragAndDrop } from "../../src/vue";

const props = defineProps({
  list: {
    items: Array<Record<string, any>>(),
    name: String,
  },
});

const parent = ref();

console.log("props", props.list.items);

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
  "before:block",
  'before:content-["Insert"]',
  "before:whitespace-nowrap",
  "before:block",
  "before:bg-blue-500",
  "before:py-1",
  "before:px-2",
  "before:rounded-full",
  "before:text-xs",
  "before:absolute",
  "before:top-1/2",
  "before:left-1/2",
  "before:-translate-y-1/2",
  "before:-translate-x-1/2",
  "before:text-white",
  "before:text-xs",
];

dragAndDrop({
  parent,
  values: props.list.items || [],
  treeGroup: "primary",
  group: "nested",
  dropZoneClass: "!bg-lime-200",
});
</script>

<template>
  <div class="list" :id="list.name + '_list'">
    <h3>
      {{ list.name }}
    </h3>
    <div ref="parent" class="list">
      <ListItem
        v-for="item in list.items"
        :id="item.name"
        :key="item.id + item.name"
        :item="item"
      />
    </div>
  </div>
</template>

<style scoped>
.list {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  min-height: 200px;
}
</style>
