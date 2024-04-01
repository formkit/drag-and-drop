<script setup lang="ts">
import { dragAndDrop } from "../../src/vue/index";
import { animations } from "../../src/index";

const dragList = ref();

const features = ref([
  {
    title: "Data-first",
    description: "No direct DOM manipulations.",
  },
  {
    title: "Lightweight",
    description: "~4kb min-gzip. No dependencies.",
  },
  {
    title: "Modern",
    description: "Leverages modern web APIs.",
  },
  {
    title: "Plugins",
    description: "Multi-drag, animations, and more.",
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
  dropZoneClass: "blur-[2px] opacity-60",
  plugins: [
    animations({
      duration: 150,
    }),
  ],
});
</script>

<template>
  <div class="-mt-8 w-full transform-gpu">
    <div id="vapor-wave-sun" class="transform-gpu" aria-hidden="true" />
    <div class="flex flex-col pb-20 min-h-[85dvh]" id="vapor-wave-container">
      <div class="page-section my-auto relative z-10">
        <div
          class="mt-[min(6vh,12em)] mb-[min(6vh,3.5em)] flex flex-col items-center"
        >
          <h1
            :class="`
              relative
              font-display
              text-[max(10vh,6.5em)]
              text-emerald-500
              mb-6
              lg:mb-[max(4vh,1rem)]
              tall:mt-[max(-6vh,-3rem)]
              xtall:mt-[max(-12vh,-3rem)]
              transition-all
              duration-[1500ms]
              text-center
              leading-[0.5em]
              w-48
              lg:w-3/4
              lg:max-w-[45vh]
              tall:max-w-[min(22rem,50vh)]
              drop-shadow-[-1px_1px_0_rgba(255,255,255,1)]
              transform-gpu

              dark:text-white
            `"
          ></h1>
        </div>
        <ul
          ref="dragList"
          :class="`
            features
            flex
            flex-wrap
            mt-4
            bg-blue-100/40
            border
            border-sky-400
            rounded-xl
            p-3
            backdrop-blur-[8px]

            dark:bg-slate-800/20
            dark:border-pink-500

            before:content-['try_me']
            before:absolute
            before:bottom-full
            before:left-2
            before:text-blue-400
            before:text-xs
            before:uppercase

            dark:before:text-pink-300
          `"
        >
          <li
            v-for="feature in features"
            :key="feature.title"
            :class="`
              relative
              z-20
              flex
              flex-col
              grow
              basis-[30%]
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

              dark:before:bg-pink-400
            `"
          >
            <div
              :class="`
                card
                rounded-md
                px-1.5
                py-2
                md:p-3
                grow
                w-full
                bg-white
                border-t
                border-r
                border-sky-500
                text-center

                dark:border-red-400
                dark:bg-indigo-950/80
              `"
            >
              <span
                class="text-sm md:text-lg block font-semibold text-emerald-600 mb-0.5 dark:text-emerald-400"
              >
                {{ feature.title }}
              </span>
              <p
                class="text-xs md:text-md text-center text-slate-600 dark:text-slate-300"
              >
                {{ feature.description }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
