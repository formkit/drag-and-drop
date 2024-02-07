<script setup lang="ts">
import vueLogo from "/vuejs-icon.svg";

import { ref, onMounted } from "vue";

import { dragAndDrop } from "../../src/vue/index";

const myList = ref();

const playing_cards_1 = ref([
  "/cards/10_of_clubs.png",
  "/cards/jack_of_hearts.png",
  "/cards/queen_of_spades.png",
  "/cards/king_of_diamonds.png",
  "/cards/ace_of_clubs.png",
]);

const playing_cards_2 = ref([
  "/cards/10_of_clubs.png",
  "/cards/jack_of_hearts.png",
  "/cards/queen_of_spades.png",
  "/cards/king_of_diamonds.png",
  "/cards/ace_of_clubs.png",
]);

onMounted(() => {
  const el = document.getElementById("playing_cards_vue_1");

  if (!(el instanceof HTMLElement)) return;

  dragAndDrop({
    parent: el,
    values: playing_cards_1,
  });
});

dragAndDrop({
  parent: myList,
  values: playing_cards_2,
});
</script>

<template>
  <div>
    <div class="logo">
      <img :src="vueLogo" className="logo" alt="Vite logo" />
    </div>
    <div class="content">
      <h3>#playing_cards_vue_1</h3>
      <h4>
        Init parent by passing in the parent element directly to `dragAndDrop`
        function.
      </h4>
      <ul id="playing_cards_vue_1">
        <li v-for="card in playing_cards_1" :key="card" class="item">
          <img :src="`${card}`" />
        </li>
      </ul>
      <div class="divider"></div>
      <h3>#playing_cards_vue_2</h3>
      <h4>
        Init parent by passing in the parent element using a ref to
        `dragAndDrop` function.
      </h4>
      <ul id="playing_cards_vue_2" ref="myList">
        <li v-for="card in playing_cards_2" :key="card" class="item">
          <img :src="`${card}`" />
        </li>
      </ul>
    </div>
  </div>
</template>
