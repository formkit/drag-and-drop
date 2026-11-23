<script setup lang="ts">
import { reactive } from "vue";
import NestedList from "../components/NestedList.vue";
const route = useRoute();
const leaf = (id: string) => ({ id, label: id, children: [] });
const root = reactive({ id: "root", label: "root", children: [
  { ...leaf("A"), children: [{ ...leaf("A1"), children: [leaf("A11"), leaf("A12")] }, leaf("A2")] },
  { ...leaf("B"), children: [leaf("B1"), leaf("B2")] }, leaf("C")
] });
</script>
<template>
  <NestedList :owner="root" :synthetic="route.query.synthetic === '1'" />
  <pre id="tree-data">{{ JSON.stringify(root.children) }}</pre>
</template>
