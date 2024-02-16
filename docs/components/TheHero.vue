<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";

const dragList = ref(null);
<<<<<<< HEAD
=======
const showHand = ref(true);
const showTitle = ref(false);
const openHand = ref(false);
const exitHand = ref(false);
const showHeadline = ref(false);
const showDemo = ref(false);

>>>>>>> 57e79820addd34ee5524e563f313a5d3d2c8e178
const features = ref([
  {
    title: "Declarative",
    description: "No direct DOM manipulations.",
  },
  {
    title: "Lightweight",
    description: "Just 3kb min-gzip. No dependencies.",
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
  draggingClass: "[&>.card]:-rotate-2 before:-rotate-2",
  dropZoneClass: "blur-sm opacity-60",
});

onMounted(() => {
  setTimeout(() => {
    setTimeout(() => {
      showTitle.value = true;
    }, 0);
    setTimeout(() => {
      openHand.value = true;
    }, 1000);
    setTimeout(() => {
      exitHand.value = true;
    }, 1500);
    setTimeout(() => {
      showHand.value = false;
    }, 2500);
    setTimeout(() => {
      showHeadline.value = true;
    }, 1500);
    setTimeout(() => {
      showDemo.value = true;
    }, 1700);
  }, 200);
});
</script>

<template>
  <div class="p-8 mt-40 flex flex-col items-center">
    <h1
      :data-show="showTitle"
      :class="`
      relative
      font-display 
      text-[10em] 
      text-emerald-500 
      mb-24
      transition-all
      duration-1000
      -translate-x-[100vw]
      data-[show=true]:translate-x-0
    `"
    >
      Drag<span class="text-emerald-800">&</span>Drop

      <IconHand
        v-if="showHand"
        :data-exit="exitHand"
        :class="`
          absolute
          -top-10
          -right-10
          -rotate-0
          w-48
          transition-all
          duration-500
          translate-x-0
          data-[exit=true]:translate-x-[100vw]
        `"
        :open="openHand"
      />
    </h1>

    <p
      :data-show="showHeadline"
      :class="`
        text-6xl
        font-semibold
        text-center
        text-emerald-900
        max-w-[800px]
        text-balance

        transition-all
        duration-500
        translate-y-10
        opacity-0
        data-[show=true]:translate-y-0
        data-[show=true]:opacity-100
      `"
    >
      A <span class="text-3xl mr-2.5 text-green-600">tiny</span>
      <span class="text-pink-600">declarative</span> library for the modern web.
    </p>
  </div>

  <ul
    ref="dragList"
    :data-show="showDemo"
    :class="`
      features
      flex
      flex-wrap
      items-center
      justify-center
      mt-16
      bg-emerald-100/40
      border
      border-emerald-500
      border-dashed
      rounded-xl
      p-5

      transition-all
      duration-500
      translate-y-10
      opacity-0
      data-[show=true]:translate-y-0
      data-[show=true]:opacity-100
    `"
  >
    <li
      v-for="feature in features"
      :key="feature.title"
      :class="`
        relative
        z-10
        flex
        flex-col
        basis-[30%]
        items-center
        m-2
        cursor-grab
        active:cursor-grabbing
        active:shadow-xl
        active:select-none

        before:absolute
         before:z-[-1]
         before:bg-pink-500
        before:top-[3px]
        before:-left-[3px]
        before:w-full
        before:h-full
        before:rounded-md
      `"
    >
      <div
        :class="`
        card
        rounded-md
        p-5
        w-full
        bg-white
        border-t
        border-r
        border-emerald-500
        text-center
      `"
      >
        <h2 class="text-xl font-semibold text-emerald-700 mb-1">
          {{ feature.title }}
        </h2>
        <p class="text-sm text-center text-stone-500">
          {{ feature.description }}
        </p>
      </div>
    </li>
  </ul>
</template>
