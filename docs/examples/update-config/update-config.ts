import { reactive, html } from "@arrow-js/core";
import { dragAndDrop, updateConfig } from "@formkit/drag-and-drop";

const state = reactive({
  tapes: [
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
    "Spandau Ballet",
  ],
  disabled: false,
});

function toggleDisabled() {
  state.disabled = !state.disabled;

  updateConfig(document.getElementById("cassettes")!, {
    disabled: !state.disabled,
  });
}

html`
  <ul id="cassettes">
    ${state.tapes.map((tape) =>
      html`<li class="cassette" data-label="${tape}">${tape}</li>`.key(tape)
    )}
  </ul>
  <button onclick=${toggleDisabled}>Toggle Disabled</button>
`(document.getElementById("app")!);

dragAndDrop<string>({
  parent: document.getElementById("cassettes")!,
  getValues: () => state.tapes,
  setValues: (newValues) => {
    state.tapes = reactive(newValues);
  },
});
