<script setup lang="ts">
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <div class="page-container">
    <h1>Teardown mid-interaction</h1>
    <button id="toggle" @click="show = !show">Toggle list</button>
    <TeardownList v-if="show" />
  </div>
</template>
