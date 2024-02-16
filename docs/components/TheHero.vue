<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";

const dragList = ref(null);

const features = ref([
  {
    title: "Declarative",
    description: "No direct DOM manipulations.",
  },
  {
    title: "Lightweight",
    description: "Just 3kb min-gzip.",
  },
  {
    title: "Modern",
    description: "Leverages modern web APIs.",
  },
  {
    title: "Multi-drag",
    description: "Drag on multiple items at once.",
  },
  {
    title: "TypeScript",
    description: "First-class TypeScript support.",
  },
  {
    title: "Production-ready",
    description: "Used on FormKit Pro inputs.",
  },
]);

dragAndDrop({
  parent: dragList,
  values: features,
  dropZoneClass: "opacity-50",
  plugins: [
    animations({
      duration: 200,
    }),
  ],
});
</script>

<template>
  <div class="p-8 mt-40 flex flex-col items-center">
    <h1 class="font-display text-9xl text-emerald-500 mb-5">
      Drag<span class="text-emerald-800">&</span>Drop
    </h1>
    <p
      class="text-4xl font-semibold text-center text-emerald-900 max-w-[500px] text-balance"
    >
      A tiny <span class="text-pink-600">declarative</span> library for the
      modern web.
    </p>
  </div>

  <ul
    ref="dragList"
    class="features flex flex-wrap items-center justify-center mt-16 border border-emerald-500 border-dashed rounded-xl p-5"
  >
    <li
      v-for="feature in features"
      :key="feature.title"
      class="flex flex-col basis-[30%] items-center bg-white/70 border border-emerald-500 shadow-md p-5 rounded-lg m-2 cursor-grab active:cursor-grabbing active:shadow-xl active:select-none"
    >
      <h2 class="text-xl font-semibold text-emerald-700 mb-1">
        {{ feature.title }}
      </h2>
      <p class="text-sm text-center text-stone-500">
        {{ feature.description }}
      </p>
    </li>
  </ul>
</template>
