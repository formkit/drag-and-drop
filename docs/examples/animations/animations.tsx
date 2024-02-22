import React from "react";
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>(
    [
      "ACDC LIVE",
      "Metallica",
      "Guns N' Roses",
      "Def Leppard",
      "Bon Jovi",
      "Van Halen",
    ],
    { plugins: [animations()] }
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
