<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div
    class="relative p-1 mb-10 bg-white shadow-md border-4 border-slate-400 dark:bg-slate-700 dark:border-slate-500"
  >
    <div class="bg-slate-200 relative overflow-clip">
      <slot />
    </div>
  </div>
</template>
