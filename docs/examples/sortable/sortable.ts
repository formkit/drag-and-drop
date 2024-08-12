import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

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
});

dragAndDrop<string>({
  parent: document.getElementById("todo-list")!,
  getValues: () => state.todos,
  setValues: (newValues) => {
    state.todos = reactive(newValues);
  },
  config: {
    group: "todoList",
    sortable: false,
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
    sortable: false,
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
