<script setup lang="ts">
import type { ParentConfig } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const [source, items1] = useDragAndDrop(
  [
    "dungeon_master.exe",
    "map_1.dat",
    "map_2.dat",
    "character1.txt",
    "character2.txt",
    "shell32.dll",
    "README.txt",
  ],
  {
    accepts: () => {
      return true;
    },
  }
);

const config1: Partial<ParentConfig<string>> = {};

config1.accepts = (_parent, lastParent) => {
  if (lastParent.el === target2.value) {
    return false;
  }
  return items2.value.length < 3;
};

const config2: Partial<ParentConfig<string>> = {};

config2.accepts = (_parent, lastParent) => {
  if (lastParent.el === target1.value) {
    return false;
  }
  return items3.value.length < 5;
};

const [target1, items2] = useDragAndDrop(["knight.bmp", "dragon.bmp"], config1);
const [target2, items3] = useDragAndDrop(["brick.bmp", "moss.bmp"], config2);
</script>

<template>
  <DemoContainer name="accepts">
    <div
      class="border-2 border-indigo-300 !text-base md:!text-lg lg:!text-2xl dark:bg-slate-800 antialiased"
    >
      <div class="flex justify-between font-oldschool">
        <div class="min-h-[300px] w-1/2 border-2 border-indigo-300 grow">
          <ul ref="source">
            <li
              v-for="item in items1"
              class="!text-base md:!text-lg lg:!text-2xl"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="flex flex-col w-1/2">
          <div class="border-2 border-indigo-300 grow">
            <span class="block bg-white/50 dark:bg-white/20 text-center"
              >I can accept 3 items</span
            >
            <ul ref="target1" class="border-solid">
              <li
                v-for="item in items2"
                class="!text-base md:!text-lg lg:!text-2xl"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="border-2 border-indigo-300 grow">
            <span class="block bg-white/50 dark:bg-white/20 text-center"
              >I can accept 5 items.</span
            >
            <ul ref="target2" class="border-solid">
              <li
                v-for="item in items3"
                class="!text-base md:!text-lg lg:!text-2xl"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
ul {
  @apply list-none p-2 md:p-4;
}
</style>
