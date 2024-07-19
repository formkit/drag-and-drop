<script setup lang="ts">
const props = defineProps({
  listSubItem: Object,
});

const listSubItemRef = ref();
</script>

<template>
  <div class="list-sub-item" ref="listSubItemRef">
    {{ listSubItem.name }}
  </div>
</template>

<style scoped>
.list-sub-item {
  padding: 10px;
  margin: 5px 0 5px 20px;
  border-left: 2px solid #ddd;
  background-color: #f0f0f0;
}
</style>
