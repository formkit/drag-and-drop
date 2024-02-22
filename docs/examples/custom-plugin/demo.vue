<script setup lang="ts">
import type { DNDPlugin } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { parents, state } from "@formkit/drag-and-drop";

const dragStatus = ref("Not dragging");

const dragCount = ref(0);

const dragStatusPlugin: DNDPlugin = (parent) => {
  const parentData = parents.get(parent);

  if (!parentData) return;

  function dragstart(event: DragEvent) {
    const node = event.target as HTMLElement;
    dragStatus.value = `Dragging ${node.textContent}`;
    dragCount.value++;
  }

  function dragend() {
    dragStatus.value = "Not dragging";
  }

  return {
    setup() {},
    teardown() {},
    setupNode(data) {
      data.node.addEventListener("dragstart", dragstart);

      data.node.addEventListener("dragend", dragend);
    },
    tearDownNode(data) {
      data.node.removeEventListener("dragstart", dragstart);

      data.node.removeEventListener("dragend", dragend);
    },

    setupNodeRemap(data) {},
    tearDownNodeRemap(data) {},
  };
};

const [parent, flavors] = useDragAndDrop(
  ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
  {
    plugins: [dragStatusPlugin],
  }
);
</script>

<template>
  <strong>Rank your favorite flavors</strong>
  <DemoContainer name="custom-plugin">
    <div>Drag count: {{ dragCount }}</div>
    <div>Drag status: {{ dragStatus }}</div>
    <div ref="parent">
      <div v-for="flavor in flavors" :key="flavor">
        {{ flavor }}
      </div>
    </div>
  </DemoContainer>
</template>
