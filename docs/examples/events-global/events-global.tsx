import React from "react";
import { useState } from "react";
import { state } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function App() {
  const [dragStatus, setDragStatus] = useState("Not dragging");

  const [parent, items] = useDragAndDrop<HTMLUListElement, string>([
    "🍦 vanilla",
    "🍫 chocolate",
    "🍓 strawberry",
  ]);

  state.on("dragStarted", () => setDragStatus("Dragging"));

  state.on("dragEnded", () => setDragStatus("Not dragging"));

  return (
    <div>
      <strong>Rank your favorite flavors</strong>
      <br />
      <span>{dragStatus}</span>
      <br />
      <ul ref={parent}>
        {items.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
