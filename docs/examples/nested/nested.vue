<script setup lang="ts">
import { onBeforeUnmount, ref, toRef } from "vue";
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { tearDown } from "@formkit/drag-and-drop";

defineOptions({ name: "Nested" });
type TreeNode = { id: string; label: string; children: TreeNode[] };
const props = defineProps<{ owner: TreeNode }>();
const list = ref<HTMLElement>();
// Bind each list to the actual children property, not a detached copy.
dragAndDrop({ parent: list, values: toRef(props.owner, "children"), group: "tree", multiDrag: true });
onBeforeUnmount(() => list.value && tearDown(list.value));
</script>

<template>
  <ul ref="list" class="tree-list">
    <li v-for="node in owner.children" :key="node.id">
      {{ node.label }}
      <Nested :owner="node" />
    </li>
  </ul>
</template>

<style scoped>
.tree-list { min-height: 2rem; padding: .5rem .5rem .5rem 1.5rem; border: 1px dashed #94a3b8; }
li { margin: .25rem 0; }
</style>
