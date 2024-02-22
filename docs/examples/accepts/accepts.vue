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

const [target1, items2] = useDragAndDrop(["item1", "item2"], config1);

const [target2, items3] = useDragAndDrop(["item3", "item4"], config2);
</script>

<template>
  <div name="accepts">
    <div class="flex justify-between">
      <div>
        <ul ref="source">
          <li v-for="item in items1" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="flex flex-col">
        <div>
          <h5>I can accept up to three items</h5>
          <ul ref="target1" class="border-solid border-2 border-indigo-600">
            <li v-for="item in items2" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          I can accept up to five items.
          <ul ref="target2" class="border-solid border-2 border-indigo-600">
            <li v-for="item in items3" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
