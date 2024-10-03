<script setup lang="ts">
import { ref } from "vue";
import { dragAndDrop } from "../../src/vue";

// import { useNestedDragAndDrop } from "../../src/vue/index";

const props = defineProps({
  list: Object,
});

const parent = ref();

dragAndDrop({
  parent,
  values: props.list.items,
  treeGroup: "nested",
  group: "nested",
});
</script>

<template>
  <div class="list" v-if="list">
    <h3>
      {{ list.name }}
    </h3>
    <div ref="parent">
      <ListItem v-for="item in list.items" :key="item.id" :item="item" />
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
  width: 300px;
}
</style>
