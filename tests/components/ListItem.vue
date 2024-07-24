<script setup lang="ts">
import { NestedList } from "../../src/vue";

const props = defineProps({
  listItem: Object,
  nestedDragAndDrop: Boolean,
});

const listItemRef = ref();

// console.log("listitem", props.nestedDragAndDrop);
</script>

<template>
  <div class="listitem" ref="listItemRef">
    <!-- List Item -->
    <div class="list-item">
      {{ listItem.name }}
      <!-- <NestedList :values="listItem.subitems">
        <ListSubItem
          v-for="subItem in listItem.subitems"
          :key="subItem.id"
          :list-sub-item="subItem"
        />
      </NestedList> -->
    </div>
  </div>
</template>

<style scoped>
.list-item {
  padding: 10px;
  margin: 5px 0;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

.list-item:hover {
  background-color: #eaeaea;
}

.list-item:last-child {
  border-bottom: none;
}
</style>
