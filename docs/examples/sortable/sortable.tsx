import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const todoItems = ["Schedule perm", "Rewind VHS tapes", "Make change for the arcade", "Get disposable camera developed", "Learn C++", "Return Nintendo Power Glove"];
  const doneItems = ["Pickup new mix-tape from Beth"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    { 
      group: "todoList",
      sortable: false
    }
  );
  const [doneList, dones] = useDragAndDrop<HTMLUListElement, string>(
    doneItems,
    { 
      group: "todoList",
      sortable: false
    }
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
      <ul ref={doneList}>
        {dones.map((done) => (
          <li className="kanban-item" key={done}>
            {done}
          </li>
        ))}
      </ul>
    </div>
  );
}
