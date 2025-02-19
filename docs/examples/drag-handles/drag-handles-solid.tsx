/** @jsxImportSource solid-js */
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function MyComponent() {
  const todoItems = [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ];
  const doneItems = ["Pickup new mix-tape from Beth", "Implement drag handles"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    {
      group: "todoList",
      dragHandle: ".kanban-handle",
    }
  );
  const [doneList, dones] = useDragAndDrop<HTMLUListElement, string>(
    doneItems,
    {
      group: "todoList",
      dragHandle: ".kanban-handle",
    }
  );

  return (
    <div class="kanban-board">
      <ul ref={todoList} class="kanban-column">
        <For each={todos()}>
          {(todo) => (
            <li class="kanban-item">
              <span class="kanban-handle"></span>
              {todo}
            </li>
          )}
        </For>
      </ul>
      <ul ref={doneList} class="kanban-column">
        <For each={dones()}>
          {(done) => (
            <li class="kanban-item">
              <span class="kanban-handle"></span>
              {done}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
