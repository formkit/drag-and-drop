<script setup lang="ts">
import { reactive } from "vue";
import Nested from "./nested.vue";
const root = reactive({ id: "root", label: "Root", children: [
  { id: "1", label: "Projects", children: [
    { id: "2", label: "Website", children: [{ id: "3", label: "Design", children: [] }] },
    { id: "4", label: "Documentation", children: [] },
  ] },
  { id: "5", label: "Archive", children: [] },
] });
</script>
<template>
  <DemoContainer name="Nested lists">
    <div class="p-4"><Nested :owner="root" /></div>
  </DemoContainer>
</template>
