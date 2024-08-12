import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

const state = reactive({
  items: ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
});

html`
  <ul id="list">
    ${() => state.items.map((item) => html`<li>${item}</li>`.key(item))}
  </ul>
`(document.getElementById("app")!);

dragAndDrop<string>({
  parent: document.getElementById("list")!,
  getValues: () => state.items,
  setValues: (newValues) => {
    state.items = reactive(newValues);
  },
});
