<script setup lang="ts">
import { dragAndDrop } from "../../src/vue";

const props = defineProps({
  item: Object,
  nestedDragAndDrop: Boolean,
});

const listItemRef = ref();

//dragAndDrop({
//  parent: listItemRef,
//  values: props.item.items,
//  treeGroup: "nested",
//  group: "submitem",
//});
</script>

<template>
  <div class="listitem">
    <!-- List Item -->
    <div class="list-item">
      {{ item.name }}
      <!--<div ref="listItemRef">
        <ListSubItem
          v-for="subitem in item.items"
          :key="subitem.id"
          :item="subitem"
        />
      </div>-->
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
</style>
