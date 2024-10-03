import { reactive, html } from "@arrow-js/core";
import { dragAndDrop, dropOrSwap } from "@formkit/drag-and-drop";

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
      dropOrSwap({
        shouldSwap: () => state.todoSwap,
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
      dropOrSwap({
        shouldSwap: () => state.doneSwap,
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
    <button onclick=${() => (state.todoSwap = !state.todoSwap)}>
      ${() => (state.todoSwap ? "Disable" : "Enable")} swap
    </button>
    <ul class="kanban-list" id="done-list">
      ${state.dones.map((done) =>
        html`<li class="kanban-item">${done}</li>`.key(done)
      )}
    </ul>
    <button onclick=${() => (state.doneSwap = !state.doneSwap)}>
      ${() => (state.doneSwap ? "Disable" : "Enable")} swap
    </button>
  </div>
`(document.getElementById("app")!);
