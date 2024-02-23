import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

const state = reactive({
  tapes: [
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
    "Spandau Ballet",
  ],
});

html`
  <ul id="cassettes">
    ${state.tapes.map((tape) =>
      html`<li class="cassette" data-label="${tape}">${tape}</li>`.key(tape)
    )}
    <div id="no-drag">I am NOT draggable</div>
  </ul>
`(document.getElementById("app")!);

dragAndDrop<string>({
  parent: document.getElementById("cassettes")!,
  getValues: () => state.tapes,
  setValues: (newValues) => {
    state.tapes = reactive(newValues);
  },
  config: {
    draggable: (el) => {
      return el.id !== "no-drag";
    },
  },
});
