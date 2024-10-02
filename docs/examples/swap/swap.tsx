import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { dropOrSwap } from "@formkit/drag-and-drop";

export function myComponent() {
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
    { group: "todoList", plugins: [dropOrSwap()] }
  );

  return (
    <div className="kanban-board">
      <ul ref={todoList}>
        {todos.map((todo) => (
          <li className="kanban-item" key={todo}>
            {todo}
          </li>
        ))}
      </ul>
    </div>
  );
}
