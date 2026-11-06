import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

const state = reactive({
  tapes: ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
});

dragAndDrop<string>({
  parent: document.getElementById("tape-list")!,
  getValues: () => state.tapes,
  setValues: (newValues) => {
    state.tapes = reactive(newValues);
  },
  config: {
    // Clicks and text selection inside .no-drag won't start a drag
    dragIgnore: ".no-drag",
  },
});

html`
  <ul id="tape-list">
    ${() =>
      state.tapes.map((tape) =>
        html`
          <li>
            ${tape}
            <input class="no-drag" />
          </li>
        `.key(tape)
      )}
  </ul>
`(document.getElementById("app")!);
