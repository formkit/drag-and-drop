import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>([
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
    "Spandau Ballet",
  ]);

  return (
    <ul ref={parent}>
      {tapes.map((tape) => (
        <li className="cassette" data-label={tape} key={tape}>
          {tape}
        </li>
      ))}
    </ul>
  );
}
