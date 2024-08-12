import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";
import { multiDrag, selections } from "@formkit/drag-and-drop";

const state = reactive({
  files1: [
    "dungeon_master.exe",
    "map_1.dat",
    "map_2.dat",
    "character1.txt",
    "character2.txt",
    "shell32.dll",
    "README.txt",
  ],
  files2: [] as string[],
});

dragAndDrop<string>({
  parent: document.getElementById("parent1")!,
  getValues: () => state.files1,
  setValues: (newValues) => {
    state.files1 = reactive(newValues);
  },
  config: {
    group: "A",
    plugins: [
      multiDrag({
        plugins: [
          selections({
            selectedClass: "bg-blue-500 text-white",
          }),
        ],
      }),
    ],
  },
});

dragAndDrop<string>({
  parent: document.getElementById("parent2")!,
  getValues: () => state.files2,
  setValues: (newValues) => {
    state.files2 = reactive(newValues);
  },
  config: {
    group: "A",
    plugins: [
      multiDrag({
        plugins: [
          selections({
            selectedClass: "bg-blue-500 text-white",
          }),
        ],
      }),
    ],
  },
});

html`
  <div class="file-manager">
    <ul class="file-list" id="parent1">
      ${() =>
        state.files1.map((file) =>
          html` <li class="file">${file}</li> `.key(file)
        )}
    </ul>
    <ul class="file-list" id="parent2">
      ${state.files2.map((file) =>
        html` <li class="file">${file}</li> `.key(file)
      )}
    </ul>
  </div>
`(document.getElementById("app")!);
