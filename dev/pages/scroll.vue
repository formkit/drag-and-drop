<script setup>
import { useDragAndDrop } from "../../src/vue/index";
const [parent, tapes] = useDragAndDrop(
  [
    { name: "Depeche Mode", hasClass: false },
    { name: "Duran Duran", hasClass: false },
    { name: "Pet Shop Boys", hasClass: false },
    { name: "Kraftwerk", hasClass: false },
    { name: "Tears for Fears", hasClass: false },
    { name: "Checkbox with .drag-handle class", hasClass: true },
  ],
  {
    dragHandle: ".drag-handle",
  }
);
</script>

<template>
  <div style="height: 100px; overflow: scroll">
    <table>
      <thead>
        <tr>
          <th>Handle</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody ref="parent">
        <tr v-for="tape in tapes" :key="tape" class="cassette">
          <td><button class="drag-handle">::</button></td>
          <td>
            {{ tape.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
