<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import {
  handleDragstart,
  handleTouchstart,
  handleDragoverNode,
  handleTouchOverNode,
} from "@formkit/drag-and-drop";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  // Prevent element with value "Orange" from being dragged
  handleDragstart: (eventData) => {
    if (eventData.targetData.node.data.value === "Orange") {
      eventData.e.preventDefault();
      return;
    }

    handleDragstart(eventData);
  },

  // Prevent element with value "Orange" from being dragged on mobile
  handleTouchstart: (eventData) => {
    if (eventData.targetData.node.data.value === "Orange") {
      eventData.e.preventDefault();
      return;
    }

    handleTouchstart(eventData);
  },

  // Prevent sort or transfer operation when dragged over element with value
  // "Orange"
  handleDragoverNode: (eventData) => {
    if (eventData.targetData.node.data.value !== "Orange")
      handleDragoverNode(eventData);
  },

  // Prevent sort or transfer operation when dragged over element with value
  // "Orange" on mobile
  handleTouchOverNode: (eventData) => {
    if (eventData.detail.targetData.node.data.value !== "Orange")
      handleTouchOverNode(eventData);
  },
});
</script>

<template>
  <h2 class="text-2xl my-4">
    Example showing how to prevent a given node from being dragged or sorted (in
    this case, "Orange")
  </h2>
  <div>
    <ul ref="parent">
      <li
        v-for="value in values"
        :id="value"
        :key="value"
        class="border-2 border-indigo-600 w-1/4 text-center my-2"
      >
        {{ value }}
      </li>
    </ul>
    <span id="sort_values">
      {{ values.map((x) => x).join(" ") }}
    </span>
  </div>
</template>
