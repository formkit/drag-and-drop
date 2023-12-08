<script setup lang="ts">
const props = defineProps({
  values: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const list = ref<HTMLElement | null>(null);

defineExpose({
  list,
});
</script>

<template>
  <div ref="list" class="list">
    <div v-for="item in values" class="item">
      <div class="content">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.values {
  margin-bottom: 2em;
}
.transit .content {
  background-color: purple;
}
.origin .content {
  background-color: green;
}

.destination .content {
  background-color: blue;
}
.container {
  display: flex;
}
.list {
  margin: 0 1em;
  border: 1px solid black;
  padding: 2em;
  min-width: 300px;
  height: 500px;
  position: relative;
}

.item {
  margin-bottom: 1em;
  color: white;
}

.item.selected .content {
  background-color: red;
}

.content {
  background-color: teal;
  padding: 1em;
  text-align: center;
  color: white;
}
</style>
