<script setup lang="ts">
import { dragAndDrop } from "../../../src/vue";
import { insertion } from "../../../src";

const props = defineProps({
  item: Object,
  nestedDragAndDrop: Boolean,
});

const listItemRef = ref();

dragAndDrop({
  parent: listItemRef,
  values: props.item.items,
  treeGroup: "nested",
  group: "nested",
  plugins: [insertion()],
});
</script>

<template>
  <div class="listitem">
    <!-- List Item -->
    <div class="list-item">
      {{ item.name }}
      <div ref="listItemRef">
        <ListSubItem
          v-for="subitem in item.items"
          :key="subitem.id"
          :item="subitem"
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
