import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

const state = reactive({
  items1: [
    "dungeon_master.exe",
    "map_1.dat",
    "map_2.dat",
    "character1.txt",
    "character2.txt",
    "shell32.dll",
    "README.txt",
  ],
  items2: ["item1", "item2"],
  items3: ["items3", "item4"],
});

dragAndDrop<string>({
  parent: document.getElementById("source")!,
  getValues: () => state.items1,
  setValues: (newValues) => {
    state.items1 = reactive(newValues);
  },
  config: {
    accepts: () => {
      return true;
    },
  },
});

dragAndDrop<string>({
  parent: document.getElementById("target1")!,
  getValues: () => state.items2,
  setValues: (newValues) => {
    state.items2 = reactive(newValues);
  },
  config: {
    accepts: () => {
      return state.items1.length < 3;
    },
  },
});

dragAndDrop<string>({
  parent: document.getElementById("target2")!,
  getValues: () => state.items3,
  setValues: (newValues) => {
    state.items3 = reactive(newValues);
  },
  config: {
    accepts: () => {
      return state.items1.length < 3;
    },
  },
});

html`
  <div>
    <ul id="source">
      ${state.items1.map((item) => html`<li>${item}</li>`)}
    </ul>
    <div>
      <h5>I can accept up to three items</h5>
      <ul id="target1">
        ${state.items2.map((item) => html`<li>${item}</li>`)}
      </ul>
      <h5>I can accept up to five items</h5>
      <ul id="target2">
        ${state.items2.map((item) => html`<li>${item}</li>`)}
      </ul>
    </div>
  </div>
`(document.getElementById("app")!);
