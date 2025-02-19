/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { dropOrSwap } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "../../../src/solid/index";

export function MyComponent() {
  const todoItems = [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ];

  const [todoSwap, setTodoSwap] = createSignal(false);
  const [doneSwap, setDoneSwap] = createSignal(false);

  const doneItems = ["Pickup new mix-tape from Beth"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    {
      group: "todoList",
      plugins: [
        dropOrSwap({
          shouldSwap: () => {
            return todoSwap();
          },
        }),
      ],
    }
  );

  const [doneList, dones] = useDragAndDrop<HTMLUListElement, string>(
    doneItems,
    {
      group: "todoList",
      plugins: [
        dropOrSwap({
          shouldSwap: () => {
            return doneSwap();
          },
        }),
      ],
    }
  );

  function toggleTodoSwap() {
    setTodoSwap(!todoSwap());
  }

  function toggleDoneSwap() {
    setDoneSwap(!doneSwap());
  }

  return (
    <div class="kanban-board">
      <ul ref={todoList}>
        <For each={todos()}>
          {(todo) => (
            <li class="kanban-item" data-key={todo}>
              {todo}
            </li>
          )}
        </For>
      </ul>
      <button onClick={toggleTodoSwap}>
        Toggle {todoSwap() ? "Drop" : "Swap"}
      </button>
      <ul ref={doneList}>
        <For each={dones()}>
          {(done) => (
            <li class="kanban-item" data-key={done}>
              {done}
            </li>
          )}
        </For>
      </ul>
      <button onClick={toggleDoneSwap}>
        Toggle {doneSwap() ? "Drop" : "Swap"}
      </button>
    </div>
  );
}
