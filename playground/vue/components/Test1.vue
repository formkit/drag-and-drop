<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

const props = defineProps<{
  id: string;
  testDescription: string;
}>();
const [parent, values] = useDragAndDrop([
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
</script>

<template>
  <div>
    <h3>#{{ props.id }}</h3>
    <h4>
      {{ props.testDescription }}
    </h4>
    <ul ref="parent">
      <li
        v-for="card in values"
        :key="card.id"
        class="item"
        :id="props.id + '_' + card.id"
      >
        <img :src="`${card.src}`" />
      </li>
    </ul>
    <span :id="props.id + '_values'">
      {{ values.map((x) => x.id).join(" ") }}
    </span>
  </div>
</template>
