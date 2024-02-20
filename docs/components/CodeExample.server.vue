<script lang="ts" setup>
defineProps<{
  example: string;
}>();
</script>

<template>
  <div>
    <!-- <CodeExampleVue :example="example" />
    <CodeExampleReact :example="example" /> -->
    <CodeExampleNative :example="example" />
  </div>
</template>
