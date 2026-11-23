<script setup lang="ts">
import { ref, toRef, onBeforeUnmount } from "vue";
import { dragAndDrop } from "../../src/vue/index";
import { tearDown } from "../../src/index";

interface TreeNode { id: string; label: string; children: TreeNode[] }
const props = defineProps<{ owner: TreeNode; synthetic: boolean }>();
const list = ref<HTMLElement>();
dragAndDrop({ parent: list, values: toRef(props.owner, "children"), group: "tree", multiDrag: true, nativeDrag: !props.synthetic });
onBeforeUnmount(() => list.value && tearDown(list.value));
</script>

<template>
  <ul :id="`list-${owner.id}`" ref="list" class="tree-list">
    <li v-for="node in owner.children" :id="node.id" :key="node.id" class="tree-node">
      <span :id="`label-${node.id}`">{{ node.label }}</span>
      <NestedList :owner="node" :synthetic="synthetic" />
    </li>
  </ul>
</template>

<style scoped>
.tree-list { min-height: 28px; min-width: 180px; padding: 8px 8px 8px 24px; border: 1px dashed #888; list-style: none; }
.tree-node { border: 1px solid #aaa; margin: 4px; padding: 4px; background: white; }
</style>
