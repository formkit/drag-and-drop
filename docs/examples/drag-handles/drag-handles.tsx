import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const todoItems = ["Schedule perm", "Rewind VHS tapes", "Make change for the arcade", "Get disposable camera developed", "Learn C++", "Return Nintendo Power Glove"];
  const doneItems = ["Pickup new mix-tape from Beth", "Implement drag handles"];

  const [todoList, todos] = useDragAndDrop<HTMLUListElement, string>(
    todoItems,
    {
      group: "todoList",
      dragHandle: ".kanban-handle"
    }
  );
  const [doneList, dones] = useDragAndDrop<HTMLUListElement, string>(
    doneItems,
    {
      group: "todoList",
      dragHandle: ".kanban-handle"
    }
  );
  return (
    <div className="kanban-board">
      <ul ref={todoList} className="kanban-column">
        {todos.map((todo) => (
          <li className="kanban-item" key={todo}>
            <span className="kanban-handle"></span>
            {todo}
          </li>
        ))}
      </ul>
      <ul ref={doneList} className="kanban-column">
        {dones.map((done) => (
          <li className="kanban-item" key={done}>
            <span className="kanban-handle"></span>
            {done}
          </li>
        ))}
      </ul>
    </div>
  );
}
