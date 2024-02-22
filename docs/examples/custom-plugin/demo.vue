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
  <DemoContainer name="custom-plugin">
    <div class="border-4 p-4 border-indigo-300 dark:bg-slate-800 antialiased">
      <div class="font-oldschool mb-4 text-lg md:text-xl lg:text-2xl">
        <span class="antialiased">=== Rank your favorite flavors ===</span>
        <div>Drag count: {{ dragCount }}</div>
        <div>Drag status: {{ dragStatus }}</div>
      </div>
      <div
        ref="parent"
        class="border-2 border-indigo-300 font-oldschool text-lg md:text-xl lg:text-2xl antialiased"
      >
        <div
          v-for="flavor in flavors"
          :key="flavor"
          class="border-2 border-indigo-300 p-2"
        >
          {{ flavor }}
        </div>
      </div>
    </div>
  </DemoContainer>
</template>
