import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";
import { multiDrag, selections } from "@formkit/drag-and-drop";

const state = reactive({
  files1: [
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
    "file6.txt",
    "file7.txt",
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
  <div class="kanban-board">
    <ul class="kanban-list" id="parent1">
      ${state.files1.map((file) =>
        html`
          <svg
            className="kanban-handle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path
              fill="currentColor"
              d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
            />
          </svg>
          <li class="kanban-item">${file}</li>
        `.key(file)
      )}
    </ul>
    <ul class="kanban-list" id="parent2">
      ${state.files2.map((file) =>
        html`
          <svg
            className="kanban-handle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path
              fill="currentColor"
              d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
            />
          </svg>
          <li class="kanban-item">${file}</li>
        `.key(file)
      )}
    </ul>
  </div>
`(document.getElementById("app")!);
