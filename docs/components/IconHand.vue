<script setup>
defineProps({
  open: Boolean,
  default: false,
});

// preload images
onMounted(() => {
  const img = new Image();
  img.src = "/img/hand-open.png";
  img.src = "/img/hand-closed.png";
});
</script>

<template>
  <img v-if="open" src="/img/hand-open.png" alt="grab cursor" />
  <img v-else src="/img/hand-closed.png" alt="grab cursor" />
</template>
