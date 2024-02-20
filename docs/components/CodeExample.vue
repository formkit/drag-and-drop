<script lang="ts" setup>
const props = defineProps<{
  example: string;
}>();
let cmp: Component | false = false;
try {
  const res = await import(`../examples/${props.example}/${props.example}.vue`);
  cmp = res.default;
} catch {}
</script>

<template>
  <div>
    <CodeExampleVue :example="example" />
    <CodeExampleReact :example="example" />
    <CodeExampleNative :example="example" />
    <component v-if="cmp" :is="cmp" />
  </div>
</template>
