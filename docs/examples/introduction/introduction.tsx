import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const [parent, items] = useDragAndDrop<HTMLUListElement, string>([
    "🍦 vanilla",
    "🍫 chocolate",
    "🍓 strawberry",
  ]);
  return (
    <ul ref={parent}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
