import React from "react";
import { dropOrSwap } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const todoItems = [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ];

  const [todoSwap, setTodoSwap] = React.useState(false);
  const [doneSwap, setDoneSwap] = React.useState(false);

  const doneItems = ["Pickup new mix-tape from Beth"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    {
      group: "todoList",
      plugins: [
        dropOrSwap({
          shouldSwap: () => {
            return todoSwap;
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
            return doneSwap;
          },
        }),
      ],
    }
  );

  function toggleTodoSwap() {
    setTodoSwap(!todoSwap);
  }

  function toggleDoneSwap() {
    setDoneSwap(!doneSwap);
  }

  return (
    <div className="kanban-board">
      <ul ref={todoList}>
        {todos.map((todo) => (
          <li className="kanban-item" key={todo}>
            {todo}
          </li>
        ))}
      </ul>
      <button onClick={toggleTodoSwap}>
        {" "}
        Toggle {todoSwap ? "Drop" : "Swap"}
      </button>
      <ul ref={doneList}>
        {dones.map((done) => (
          <li className="kanban-item" key={done}>
            {done}
          </li>
        ))}
      </ul>
      <button onClick={toggleDoneSwap}>
        Toggle {doneSwap ? "Drop" : "Swap"}
      </button>
    </div>
  );
}
