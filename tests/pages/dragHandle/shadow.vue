<script setup lang="ts">
import { onMounted } from "vue";
import { useDragAndDrop } from "../../../src/vue/index";

const [parent, values] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  dragHandle: ".dragHandle",
});

onMounted(() => {
  // Render each item's drag handle inside an open shadow root so the handle
  // is invisible to light-DOM queries (querySelectorAll/elementFromPoint).
  document.querySelectorAll<HTMLElement>(".shadow-host").forEach((host) => {
    const root = host.attachShadow({ mode: "open" });

    const handle = document.createElement("span");

    handle.id = host.dataset.handleId as string;
    handle.className = "dragHandle";
    handle.textContent = "⠿";

    root.appendChild(handle);
  });
});
</script>

<template>
  <h1>Drag Handles in Shadow DOM</h1>
  <ul ref="parent" class="list">
    <li v-for="value in values" :id="value" :key="value" class="item">
      <span
        class="shadow-host"
        :data-handle-id="value + '_shadowHandle'"
      ></span>
      <span>{{ value }}</span>
    </li>
  </ul>
  <div class="values">
    Values:
    <span id="shadow_values">{{ values.join(" ") }}</span>
  </div>
</template>
