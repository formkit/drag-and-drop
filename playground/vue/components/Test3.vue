<script setup lang="ts">
import { ref } from "vue";
import type {
  DragState,
  TouchState,
  NodeDragEventData,
  NodeEventData,
  NodeTouchEventData,
  Node,
} from "../../../src/types";
import { dragAndDrop } from "../../../src/vue/index";
import { parents, state } from "../../../src/index";
import { addClass, removeClass } from "../../../src/utils";

const props = defineProps<{
  id: string;
  testDescription: string;
}>();

const values = ref([
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

const list = ref();

dragAndDrop({
  parent: list,
  values,
  plugins: [swap()],
  dropZoneClass: "drop-zone",
});

function swapTransfer<T>(
  state: DragState<T> | TouchState<T>,
  data: NodeDragEventData<T> | NodeTouchEventData<T>
) {
  const parentData = parents.get(data.targetData.parent.el);

  if (!parentData) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.touchDropZoneClass
      : parentData.config.dropZoneClass;

  const nodes = state.lastParent.data.enabledNodes.concat(
    data.targetData.parent.data.enabledNodes
  );

  removeClass(
    nodes.map((x) => x.el),
    dropZoneClass
  );

  addClass([data.targetData.node.el], dropZoneClass, true);

  state.preventEnter = false;
}

function dragstartClasses(
  el: HTMLElement | Node | Element,
  draggingClass: string | undefined
) {
  addClass([el], draggingClass);

  setTimeout(() => {
    removeClass([el], draggingClass);
  });
}

function swap() {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);
    if (!parentData) return;

    return {
      setup() {
        parentData.config.performSort = swapTransfer;

        parentData.config.dragstartClasses = dragstartClasses;

        const swapEnd = parentData.config.handleEnd;

        parentData.config.handleEnd = <T>(data: NodeEventData<T>) => {
          if (!state) return;

          console.log("swappednode value", state.swappedNodeValue);
          swapEnd(data as NodeDragEventData<T>);
        };

        if (!state) return;
      },
    };
  };
}
</script>

<template>
  <div>
    <h3>#{{ props.id }}</h3>
    <h4>
      {{ props.testDescription }}
    </h4>
    <ul :id="props.id" ref="list">
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

<style>
.drop-zone {
  opacity: 0.5;
}
</style>
