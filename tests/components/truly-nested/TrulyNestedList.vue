<script setup lang="ts">
import { ref } from "vue";
import { dragAndDrop } from "../../../src/vue";
import { insertion } from "../../../src";

// import { useNestedDragAndDrop } from "../../src/vue/index";

const props = defineProps({
  list: Object,
});

const parent = ref();

dragAndDrop({
  parent,
  values: props.list.items || [],
  treeGroup: "nested",
  group: "nested",
  plugins: [insertion()],
});
</script>

<template>
  <div class="list" :id="list.name + '_list'">
    <h3>
      {{ list.name }}
    </h3>
    <div ref="parent" class="list">
      <TrulyNestedListItem
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
