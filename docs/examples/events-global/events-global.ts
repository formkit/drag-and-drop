import { reactive, html } from "@arrow-js/core";
import { dragAndDrop, state as DNDState } from "@formkit/drag-and-drop";

const state = reactive({
  items: ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
  dragStatus: "Not dragging",
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
});

DNDState.on("dragStarted", () => {
  state.dragStatus = "Dragging";
});

DNDState.on("dragEnded", () => {
  state.dragStatus = "Not dragging";
});
