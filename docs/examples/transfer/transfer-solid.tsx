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
  const doneItems = ["Pickup new mix-tape from Beth"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    { group: "todoList" }
  );
  const [doneList, dones] = useDragAndDrop<HTMLUListElement, string>(
    doneItems,
    { group: "todoList" }
  );

  return (
    <div class="kanban-board">
      <ul ref={todoList}>
        <For each={todos()}>
          {(todo) => <li class="kanban-item">{todo}</li>}
        </For>
      </ul>
      <ul ref={doneList}>
        <For each={dones()}>
          {(done) => <li class="kanban-item">{done}</li>}
        </For>
      </ul>
    </div>
  );
}
