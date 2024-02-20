<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="relative aspect-[554/374] pointer-events-none">
    <span
      class="absolute w-full text-neutral-800 font-display top-[12%] sm:top-[16%] md:top-[15%] left-1/2 -translate-x-1/2 leading-0 text-[3vw] md:text-base lg:text-lg whitespace-nowrap"
      >{{ label }}</span
    >
    <img src="/img/cassette.webp" alt="Cassette Tape" class="block w-full" />
  </div>
</template>
