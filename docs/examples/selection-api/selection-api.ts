import { reactive, html } from "@arrow-js/core";
import {
  dragAndDrop,
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "@formkit/drag-and-drop";

const state = reactive({
  tapes: ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
});

dragAndDrop<string>({
  parent: document.getElementById("tape-list")!,
  getValues: () => state.tapes,
  setValues: (newValues) => {
    state.tapes = reactive(newValues);
  },
  config: { multiDrag: true, selectedClass: "selected" },
});

const list = () => document.getElementById("tape-list")!;

html`
  <ul id="tape-list">
    ${() => state.tapes.map((tape) => html`<li>${tape}</li>`.key(tape))}
  </ul>
  <button @click="${() => setSelectedValues(list(), ["Kraftwerk", "Pet Shop Boys"])}">
    Select synth-pop
  </button>
  <button @click="${() => console.log(selectedValues(list()))}">Log selection</button>
  <button @click="${() => clearSelection()}">Clear</button>
`(document.getElementById("app")!);
