<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const disabled = ref(false);

const [parentRef, values, updateConfig] = useDragAndDrop([
  "Depeche Mode",
  "Duran Duran",
  "Pet",
  "Kraftwerk",
  "Tears for Fears",
  "Spandau Ballet",
]);

function toggleDisabled() {
  disabled.value = !disabled.value;

  updateConfig({ disabled: disabled.value });
}
</script>

<template>
  <DemoContainer name="Sorting">
    <div class="bg-amber-800 dark:bg-amber-950">
      <div
        class="demo-background opacity-75 dark:opacity-40 dark:saturate-50"
      ></div>
      <div class="relative z-10 px-2 pt-[30vw] md:pt-40 lg:px-10 pb-10">
        <img
          src="/img/paper-jams.webp"
          alt="FormKit Office Jams"
          class="contrast-120 brightness-[140%] absolute -top-4 -left-8 -rotate-12 w-full max-w-[500px] drop-shadow-md pointer-events-none"
        />
        <button>Disable</button>
        <ul
          ref="parentRef"
          class="cassette-grid relative flex flex-wrap justify-center items-center w-full z-20"
        >
          <li
            v-for="tape in values"
            :key="tape"
            class="basis-1/2 md:basis-1/3 text-center cursor-grab active:cursor-grabbing"
          >
            <CassetteTape :label="tape" :data-label="tape" />
          </li>
        </ul>
        <button id="no-drag" @click="toggleDisabled">
          {{ disabled ? "Enable" : "Disable" }} drag and drop
        </button>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
.demo-background {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.1 .01'/%3E%3CfeColorMatrix values='0 0 0 .1 .69 0 0 0 .09 .3 0 0 0 .15 .14 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filter)'/%3E%3C/svg%3E");
  background-size: 100%;
}

[data-label="Depeche Mode"] {
  filter: hue-rotate(80deg) saturate(150%);
  transform: rotate(-5deg);
}
[data-label="Duran Duran"] {
  filter: hue-rotate(160deg) saturate(250%) brightness(90%);
  transform: rotate(5deg);
}
[data-label="Pet Shop Boys"] {
  filter: hue-rotate(240deg) saturate(150%) brightness(85%);
  transform: rotate(-2deg);
}
[data-label="Kraftwerk"] {
  filter: hue-rotate(320deg) saturate(200%) brightness(110%);
  transform: rotate(2deg);
}
[data-label="Tears for Fears"] {
  filter: hue-rotate(40deg) saturate(300%) brightness(105%);
  transform: rotate(-3deg);
}
#no-drag {
  margin-top: 1rem;
  background: #fff;
  padding: 0.5em 1em;
  color: red;
  border-radius: 0.25rem;
  @apply shadow-md;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
