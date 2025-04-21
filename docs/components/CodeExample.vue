<script lang="ts" setup>
import type { Component } from "vue";
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps<{
  example: string;
}>();
const expanded = ref(true);
const exampleLang = ref("react");
const rawCode = ref("");
const copyStatus = ref("Copy");
const codeCache = ref<Record<string, string>>({}); // Cache for raw code snippets
const availableLangs = ["react", "vue", "solid", "native"]; // Define available languages
const copyButtonRef = ref<HTMLButtonElement | null>(null); // Template ref for the button

let cmp: Component | false = false;

try {
  const res = await import(`../examples/${props.example}/demo.vue`);
  cmp = res.default;
} catch (err) {
  console.error("Failed to load demo: ", err);
}

watch(
  exampleLang,
  (newLang) => {
    rawCode.value = codeCache.value[newLang] || "";

    copyStatus.value = rawCode.value ? "Copy" : "Error";
  },
  { immediate: false }
);

onMounted(async () => {
  await nextTick(); // Ensure DOM is ready

  for (const lang of availableLangs) {
    try {
      const hiddenCodeElement = document.getElementById(
        `raw-code-container-${props.example}-${lang}`
      );

      if (hiddenCodeElement && hiddenCodeElement.textContent) {
        codeCache.value[lang] = hiddenCodeElement.textContent;
      } else {
        console.warn(
          `Hidden code element not found or empty for lang: ${lang} on mount.`
        );

        codeCache.value[lang] = ""; // Store empty string if not found
      }
    } catch (error) {
      console.error(
        `Failed to extract raw code for lang ${lang} on mount:`,
        error
      );

      codeCache.value[lang] = ""; // Store empty string on error
    }
  }

  // Set initial rawCode based on the starting language
  rawCode.value = codeCache.value[exampleLang.value] || "";
  copyStatus.value = rawCode.value ? "Copy" : "Error";
});

async function copyCode() {
  if (!navigator.clipboard || !copyButtonRef.value) {
    copyStatus.value = "Error";
    return;
  }

  // Reset any lingering feedback class
  copyButtonRef.value.classList.remove("copy-success", "copy-failed");

  try {
    await navigator.clipboard.writeText(rawCode.value);
    copyStatus.value = "Copied!";
    copyButtonRef.value.classList.add("copy-success");

    setTimeout(() => {
      copyStatus.value = "Copy";
      copyButtonRef.value?.classList.remove("copy-success");
    }, 1500);
  } catch (err) {
    console.error("Failed to copy: ", err);
    copyStatus.value = "Failed";
    setTimeout(() => {
      copyStatus.value = "Copy";
    }, 1500);
  }
}
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
          exampleLang = 'solid';
          expanded = true;
        "
        :data-active="exampleLang === 'solid'"
      >
        <IconSolid class="inline-block w-4 sm:w-5 mr-1.5" /> Solid
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

      <li class="ml-auto flex items-center pr-1">
        <!-- Wrapper for positioning context -->
        <div class="relative mr-1">
          <button
            ref="copyButtonRef"
            @click="copyCode"
            class="copy-button w-5 h-5 md:w-6 md:h-6 bg-slate-300 border border-slate-800 shadow-[inset_2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="copyStatus === 'Error'"
            aria-label="Copy"
          >
            <!-- Icon span -->
            <span>
              <!-- SVG -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="black"
                stroke="black"
                stroke-width="1"
                class="inline-block"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"
                />
                <path
                  d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"
                />
              </svg>
            </span>
          </button>
          <!-- Status text positioned relative to the wrapper -->
        </div>

        <div class="faux-controls hidden md:flex items-center">
          <span
            @click="expanded = false"
            class="faux-button minimize cursor-pointer"
          ></span>
          <span
            @click="expanded = true"
            class="faux-button fullscreen cursor-pointer"
          ></span>
          <span class="faux-button close cursor-not-allowed"></span>
        </div>
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
      <div v-show="exampleLang === 'solid'">
        <CodeExampleSolid :example="example" />
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

/* Add active state for faux buttons */
.faux-button:active {
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;
  border-bottom: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
  box-shadow: inset 1px 1px 0px #808080; /* Inner dark bevel */
  padding-top: 1px; /* Simulate content push */
  padding-left: 1px;
}

/* New style for success feedback */
.copy-button.copy-success {
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;
  border-bottom: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
  box-shadow: inset 1px 1px 0px #808080; /* Inner dark bevel */
  /* No padding change needed like :active */
}

/* Optional: Add styles for .copy-button.copy-failed if desired */
</style>
