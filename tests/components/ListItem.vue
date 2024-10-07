<script setup lang="ts">
import { dragAndDrop } from "../../src/vue";

const props = defineProps({
  item: {
    items: Array<Record<string, any>>(),
    name: String,
  },
  nestedDragAndDrop: Boolean,
});

const listItemRef = ref();

dragAndDrop({
  parent: listItemRef,
  values: props.item.items || [],
  treeGroup: "primary",
  group: "listitem",
  dropZoneClass: "!bg-lime-200",
});
</script>

<template>
  <div class="listitem">
    <div class="list-item">
      {{ item.name }}
      <div ref="listItemRef">
        <ListSubItem
          v-for="item in item.items"
          :id="item.name"
          :key="item.id"
          :item="item"
        />
      </div>
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
