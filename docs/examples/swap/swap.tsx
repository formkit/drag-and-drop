import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { swap } from "@formkit/drag-and-drop";

export function myComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>(
    [
      "Depeche Mode",
      "Duran Duran",
      "Pet Shop Boys",
      "Kraftwerk",
      "Tears for Fears",
      "Spandau Ballet",
    ],
    {
      plugins: [swap()],
    }
  );
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
