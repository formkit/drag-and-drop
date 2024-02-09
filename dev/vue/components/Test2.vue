<script setup lang="ts">
import { ref, onMounted } from "vue";

import { dragAndDrop } from "../../../src/vue/index";

const props = defineProps<{
  id: string;
  testDescription: string;
}>();

const values = ref([
  "/cards/10_of_clubs.png",
  "/cards/jack_of_hearts.png",
  "/cards/queen_of_spades.png",
  "/cards/king_of_diamonds.png",
  "/cards/ace_of_clubs.png",
]);

const list = ref();

dragAndDrop({
  parent: list,
  values,
});
</script>

<template>
  <div>
    <h3>#{{ props.id }}</h3>
    <h4>
      {{ props.testDescription }}
    </h4>
    <ul :id="props.id" ref="list">
      <li v-for="card in values" :key="card" class="item">
        <img :src="`${card}`" />
      </li>
    </ul>
  </div>
</template>
