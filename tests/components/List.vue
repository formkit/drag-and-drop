<script setup lang="ts">
import { ref } from "vue";
import { NestedList } from "../../src/vue";

// import { useNestedDragAndDrop } from "../../src/vue/index";

const props = defineProps({
  list: Object,
});

// console.log(props.list.items);
</script>

<template>
  <div class="list">
    <h2>{{ list.name }}</h2>
    <NestedList :values="props.list.items">
      <ListItem v-for="item in list.items" :key="item" :list-item="item" />
    </NestedList>
  </div>
</template>

<style scoped>
.list {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>
