<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";

const dragList = ref(undefined);
const showHand = ref(true);
const showTitle = ref(false);
const openHand = ref(false);
const exitHand = ref(false);
const showHeadline = ref(false);
const showDemo = ref(false);
const showFrameworkList = ref(false);
const framework = useState("exampleLang", () => "react");
let closeTimeout = setTimeout(() => {});

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
  plugins: [animations({})],
});

function toggleFrameworkList(setting: boolean) {
  if (typeof setting === "boolean") {
    if (setting) {
      clearTimeout(closeTimeout);
      showFrameworkList.value = setting;
    } else {
      closeTimeout = setTimeout(() => {
        showFrameworkList.value = setting;
      }, 250);
    }
    return;
  }
  showFrameworkList.value = !showFrameworkList.value;
}

function handleFrameworkSelect(selection: string) {
  showFrameworkList.value = false;
  framework.value = selection;
  const el = document.getElementById("introduction");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

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
  <div class="-mt-8 w-full transform-gpu">
    <div id="vapor-wave-sun" class="transform-gpu" aria-hidden="true" />
    <div
      class="flex flex-col pb-20 lg:pb-10 min-h-[85dvh]"
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
              mb-6
              lg:mb-[max(4vh,1rem)]
              tall:mt-[max(-6vh,-3rem)]
              xtall:mt-[max(-12vh,-3rem)]
              transition-all
              duration-[1500ms]
              -translate-x-[100vw]
              data-[show=true]:translate-x-0
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
          >
            <DnDLogo
              class="block w-full mb-0 brightness-90 dark:brightness-[115%] transform-gpu"
            />
            <IconHand
              v-if="showHand"
              :data-exit="exitHand"
              :class="`
                absolute
                top-10
                -right-10
                -rotate-0
                max-w-32
                w-[33%]
                transition-all
                duration-1000
                translate-x-0
                data-[exit=true]:translate-x-[100vw]
                transform-gpu
              `"
              :open="openHand"
            />
          </h1>

          <div
            :data-show="showHeadline"
            :class="`
              relative
              z-30
              transition-all
              duration-500
              translate-y-10
              opacity-0
              data-[show=true]:translate-y-0
              data-[show=true]:opacity-100
            `"
          >
            <p
              :class="`
                text-2xl
                lg:text-[max(4vh,3em)]
                leading-[1em]
                font-semibold
                text-center
                text-slate-700
                max-w-[800px]
                text-balance
                mb-[max(2.5vh,1rem)]

                dark:text-slate-50
                dark:[text-shadow:-1px_1px_#000]
              `"
            >
              A
              <span
                class="text-lg lg:text-3xl mr-1 lg:mr-2.5 text-emerald-600 dark:text-green-400"
                >tiny</span
              >
              <span class="text-pink-600 dark:text-cyan-300">data-first</span>
              library<br />
              for modern apps
            </p>

            <div
              class="action-buttons flex flex-wrap items-center justify-center -mb-3"
            >
              <div class="inline-flex cursor-pointer mr-3 mb-3 relative z-10">
                <span
                  class="bg-slate-600 border border-slate-500 shadow-md !text-white rounded-lg flex text-sm !no-underline dark:bg-fuchsia-950 dark:border-fuchsia-600"
                >
                  <span
                    @click="handleFrameworkSelect(framework)"
                    class="py-3 px-6 border-r hover:bg-white/10 rounded-l-lg border-r-white/10 dark:border-fuchsia-800"
                  >
                    Get Started
                  </span>
                  <div
                    class="relative py-2 px-3 flex hover:bg-white/10 rounded-r-lg"
                    @mouseover="toggleFrameworkList(true)"
                    @mouseleave="toggleFrameworkList(false)"
                  >
                    <FrameworkIcons :active="framework" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3 ml-2"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M256 429.3l22.6-22.6 192-192L493.3 192 448 146.7l-22.6 22.6L256 338.7 86.6 169.4 64 146.7 18.7 192l22.6 22.6 192 192L256 429.3z"
                      />
                    </svg>
                    <ul
                      v-show="showFrameworkList"
                      :class="`
                        absolute
                        top-full
                        left-0
                        w-full
                        flex
                        flex-col
                        border
                        -translate-y-1
                        pt-1
                        z-[-1]
                        overflow-hidden
                        shadow-lg
                        bg-slate-700
                        dark:bg-fuchsia-950
                        dark:border-fuchsia-600
                        items-center
                        rounded-b-lg
                        justify-center
                      `"
                    >
                      <li
                        v-if="framework !== 'react'"
                        @click="handleFrameworkSelect('react')"
                        class="p-2 w-full text-center hover:bg-white/20"
                      >
                        <FrameworkIcons active="react" />
                      </li>
                      <li
                        v-if="framework !== 'vue'"
                        @click="handleFrameworkSelect('vue')"
                        class="p-2 w-full text-center hover:bg-white/20"
                      >
                        <FrameworkIcons active="vue" />
                      </li>
                      <li
                        v-if="framework !== 'native'"
                        @click="handleFrameworkSelect('native')"
                        class="p-2 w-full text-center hover:bg-white/20"
                      >
                        <FrameworkIcons active="native" />
                      </li>
                    </ul>
                  </div>
                </span>
              </div>
              <CopyCode :base-delay="1500" class="mb-3" />
            </div>
          </div>
        </div>

        <ul
          ref="dragList"
          :data-show="showDemo"
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
