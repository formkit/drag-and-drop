<script setup lang="ts">
import Test1 from "./components/Test1.vue";
import Test2 from "./components/Test2.vue";
import vueLogo from "/vuejs-icon.svg";
</script>

<template>
  <div>
    <div class="logo">
      <img :src="vueLogo" className="logo" alt="Vite logo" />
    </div>
    <div class="content">
      <Test1 id="vue_drag_and_drop" test-description="dragAndDrop" />
      <div class="divider"></div>
      <Test2 id="vue_use_drag_and_drop" test-description="useDragAndDrop" />
    </div>
  </div>
</template>
