import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

const state = reactive({
  items: ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
  dragStatus: "Not dragging",
  valuesChanged: "Not sorting",
});

html`
  <div>
    <strong>Rank your favorite flavors</strong>
    <span>${state.dragStatus}</span>
    <ul id="list">
      ${() => state.items.map((item) => html`<li>${item}</li>`.key(item))}
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
    onDragstart: () => {
      state.dragStatus = "Dragging";
    },
    onDragend: () => {
      state.dragStatus = "Not dragging";
      state.valuesChanged = "Not sorting";
    },
    onSort: (event) => {
      state.valuesChanged = `${event.previousValues} -> ${event.values}`;
    },
  },
});
