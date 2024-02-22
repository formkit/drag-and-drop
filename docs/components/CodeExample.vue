<script lang="ts" setup>
const props = defineProps<{
  example: string;
}>();
const expanded = ref(true);
const exampleLang = useState("exampleLang", () => "react");
let cmp: Component | false = false;
try {
  const res = await import(`../examples/${props.example}/demo.vue`);
  cmp = res.default;
} catch {}
</script>

<template>
  <div class="code-example my-6">
    <ul
      class="example-tabs flex border-4 border-b-2 border-slate-400 dark:border-slate-500 text-white"
    >
      <li
        class="example-tab"
        @click="
          exampleLang = 'react';
          expanded = true;
        "
        :data-active="exampleLang === 'react'"
      >
        <IconReact class="inline-block w-4 sm:w-5 mr-1.5" /> React
      </li>
      <li
        class="example-tab"
        @click="
          exampleLang = 'vue';
          expanded = true;
        "
        :data-active="exampleLang === 'vue'"
      >
        <IconVue class="inline-block w-4 sm:w-5 mr-1.5" /> Vue
      </li>
      <li
        class="example-tab"
        @click="
          exampleLang = 'native';
          expanded = true;
        "
        :data-active="exampleLang === 'native'"
      >
        <IconJavaScript class="inline-block w-4 sm:w-5 h-[1.25em] mr-1.5" />
        Native
      </li>

      <li class="faux-controls hidden md:block ml-auto">
        <span
          @click="expanded = false"
          class="faux-button minimize cursor-pointer"
        ></span>
        <span
          @click="expanded = true"
          class="faux-button fullscreen cursor-pointer"
        ></span>
        <span class="faux-button close cursor-not-allowed"></span>
      </li>
    </ul>
    <div
      v-show="expanded"
      class="editor border-l-4 border-r-4 border-slate-400 dark:border-slate-500"
    >
      <div v-show="exampleLang === 'react'">
        <CodeExampleReact :example="example" />
      </div>
      <div v-show="exampleLang === 'vue'">
        <CodeExampleVue :example="example" />
      </div>
      <div v-show="exampleLang === 'native'">
        <CodeExampleNative :example="example" />
      </div>
    </div>
    <div class="demo-container">
      <component v-if="cmp" :is="cmp" />
    </div>
  </div>
</template>

<style scoped>
.example-tabs {
  background: url("/img/dither.webp");
  background-size: cover;
  @apply pl-1;
}
.example-tab {
  @apply px-3 py-1 flex text-xs sm:text-sm md:text-base items-center cursor-pointer data-[active=true]:underline underline-offset-2 data-[active=true]:outline-dashed outline-1 outline-white;
  @apply bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 my-1 mr-1;
}
.faux-controls {
  @apply flex items-center mr-1;
}
.faux-button {
  @apply inline-block relative w-5 h-5 md:w-6 md:h-6 bg-slate-300 mr-1 text-black border border-slate-800 shadow-[inset_2px_2px_0px_0px_rgba(255,255,255,1)];
}
.faux-button::before,
.faux-button::after {
  content: "";
  position: absolute;
}
.faux-button.close::before,
.faux-button.close::after {
  width: 2px;
  background: black;
  height: calc(100% - 2px);
  left: 50%;
  top: 1px;
}
.faux-button.close::before {
  transform: rotate(45deg);
}
.faux-button.close::after {
  transform: rotate(-45deg);
}

.faux-button.fullscreen::before {
  inset: 3px;
  border: 2px solid black;
  border-top-width: 4px;
}

.faux-button.minimize::before {
  bottom: 3px;
  height: 2px;
  width: calc(100% - 6px);
  left: 50%;
  transform: translateX(-50%);
  background: black;
}
</style>
