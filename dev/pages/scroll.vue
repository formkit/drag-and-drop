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
    style="height: 100px; width: 200px; overflow: scroll; background-color: red"
  >
    <div>
      <div ref="parent">
        <div
          v-for="tape in tapes"
          :key="tape.name"
          class="cassette"
          style="height: 100px; width: 300px"
        >
          <div><button class="drag-handle">::</button></div>
          <div>
            {{ tape.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
