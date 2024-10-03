<script setup lang="ts">
import ToDos from "../ToDos.vue";
</script>

<template>
  <ToDos :use-drop-or-swap="true" :transfer="true" />
</template>
