<script setup lang="ts">
import vueLogo from "/vuejs-icon.svg";

import { dragAndDrop } from "../../src/vue/index";

//dragAndDrop();
</script>

<template>
  <div>
    <div class="logo">
      <img :src="vueLogo" className="logo" alt="Vite logo" />
    </div>
    <div class="content">
      <h3>Test 1: Init Parent</h3>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 2em 0;
}
</style>
