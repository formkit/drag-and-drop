<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";

const dragList = ref(null);
const showHand = ref(true);
const showTitle = ref(false);
const openHand = ref(false);
const exitHand = ref(false);
const showHeadline = ref(false);
const showDemo = ref(false);

const features = ref([
  {
    title: "Declarative",
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
    }, 1500);
    setTimeout(() => {
      exitHand.value = true;
    }, 2000);
    setTimeout(() => {
      showHand.value = false;
    }, 3000);
    setTimeout(() => {
      showHeadline.value = true;
    }, 2000);
    setTimeout(() => {
      showDemo.value = true;
    }, 2200);
  }, 200);
});
</script>

<template>
  <div class="-mt-8 w-full overflow-hidden">
    <div id="vapor-wave-sun" aria-hidden="true" />
    <div
      class="flex flex-col pb-10 min-h-[85dvh] overflow-hidden"
      id="vapor-wave-container"
    >
      <div class="page-section my-auto relative z-10">
        <div
          class="mt-[min(6vh,12em)] mb-[min(6vh,3.5em)] flex flex-col items-center"
        >
          <h1
            :data-show="showTitle"
            :class="`
              relative
              font-display 
              text-[max(10vh,6.5em)] 
              text-emerald-500 
              mb-[max(4.5vh,1rem)]
              tall:mt-[-6vh]
              xtall:mt-[-12vh]
              transition-all
              duration-[1500ms]
              -translate-x-[100vw]
              data-[show=true]:translate-x-0
              text-center
              leading-[0.5em]
              w-3/4
              max-w-[45vh]
              tall:max-w-[min(22rem,50vh)]
              drop-shadow-[-1px_1px_0_rgba(255,255,255,1)]
              brightness-90

              dark:text-white
              dark:brightness-[115%]
            `"
          >
            <DnDLogo class="block w-full mb-0" />
            <IconHand
              v-if="showHand"
              :data-exit="exitHand"
              :class="`
                absolute
                top-10
                -right-10
                -rotate-0
                w-32
                transition-all
                duration-1000
                translate-x-0
                data-[exit=true]:translate-x-[100vw]
              `"
              :open="openHand"
            />
          </h1>

          <p
            :data-show="showHeadline"
            :class="`
              text-[max(4vh,3em)] 
              leading-[1em]
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

              dark:text-slate-50
              dark:[text-shadow:-1px_1px_#000]
            `"
          >
            A
            <span class="text-3xl mr-2.5 text-emerald-600 dark:text-green-400"
              >tiny</span
            >
            <span class="text-pink-600 dark:text-cyan-300">declarative</span>
            library<br />
            for modern apps
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
            mt-4
            bg-blue-100/40
            border
            border-sky-400
            rounded-xl
            p-3
            backdrop-blur-[8px]

            transition-all
            duration-500
            translate-y-10
            opacity-0
            data-[show=true]:translate-y-0
            data-[show=true]:opacity-100

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

              dark:before:bg-pink-400
            `"
          >
            <div
              :class="`
                card
                rounded-md
                p-3
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
              <h2
                class="text-lg font-semibold text-emerald-600 mb-0.5 dark:text-emerald-400"
              >
                {{ feature.title }}
              </h2>
              <p class="text-sm text-center text-slate-600 dark:text-slate-300">
                {{ feature.description }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
