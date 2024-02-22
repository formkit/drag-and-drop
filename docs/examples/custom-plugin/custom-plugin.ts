import { reactive, html } from "@arrow-js/core";
import type { DNDPlugin } from "@formkit/drag-and-drop";
import { dragAndDrop, parents } from "@formkit/drag-and-drop";

const state = reactive({
  items: ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
  dragStatus: "Not dragging",
  dragCount: 0,
});

const dragStatusPlugin: DNDPlugin = (parent) => {
  const parentData = parents.get(parent);

  if (!parentData) return;

  function dragstart(event: DragEvent) {
    const node = event.target as HTMLElement;
    state.dragStatus = `Dragging ${node.textContent}`;
    state.dragCount++;
  }

  function touchstart(event: TouchEvent) {
    const node = event.target as HTMLElement;
    state.dragStatus = `Dragging ${node.textContent}`;
    state.dragCount++;
  }

  function dragend() {
    state.dragStatus = "Not dragging";
  }

  return {
    setup() {},
    teardown() {},
    setupNode(data) {
      data.node.addEventListener("dragstart", dragstart);

      data.node.addEventListener("touchstart", touchstart);

      data.node.addEventListener("dragend", dragend);
    },
    tearDownNode(data) {
      data.node.removeEventListener("dragstart", dragstart);

      data.node.removeEventListener("touchstart", touchstart);

      data.node.removeEventListener("dragend", dragend);
    },

    setupNodeRemap() {},
    tearDownNodeRemap() {},
  };
};

html`
  <div>
    <h1>${state.dragStatus}</h1>
    <h1>${state.dragCount}</h1>
    <ul id="list">
      ${state.items.map((item) => html`<li>${item}</li>`.key(item))}
    </ul>
  </div>
`(document.getElementById("app")!);

dragAndDrop<string>({
  parent: document.getElementById("list")!,
  getValues: () => state.items,
  setValues: (newValues) => {
    state.items = reactive(newValues);
  },
  config: {
    plugins: [dragStatusPlugin],
  },
});
