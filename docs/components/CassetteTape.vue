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
    <div
      class="absolute top-[12%] sm:top-[16%] md:top-[15%] w-full text-center"
    >
      <span
        class="text-neutral-800 font-display leading-0 text-[3vw] md:text-base lg:text-lg whitespace-nowrap"
      >
        {{ label }}
      </span>
    </div>
    <img src="/img/cassette.webp" alt="Cassette Tape" class="block w-full" />
  </div>
</template>
