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
    class="relative p-px mb-10 bg-white shadow-md border-4 border-slate-400 dark:bg-slate-700 dark:border-slate-500 select-none"
  >
    <div class="relative overflow-clip">
      <slot />
    </div>
  </div>
</template>
