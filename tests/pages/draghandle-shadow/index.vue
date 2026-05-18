<script setup lang="ts">
import { useDragAndDrop } from "../../../src/vue/index";

if (typeof window !== "undefined" && !customElements.get("shadow-drag-handle")) {
  class ShadowDragHandle extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;

      const itemId = this.getAttribute("item-id") ?? "";

      const root = this.attachShadow({ mode: "open" });

      root.innerHTML = `
        <style>
          .dragHandle {
            cursor: grab;
            color: #475569;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 4px;
            padding: 2px 6px;
            line-height: 1;
            font-size: 12px;
          }
        </style>
        <button id="${itemId}_dragHandle" class="dragHandle" type="button">::</button>
      `;
    }
  }

  customElements.define("shadow-drag-handle", ShadowDragHandle);
}

const [parent1, values1] = useDragAndDrop(["Apple", "Banana", "Orange"], {
  dragHandle: ".dragHandle",
  draggable: (el) => el.tagName === "LI",
});
</script>

<template>
  <h1>Shadow Drag Handle</h1>
  <ul ref="parent1" class="list">
    <li v-for="value in values1" :id="value" :key="value" class="item">
      <shadow-drag-handle :item-id="value" />
      <span class="label">{{ value }}</span>
    </li>
    <span id="values_1">{{ values1.map((x) => x).join(" ") }}</span>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
}

.item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin: 0.5rem 0;
  padding: 0.5rem;
}

.label {
  color: #334155;
}
</style>
