<script setup lang="ts">
import vueLogo from "/vuejs-icon.svg";

import { ref, onMounted } from "vue";

import { dragAndDrop } from "../../src/vue/index";

//dragAndDrop();
const playingCards = ref([
  "/cards/10_of_clubs.png",
  "/cards/jack_of_hearts.png",
  "/cards/queen_of_spades.png",
  "/cards/king_of_diamonds.png",
  "/cards/ace_of_clubs.png",
]);

onMounted(() => {
  const el = document.getElementById("playing_cards_vue");

  if (!(el instanceof HTMLElement)) return;

  dragAndDrop({
    parent: el,
    values: playingCards,
  });
});
</script>

<template>
  <div>
    <div class="logo">
      <img :src="vueLogo" className="logo" alt="Vite logo" />
    </div>
    <div class="content">
      <h3>Test 1: Init Parent</h3>
      <h4>
        Init parent by passing in the parent element directly to `dragAndDrop`
        function.
      </h4>
      <ul id="playing_cards_vue">
        <li v-for="card in playingCards" :key="card" class="item">
          <img :src="`${card}`" />
        </li>
      </ul>
    </div>
  </div>
</template>
