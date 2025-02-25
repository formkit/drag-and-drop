import React from "react";
import { useState } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function App() {
  const [dragStatus, setDragStatus] = useState("Not dragging");
  const [valuesChanged, setValuesChanged] = useState("Not sorting");

  const [parent, items] = useDragAndDrop<HTMLUListElement, string>(
    ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
    {
      onDragstart: () => {
        setDragStatus("Dragging");
      },
      onDragend: () => {
        setDragStatus("Not dragging");
        setValuesChanged("Not sorting");
      },
      onSort: (event) => {
        setValuesChanged(`${event.previousValues} -> ${event.values}`);
      },
    }
  );

  return (
    <div>
      <strong>Rank your favorite flavors</strong>
      <br />
      <span>{dragStatus}</span>
      <span>{valuesChanged}</span>
      <br />
      <ul ref={parent}>
        {items.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
