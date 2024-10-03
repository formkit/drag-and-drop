import React from "react";
import { insert } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
  "before:block",
  'before:content-["Insert"]',
  "before:whitespace-nowrap",
  "before:block",
  "before:bg-blue-500",
  "before:py-1",
  "before:px-2",
  "before:rounded-full",
  "before:text-xs",
  "before:absolute",
  "before:top-1/2",
  "before:left-1/2",
  "before:-translate-y-1/2",
  "before:-translate-x-1/2",
  "before:text-white",
  "before:text-xs",
];

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
        insert({
          insertPoint: (parent) => {
            const div = document.createElement("div");

            for (const cls of insertPointClasses) div.classList.add(cls);

            return div;
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
        insert({
          insertPoint: (parent) => {
            const div = document.createElement("div");

            for (const cls of insertPointClasses) div.classList.add(cls);

            return div;
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
