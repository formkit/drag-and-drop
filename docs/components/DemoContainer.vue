<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="relative p-2 pb-4 md:p-4 mb-10 bg-white rounded-lg shadow-md border border-slate-300 dark:bg-slate-700 dark:border-slate-600"
  >
    <div class="bg-slate-200 relative rounded-md overflow-clip">
      <slot />
    </div>

    <span
      v-if="name"
      class="text-xs text-right absolute bottom-0 right-4 text-slate-400"
    >
      {{ name }} Demo
    </span>
  </div>
</template>
