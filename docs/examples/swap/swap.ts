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
});

dragAndDrop<string>({
  parent: document.getElementById("todo-list")!,
  getValues: () => state.todos,
  setValues: (newValues) => {
    state.todos = reactive(newValues);
  },
  config: {
    group: "todoList",
    plugins: [dropOrSwap()],
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
  </div>
`(document.getElementById("app")!);
