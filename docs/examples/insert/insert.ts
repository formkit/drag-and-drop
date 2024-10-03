import { reactive, html } from "@arrow-js/core";
import { dragAndDrop, insert } from "@formkit/drag-and-drop";

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
  "before:block",
  'before:content-["Insert"]',
  "before:whitespace-nowrap",
  "before:block",
  "before:bg-blue-500",
  "before:py-1",
  "before:px-2",
  "before:rounded-full",
  "before:text-xs",
  "before:absolute",
  "before:top-1/2",
  "before:left-1/2",
  "before:-translate-y-1/2",
  "before:-translate-x-1/2",
  "before:text-white",
  "before:text-xs",
];

const state = reactive({
  todos: [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ],
  dones: ["Pickup new mix-tape from Beth"],
  todoSwap: false,
  doneSwap: false,
});

dragAndDrop<string>({
  parent: document.getElementById("todo-list")!,
  getValues: () => state.todos,
  setValues: (newValues) => {
    state.todos = reactive(newValues);
  },
  config: {
    group: "todoList",
    plugins: [
      insert({
        insertPoint: (parent) => {
          const div = document.createElement("div");

          for (const cls of insertPointClasses) div.classList.add(cls);

          return div;
        },
      }),
    ],
  },
});

dragAndDrop<string>({
  parent: document.getElementById("done-list")!,
  getValues: () => state.dones,
  setValues: (newValues) => {
    state.dones = reactive(newValues);
  },
  config: {
    group: "todoList",
    plugins: [
      insert({
        insertPoint: () => document.createElement("div"),
      }),
    ],
  },
});

html`
  <div class="kanban-board">
    <ul class="kanban-list" id="todo-list">
      ${() =>
        state.todos.map((todo) =>
          html`<li class="kanban-item">${todo}</li>`.key(todo)
        )}
    </ul>
    <ul class="kanban-list" id="done-list">
      ${state.dones.map((done) =>
        html`<li class="kanban-item">${done}</li>`.key(done)
      )}
    </ul>
  </div>
`(document.getElementById("app")!);
