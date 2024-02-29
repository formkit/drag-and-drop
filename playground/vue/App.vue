<script setup lang="ts">
import Test1 from "./components/Test1.vue";
import Test2 from "./components/Test2.vue";
import Test4 from "./components/Test4.vue";
import vueLogo from "/vuejs-icon.svg";
</script>

<template>
  <div>
    <div class="logo">
      <img :src="vueLogo" className="logo" alt="Vite logo" />
    </div>
    <div class="content">
      <Test1
        id="vue_1"
        test-description="Init parent by passing in the parent element directly to `dragAndDrop` function."
      />
      <div class="divider"></div>
      <Test2
        id="vue_2"
        test-description="Init parent by passing in a Vue ref directly to `dragAndDrop` function."
      />
      <Test4 id="vue_4" test-description="Another test" />
    </div>
  </div>
</template>
