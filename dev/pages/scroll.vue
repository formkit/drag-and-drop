<script setup lang="ts">
import { useDragAndDrop } from "../../src/vue/index";
const [parent, tapes] = useDragAndDrop([
  { name: "Depeche Mode", hasClass: false },
  { name: "Duran Duran", hasClass: false },
  { name: "Pet Shop Boys", hasClass: false },
  { name: "Kraftwerk", hasClass: false },
  { name: "Tears for Fears", hasClass: false },
  { name: "Checkbox with .drag-handle class", hasClass: true },
  { name: "kldsjfkldsjfkl", hasClass: true },
  { name: "dfdsf", hasClass: true },
  { name: "dfdfadf", hasClass: true },
]);
</script>

<template>
  <div
    style="
      height: 300px;
      width: 400px;
      overflow: scroll;
      position: absolute;
      top: 50%;
      left: 50%;
    "
  >
    <div>
      <div ref="parent" style="display: flex">
        <div
          v-for="tape in tapes"
          :key="tape.name"
          class="cassette"
          style="height: 1000px; width: 100px"
        >
          <div style="width: 400px">
            <button class="drag-handle">::</button>
          </div>
          <div>
            {{ tape.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
