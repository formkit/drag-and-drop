import { reactive, html } from "@arrow-js/core";
import type { DNDPlugin } from "@formkit/drag-and-drop";
import { dragAndDrop, parents } from "@formkit/drag-and-drop";

const state = reactive({
  items: ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
});

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

    setupNodeRemap() {},
    tearDownNodeRemap() {},
  };
};

html`
  <div>
    <h1>${dragStatus}</h1>
    <h1>${dragCount}</h1>
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
