<script setup lang="ts">
import { ref } from "vue";

import { dragAndDrop } from "../../../src/vue/index";
import { animations } from "../../../src/index";

const props = defineProps<{
  id: string;
  testDescription: string;
}>();

const values1 = ref([
  {
    id: "10_of_clubs",
    src: "/cards/10_of_clubs.png",
  },
  {
    id: "jack_of_hearts",
    src: "/cards/jack_of_hearts.png",
  },
  {
    id: "queen_of_spades",
    src: "/cards/queen_of_spades.png",
  },
]);

const values2 = ref([
  {
    id: "three_of_diamonds",
    src: "/cards/3_of_diamonds.png",
  },
  {
    id: "four_of_clubs",
    src: "/cards/4_of_clubs.png",
  },
  {
    id: "five_of_hearts",
    src: "/cards/5_of_hearts.png",
  },
]);

const list1 = ref();
const list2 = ref();

dragAndDrop({
  parent: list1,
  values: values1,
  group: "group1",
  plugins: [animations()],
});
dragAndDrop({
  parent: list2,
  values: values2,
  group: "group1",
  plugins: [animations()],
});
</script>

<template>
  <div>
    <h3>#{{ props.id }}</h3>
    <h4>
      {{ props.testDescription }}
    </h4>
    <ul :id="props.id" ref="list1">
      <li
        v-for="card in values1"
        :key="card.id"
        class="item"
        :id="props.id + '_' + card.id"
      >
        <img :src="`${card.src}`" />
      </li>
    </ul>
    <ul :id="props.id" ref="list2">
      <li
        v-for="card in values2"
        :key="card.id"
        class="item"
        :id="props.id + '_' + card.id"
      >
        <img :src="`${card.src}`" />
      </li>
    </ul>
    <span :id="props.id + '_values'">
      {{ values1.map((x) => x.id).join(" ") }}
    </span>
  </div>
</template>

<style scoped>
ul {
  padding: 2em;
  background-color: red;
}
li {
  width: 44px;
  max-width: 44px;
  min-width: 44px;
  flex-grow: 0;
}

li img {
}
</style>
