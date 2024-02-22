<script setup lang="ts">
import { ref } from "vue";
import { dragAndDrop } from "@formkit/drag-and-drop/vue";

const dragList = ref();
const tapes = ref([
  "ACDC LIVE",
  "Metallica",
  "Guns N' Roses",
  "Def Leppard",
  "Bon Jovi",
  "Van Halen",
]);
dragAndDrop({
  parent: dragList,
  values: tapes,
  dropZoneClass: "saturate-0 opacity-20",
  draggable: (el) => {
    return el.id !== "no-drag";
  },
});
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

        <ul
          ref="dragList"
          class="cassette-grid relative flex flex-wrap justify-center items-center w-full z-20"
        >
          <li
            v-for="tape in tapes"
            :key="tape"
            class="basis-1/2 md:basis-1/3 text-center cursor-grab active:cursor-grabbing"
            :class="tape === 'ACDC LIVE' ? 'no-drag' : ''"
          >
            <CassetteTape :label="tape" :data-label="tape" />
          </li>
          <li id="no-drag">I am NOT draggable</li>
        </ul>
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

[data-label="ACDC LIVE"] {
  filter: hue-rotate(80deg) saturate(150%);
  transform: rotate(-5deg);
}
[data-label="Metallica"] {
  filter: hue-rotate(160deg) saturate(250%) brightness(90%);
  transform: rotate(5deg);
}
[data-label="Guns N' Roses"] {
  filter: hue-rotate(240deg) saturate(150%) brightness(85%);
  transform: rotate(-2deg);
}
[data-label="Def Leppard"] {
  filter: hue-rotate(320deg) saturate(200%) brightness(110%);
  transform: rotate(2deg);
}
[data-label="Bon Jovi"] {
  filter: hue-rotate(40deg) saturate(300%) brightness(105%);
  transform: rotate(-3deg);
}

#no-drag {
  margin-top: 1rem;
  background: #fff;
  padding: 0.5em 1em;
  color: red;
  border-radius: 0.25rem;
  cursor: grab;
  @apply shadow-md;
}
</style>
